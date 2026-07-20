/**
 * Unit Tests — RWAMarketplace
 * Run: npx hardhat test test/RWAMarketplace.unit.test.js
 *
 * 20 focused tests that exercise every branch of RWAMarketplace in
 * isolation using Hardhat's in-process EVM.
 */
const { expect } = require("chai");
const { ethers } = require("hardhat");

const MIN_PRICE = ethers.parseUnits("0.001", 18);   // 0.001 ETH in wei
const TOKEN_SUPPLY = ethers.parseUnits("1000000", 18);
const LIST_AMOUNT = ethers.parseUnits("100", 18);
const PRICE_PER_UNIT = ethers.parseUnits("0.01", 18); // 0.01 ETH per token

describe("RWAMarketplace — Unit Tests", function () {
  let marketplace, token;
  let owner, seller, buyer, stranger;

  beforeEach(async function () {
    [owner, seller, buyer, stranger] = await ethers.getSigners();

    // Deploy the property token; seller gets the full supply
    const TokenFactory = await ethers.getContractFactory("RWAPropertyToken");
    token = await TokenFactory.deploy(
      "Billion Towers Property Token",
      "BTPT",
      "PROP-0001",
      "Arbitrum Real Estate Asset",
      1_000_000n,
      TOKEN_SUPPLY,
      seller.address,
    );
    await token.waitForDeployment();

    // Deploy the marketplace with a minimum price of 0.001 ETH
    const MarketFactory = await ethers.getContractFactory("RWAMarketplace");
    marketplace = await MarketFactory.deploy(MIN_PRICE);
    await marketplace.waitForDeployment();
  });

  // ── 1. Constructor / initial state ───────────────────────────────────────

  it("01 — marketplace starts paused (s_isActive = false)", async function () {
    // The contract is intentionally paused on deploy to let the owner configure it first
    expect(await marketplace.s_isActive()).to.equal(false);
  });

  it("02 — minimum price per unit is set correctly from constructor", async function () {
    // The minimum enforced listing price must match what was passed in
    expect(await marketplace.s_minimumPricePerUnit()).to.equal(MIN_PRICE);
  });

  it("03 — next listing ID starts at zero", async function () {
    // Fresh marketplace has no listings so the counter starts at 0
    expect(await marketplace.s_nextListingId()).to.equal(0n);
  });

  it("04 — deployer is the owner", async function () {
    // Ownable: the account that deployed the contract is the owner
    expect(await marketplace.owner()).to.equal(owner.address);
  });

  // ── 2. activateMarketPlace ───────────────────────────────────────────────

  it("05 — owner can activate the marketplace", async function () {
    // After activation s_isActive must flip to true
    await marketplace.connect(owner).activateMarketPlace();
    expect(await marketplace.s_isActive()).to.equal(true);
  });

  it("06 — activating an already-active marketplace reverts", async function () {
    // Re-activating must revert with the custom error
    await marketplace.connect(owner).activateMarketPlace();
    await expect(
      marketplace.connect(owner).activateMarketPlace(),
    ).to.be.revertedWithCustomError(marketplace, "RWAMarketPlace__IsActive");
  });

  it("07 — non-owner cannot activate the marketplace", async function () {
    // Only the owner should be allowed to activate
    await expect(
      marketplace.connect(stranger).activateMarketPlace(),
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  // ── 3. setMinimumPricePerUnit ─────────────────────────────────────────────

  it("08 — owner can update the minimum price per unit", async function () {
    // A higher minimum should be stored and emitted correctly
    const newMin = ethers.parseUnits("0.005", 18);
    await marketplace.connect(owner).setMinimumPricePerUnit(newMin);
    expect(await marketplace.s_minimumPricePerUnit()).to.equal(newMin);
  });

  it("09 — setMinimumPricePerUnit emits MinimumPricePerUnitUpdated event", async function () {
    // The event should fire with the new minimum price
    const newMin = ethers.parseUnits("0.002", 18);
    await expect(marketplace.connect(owner).setMinimumPricePerUnit(newMin))
      .to.emit(marketplace, "MinimumPricePerUnitUpdated")
      .withArgs(newMin);
  });

  it("10 — non-owner cannot update minimum price", async function () {
    // Ownable guard: must revert for any non-owner caller
    await expect(
      marketplace.connect(stranger).setMinimumPricePerUnit(MIN_PRICE),
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  // ── 4. listForSale ────────────────────────────────────────────────────────

  it("11 — listing reverts when marketplace is paused", async function () {
    // No listings while marketplace is inactive
    await token.connect(seller).approve(await marketplace.getAddress(), LIST_AMOUNT);
    await expect(
      marketplace.connect(seller).listForSale(
        await token.getAddress(),
        LIST_AMOUNT,
        PRICE_PER_UNIT,
      ),
    ).to.be.revertedWithCustomError(marketplace, "RWAMarketPlace__isPaused");
  });

  it("12 — listing with amount zero reverts", async function () {
    // Zero-amount listing should revert with the amount guard
    await marketplace.connect(owner).activateMarketPlace();
    await token.connect(seller).approve(await marketplace.getAddress(), LIST_AMOUNT);
    await expect(
      marketplace.connect(seller).listForSale(await token.getAddress(), 0n, PRICE_PER_UNIT),
    ).to.be.revertedWithCustomError(
      marketplace,
      "RWAMarketPlace__amountMustBeGreaterThanZero",
    );
  });

  it("13 — listing below minimum price reverts", async function () {
    // Price below the minimum must revert with the price guard
    await marketplace.connect(owner).activateMarketPlace();
    await token.connect(seller).approve(await marketplace.getAddress(), LIST_AMOUNT);
    const tooLow = MIN_PRICE - 1n;
    await expect(
      marketplace.connect(seller).listForSale(
        await token.getAddress(),
        LIST_AMOUNT,
        tooLow,
      ),
    ).to.be.revertedWithCustomError(
      marketplace,
      "RWAMarketPlace__pricePerUnitLessThanMinimumPrice",
    );
  });

  it("14 — valid listing stores the listing and increments next ID", async function () {
    // After a successful listForSale the listing exists and the counter increments
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);

    await marketplace.connect(seller).listForSale(
      await token.getAddress(),
      LIST_AMOUNT,
      PRICE_PER_UNIT,
    );

    const listing = await marketplace.listings(0);
    expect(listing.seller).to.equal(seller.address);
    expect(listing.amount).to.equal(LIST_AMOUNT);
    expect(listing.pricePerUnit).to.equal(PRICE_PER_UNIT);
    expect(listing.active).to.equal(true);

    expect(await marketplace.s_nextListingId()).to.equal(1n);
  });

  it("15 — listForSale emits PropertyListed event", async function () {
    // The event must fire with correct indexed and non-indexed args
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);

    await expect(
      marketplace.connect(seller).listForSale(
        await token.getAddress(),
        LIST_AMOUNT,
        PRICE_PER_UNIT,
      ),
    )
      .to.emit(marketplace, "PropertyListed")
      .withArgs(
        0n,
        seller.address,
        await token.getAddress(),
        LIST_AMOUNT,
        PRICE_PER_UNIT,
      );
  });

  // ── 5. cancelListing ──────────────────────────────────────────────────────

  it("16 — seller can cancel their own listing and receive tokens back", async function () {
    // After cancel: listing.active=false and escrowed tokens returned to seller
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace
      .connect(seller)
      .listForSale(await token.getAddress(), LIST_AMOUNT, PRICE_PER_UNIT);

    const balBefore = await token.balanceOf(seller.address);
    await marketplace.connect(seller).cancelListing(0);
    const balAfter = await token.balanceOf(seller.address);

    expect(balAfter - balBefore).to.equal(LIST_AMOUNT);
    const listing = await marketplace.listings(0);
    expect(listing.active).to.equal(false);
  });

  it("17 — stranger cannot cancel someone else's listing", async function () {
    // cancelListing must enforce the NotAuthorized guard for 3rd parties
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace
      .connect(seller)
      .listForSale(await token.getAddress(), LIST_AMOUNT, PRICE_PER_UNIT);

    await expect(
      marketplace.connect(stranger).cancelListing(0),
    ).to.be.revertedWithCustomError(marketplace, "RWAMarketPlace__NotAuthorized");
  });

  // ── 6. purchase ───────────────────────────────────────────────────────────

  it("18 — purchase with incorrect ETH amount reverts", async function () {
    // The contract requires exact payment; any mismatch must revert
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace
      .connect(seller)
      .listForSale(await token.getAddress(), LIST_AMOUNT, PRICE_PER_UNIT);

    const buyAmt = ethers.parseUnits("1", 18); // 1 token
    const wrongEth = 1n; // clearly wrong
    await expect(
      marketplace.connect(buyer).purchase(0, buyAmt, { value: wrongEth }),
    ).to.be.revertedWithCustomError(
      marketplace,
      "RWAMarketPlace__incorrectPaymentAmount",
    );
  });

  it("19 — purchase of zero tokens reverts", async function () {
    // Buying 0 units must revert with the invalid purchase amount guard
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace
      .connect(seller)
      .listForSale(await token.getAddress(), LIST_AMOUNT, PRICE_PER_UNIT);

    await expect(
      marketplace.connect(buyer).purchase(0, 0n, { value: 0n }),
    ).to.be.revertedWithCustomError(
      marketplace,
      "RWAMarketPlace__invalidPurchaseAmount",
    );
  });

  // ── 7. withdraw ───────────────────────────────────────────────────────────

  it("20 — non-owner cannot call withdraw", async function () {
    // Only the owner must be allowed to drain the contract balance
    await expect(
      marketplace.connect(stranger).withdraw(stranger.address),
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
