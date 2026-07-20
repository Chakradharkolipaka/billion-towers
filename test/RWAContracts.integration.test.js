/**
 * Integration Tests — RWAPropertyToken + RWAMarketplace
 * Run: npx hardhat test test/RWAContracts.integration.test.js
 *
 * 20 end-to-end scenario tests: deploy → activate → approve → list → purchase/cancel
 *
 * ─── Contract math ───────────────────────────────────────────────────────────
 * The contract stores raw uint256 amounts — no decimals scaling is applied
 * inside the Solidity code.
 *
 *   totalValue = amount * pricePerUnit          (both raw uint256, no division)
 *
 * Strategy used here:
 *   - Work with RAW token counts (not scaled by 1e18) for amounts
 *     e.g. LIST_AMOUNT = 100n  means "100 raw units" (like 100 indivisible shares)
 *   - pricePerUnit expressed in wei per raw unit
 *     e.g. PRICE = 0.01 ETH per unit = ethers.parseEther("0.01")
 *   - cost(n) = n * PRICE
 *
 * This keeps the arithmetic simple and the numbers in a range where all
 * assertions are exact and readable.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const { expect } = require("chai");
const { ethers } = require("hardhat");

// ── Constants (raw unit counts, not scaled by 1e18) ──────────────────────────
const MIN_PRICE   = ethers.parseEther("0.001");  // 0.001 ETH per raw unit
const PRICE       = ethers.parseEther("0.01");   // 0.01  ETH per raw unit
const SUPPLY      = 1_000_000n;                  // 1 000 000 raw units
const LIST_AMOUNT = 100n;                        // list 100 raw units
const BUY_AMOUNT  = 10n;                         // buy 10 raw units

/** Exact ETH cost for n raw units at PRICE */
function cost(n) {
  return n * PRICE;
}

/** Deploy a fresh token + marketplace for each test */
async function deployAll(sellerAddress) {
  const TokenF = await ethers.getContractFactory("RWAPropertyToken");
  const token = await TokenF.deploy(
    "Billion Towers Property Token",
    "BTPT",
    "PROP-0001",
    "Arbitrum Real Estate Asset",
    1_000_000n,                             // assetValuationUsd
    SUPPLY,                                  // initialSupply (raw units)
    sellerAddress,
  );
  await token.waitForDeployment();

  const MktF = await ethers.getContractFactory("RWAMarketplace");
  const marketplace = await MktF.deploy(MIN_PRICE);
  await marketplace.waitForDeployment();

  return { token, marketplace };
}

describe("RWA Contracts — Integration Tests", function () {
  let token, marketplace;
  let owner, seller, buyer, buyer2, stranger;

  beforeEach(async function () {
    [owner, seller, buyer, buyer2, stranger] = await ethers.getSigners();
    ({ token, marketplace } = await deployAll(seller.address));
  });

  // ── 1. Full list → purchase flow ─────────────────────────────────────────

  it("01 — buyer receives tokens after a successful purchase", async function () {
    // Happy-path: activate → list 100 units → buy 10 → confirm buyer token balance
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    await marketplace.connect(buyer).purchase(0, BUY_AMOUNT, { value: cost(BUY_AMOUNT) });

    expect(await token.balanceOf(buyer.address)).to.equal(BUY_AMOUNT);
  });

  it("02 — seller receives ETH after a purchase", async function () {
    // The seller's ETH balance must increase by exactly cost(BUY_AMOUNT) = 0.1 ETH
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    const balBefore = await ethers.provider.getBalance(seller.address);
    await marketplace.connect(buyer).purchase(0, BUY_AMOUNT, { value: cost(BUY_AMOUNT) });
    const balAfter = await ethers.provider.getBalance(seller.address);

    expect(balAfter - balBefore).to.equal(cost(BUY_AMOUNT));
  });

  it("03 — listing amount decreases after a partial purchase", async function () {
    // Listing.amount must decrement by BUY_AMOUNT; listing stays active (partial fill)
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    await marketplace.connect(buyer).purchase(0, BUY_AMOUNT, { value: cost(BUY_AMOUNT) });

    const listing = await marketplace.listings(0);
    expect(listing.amount).to.equal(LIST_AMOUNT - BUY_AMOUNT);
    expect(listing.active).to.equal(true);
  });

  it("04 — listing becomes inactive after all tokens are purchased", async function () {
    // When the full listed amount is bought, the listing.active must flip to false
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    await marketplace.connect(buyer).purchase(0, LIST_AMOUNT, { value: cost(LIST_AMOUNT) });

    const listing = await marketplace.listings(0);
    expect(listing.active).to.equal(false);
  });

  it("05 — PropertyPurchased event emitted with correct args", async function () {
    // The indexed event must carry listingId, buyer address, amount, and total ETH paid
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    const c = cost(BUY_AMOUNT);
    await expect(
      marketplace.connect(buyer).purchase(0, BUY_AMOUNT, { value: c }),
    )
      .to.emit(marketplace, "PropertyPurchased")
      .withArgs(0n, buyer.address, BUY_AMOUNT, c);
  });

  it("06 — two separate buyers can fill parts of the same listing", async function () {
    // Multiple independent buyers transacting against a single active listing
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    await marketplace.connect(buyer).purchase(0, BUY_AMOUNT, { value: cost(BUY_AMOUNT) });
    await marketplace.connect(buyer2).purchase(0, BUY_AMOUNT, { value: cost(BUY_AMOUNT) });

    expect(await token.balanceOf(buyer.address)).to.equal(BUY_AMOUNT);
    expect(await token.balanceOf(buyer2.address)).to.equal(BUY_AMOUNT);
    const listing = await marketplace.listings(0);
    expect(listing.amount).to.equal(LIST_AMOUNT - BUY_AMOUNT * 2n);
  });

  // ── 2. Multiple listings ─────────────────────────────────────────────────

  it("07 — multiple listings increment IDs correctly", async function () {
    // Three listForSale calls → s_nextListingId must equal 3
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT * 3n);

    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    expect(await marketplace.s_nextListingId()).to.equal(3n);
  });

  it("08 — purchase from the second listing works independently", async function () {
    // Buying listing ID 1 must not touch listing ID 0
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT * 2n);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    await marketplace.connect(buyer).purchase(1, BUY_AMOUNT, { value: cost(BUY_AMOUNT) });

    expect(await token.balanceOf(buyer.address)).to.equal(BUY_AMOUNT);
    const listing0 = await marketplace.listings(0);
    expect(listing0.amount).to.equal(LIST_AMOUNT); // listing 0 must be untouched
  });

  // ── 3. Cancel + re-list flow ─────────────────────────────────────────────

  it("09 — seller cancels then re-lists the same tokens successfully", async function () {
    // After cancel the seller retrieves the escrowed tokens and can re-list them
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    await marketplace.connect(seller).cancelListing(0);

    // Re-approve and create listing ID 1
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    const listing = await marketplace.listings(1);
    expect(listing.active).to.equal(true);
    expect(listing.amount).to.equal(LIST_AMOUNT);
  });

  it("10 — owner can cancel any listing", async function () {
    // The contract owner must be permitted to cancel a listing on the seller's behalf
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    await marketplace.connect(owner).cancelListing(0);

    const listing = await marketplace.listings(0);
    expect(listing.active).to.equal(false);
  });

  it("11 — canceling an already-cancelled listing reverts", async function () {
    // The activeListing modifier must block attempts to cancel twice
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    await marketplace.connect(seller).cancelListing(0);
    await expect(
      marketplace.connect(seller).cancelListing(0),
    ).to.be.revertedWithCustomError(marketplace, "RWAMarketPlace__listingNotActive");
  });

  // ── 4. Purchasing an inactive listing ────────────────────────────────────

  it("12 — purchasing a fully-sold listing reverts", async function () {
    // Once the listing is exhausted (active=false) any further purchase must revert
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    // Drain the entire listing
    await marketplace.connect(buyer).purchase(0, LIST_AMOUNT, { value: cost(LIST_AMOUNT) });

    // Attempt to buy 1 more unit from the now-inactive listing
    await expect(
      marketplace.connect(buyer2).purchase(0, 1n, { value: cost(1n) }),
    ).to.be.revertedWithCustomError(marketplace, "RWAMarketPlace__listingNotActive");
  });

  // ── 5. Minimum price enforcement ─────────────────────────────────────────

  it("13 — owner raising minimum price prevents under-priced new listings", async function () {
    // After the owner raises the minimum, a listing at the old PRICE must revert
    await marketplace.connect(owner).activateMarketPlace();
    const newMin = ethers.parseEther("0.05");
    await marketplace.connect(owner).setMinimumPricePerUnit(newMin);

    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);

    await expect(
      marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE),
    ).to.be.revertedWithCustomError(
      marketplace,
      "RWAMarketPlace__pricePerUnitLessThanMinimumPrice",
    );
  });

  it("14 — listing at exactly the minimum price succeeds", async function () {
    // Boundary case: price == minimum must be accepted (not rejected)
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);

    await expect(
      marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, MIN_PRICE),
    ).to.not.be.reverted;
  });

  // ── 6. Ownership ─────────────────────────────────────────────────────────

  it("15 — non-owner cannot call renounceOwnership", async function () {
    // Ownable: only the owner may renounce; stranger must be rejected
    await expect(
      marketplace.connect(stranger).renounceOwnership(),
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  // ── 7. Token escrow integrity ────────────────────────────────────────────

  it("16 — marketplace holds the escrowed tokens during an active listing", async function () {
    // Between listForSale and purchase/cancel the contract's token balance = LIST_AMOUNT
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    expect(await token.balanceOf(mktAddr)).to.equal(LIST_AMOUNT);
  });

  it("17 — escrowed tokens are released to buyer on purchase", async function () {
    // After a purchase, the marketplace's token balance decreases by BUY_AMOUNT
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    await marketplace.connect(buyer).purchase(0, BUY_AMOUNT, { value: cost(BUY_AMOUNT) });

    expect(await token.balanceOf(mktAddr)).to.equal(LIST_AMOUNT - BUY_AMOUNT);
  });

  // ── 8. Withdraw ──────────────────────────────────────────────────────────

  it("18 — owner can call withdraw when contract ETH balance is zero", async function () {
    // The marketplace has no receive() fallback — ETH balance stays 0 unless
    // explicitly funded.  This test confirms owner can call withdraw (no-op drain).
    const ownerBalBefore = await ethers.provider.getBalance(owner.address);
    const tx = await marketplace.connect(owner).withdraw(owner.address);
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed * tx.gasPrice;
    const ownerBalAfter = await ethers.provider.getBalance(owner.address);

    // Owner paid only gas; received 0 ETH back
    expect(ownerBalBefore - ownerBalAfter).to.be.closeTo(
      gasCost,
      ethers.parseEther("0.001"),
    );
  });

  // ── 9. Mint + List flow ──────────────────────────────────────────────────

  it("19 — owner mints additional tokens to seller who then lists them", async function () {
    // Extra tokens minted by the token owner flow correctly through the marketplace
    const extraAmt = 500n;
    await token.connect(owner).mint(seller.address, extraAmt);

    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, extraAmt);
    await marketplace.connect(seller).listForSale(await token.getAddress(), extraAmt, PRICE);

    const listing = await marketplace.listings(0);
    expect(listing.amount).to.equal(extraAmt);
  });

  // ── 10. Over-purchase guard ───────────────────────────────────────────────

  it("20 — purchasing more tokens than the listing holds reverts", async function () {
    // Attempting to buy more than listed must revert with the amount guard
    await marketplace.connect(owner).activateMarketPlace();
    const mktAddr = await marketplace.getAddress();
    await token.connect(seller).approve(mktAddr, LIST_AMOUNT);
    await marketplace.connect(seller).listForSale(await token.getAddress(), LIST_AMOUNT, PRICE);

    const overBuy = LIST_AMOUNT + 1n;
    await expect(
      marketplace.connect(buyer).purchase(0, overBuy, { value: cost(overBuy) }),
    ).to.be.revertedWithCustomError(
      marketplace,
      "RWAMarketPlace__invalidPurchaseAmount",
    );
  });
});
