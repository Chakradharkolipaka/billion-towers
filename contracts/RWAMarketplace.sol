// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RWA Marketplace
 * @notice Simple marketplace for buying and selling ERC20 property tokens on Arbitrum.
 * @notice Owner handles the status of the marketplace => active or paused.
 * @notice Sellers can list their property tokens for sale where the price per unit must be greater than or equal to the minimum price per unit set by the owner.
 * @notice Buyers can purchase listed property tokens by sending the required amount of ETH to the contract.
 * @notice Sellers can cancel their listings and retrieve their tokens regardless of the status of the marketPlace.
 * @notice The minimum price per unit is set by the owner and can be updated by owner alone.
 * @notice The marketplace can be activated or paused by the owner. When paused, no new listings or purchases can be made, but sellers can still cancel their listings and retrieve their tokens.
 */
contract RWAMarketplace is ReentrancyGuard, Ownable {
    error RWAMarketPlace__amountMustBeGreaterThanZero(uint256 amount);
    error RWAMarketPlace__isPaused();
    error RWAMarketPlace__IsActive();
    error RWAMarketPlace__pricePerUnitLessThanMinimumPrice(uint256 pricePerUnit, uint256 minimumPricePerUnit);
    error RWAMarketPlace__listingNotActive(uint256 listingId);
    error RWAMarketPlace__incorrectPaymentAmount(uint256 msgValue, uint256 totalValue);
    error RWAMarketPlace__invalidPurchaseAmount(uint256 amount, uint256 listingAmount);
    error RWAMarketPlace__NotAuthorized();

    using SafeERC20 for IERC20;

    struct Listing {
        address seller;
        address token;
        uint256 amount;
        uint256 pricePerUnit;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public s_minimumPricePerUnit;
    uint256 public s_nextListingId;
    bool public s_isActive;

    event PropertyListed(
        uint256 indexed listingId,
        address indexed seller,
        address token,
        uint256 amount,
        uint256 pricePerUnit
    );

    event PropertyPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 amount,
        uint256 totalPrice
    );

    event ListingCanceled(uint256 indexed listingId);

    event MarketPlaceActivated(bool isActive);

    event MinimumPricePerUnitUpdated(uint256  indexed minimumPricePerUnit);

    modifier marketPlaceIsActive(){
        if(!s_isActive){
            revert RWAMarketPlace__isPaused();
        }
        _;
    }

    modifier activeListing(uint256 listingId){
        if(!listings[listingId].active){
            revert RWAMarketPlace__listingNotActive(listingId);
        }
        _;
    }

    constructor(uint256 _minimumPricePerUnit) {
        // ASSERT: Initial minimum price must be greater than zero
        assert(_minimumPricePerUnit > 0);
        
        // ASSERT: Reasonable upper bound for initial price
        assert(_minimumPricePerUnit <= 1000 ether);
        
        s_minimumPricePerUnit = _minimumPricePerUnit;
        s_isActive = false;
        
        // ASSERT: Contract starts in inactive state
        assert(s_isActive == false);
        
        // ASSERT: Minimum price was set correctly
        assert(s_minimumPricePerUnit == _minimumPricePerUnit);
        
        // ASSERT: Listing counter starts at zero
        assert(s_nextListingId == 0);
    }

    function setMinimumPricePerUnit(uint256 _minimumPricePerUnit) external onlyOwner{
        // ASSERT: New minimum price must be greater than zero
        assert(_minimumPricePerUnit > 0);
        
        // ASSERT: New price must be different from current price (prevents no-op updates)
        assert(_minimumPricePerUnit != s_minimumPricePerUnit);
        
        // ASSERT: Reasonable upper bound (prevent setting absurdly high prices)
        // 1000 ETH per unit = very high but theoretically possible for luxury properties
        assert(_minimumPricePerUnit <= 1000 ether);
        
        uint256 oldPrice = s_minimumPricePerUnit;
        s_minimumPricePerUnit = _minimumPricePerUnit;
        
        // ASSERT: State was updated correctly
        assert(s_minimumPricePerUnit == _minimumPricePerUnit);
        assert(s_minimumPricePerUnit != oldPrice);
        
        emit MinimumPricePerUnitUpdated(_minimumPricePerUnit);
    }

    function activateMarketPlace() external onlyOwner{
        // ASSERT: Marketplace must currently be inactive (false)
        assert(s_isActive == false);
        
        if(s_isActive){
            revert RWAMarketPlace__IsActive();
        }
        if(!s_isActive){
            s_isActive = true;
        }
        
        // ASSERT: Marketplace is now active (state changed correctly)
        assert(s_isActive == true);
        
        emit MarketPlaceActivated(s_isActive);
    }

    function listForSale(
        address token,
        uint256 amount,
        uint256 pricePerUnit
    ) external marketPlaceIsActive nonReentrant returns (uint256) {
        // ASSERT: token address must not be zero
        assert(token != address(0));
        
        if(amount <= 0){
            revert RWAMarketPlace__amountMustBeGreaterThanZero(amount);
        }

        if(pricePerUnit < s_minimumPricePerUnit) {
            revert RWAMarketPlace__pricePerUnitLessThanMinimumPrice(pricePerUnit, s_minimumPricePerUnit);
        }

        // ASSERT: Check for overflow before token transfer
        assert(amount < type(uint256).max);
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        listings[s_nextListingId] = Listing({
            seller: msg.sender,
            token: token,
            amount: amount,
            pricePerUnit: pricePerUnit,
            active: true
        });

        emit PropertyListed(s_nextListingId, msg.sender, token, amount, pricePerUnit);
        
        // ASSERT: nextListingId should always increment
        uint256 previousId = s_nextListingId;
        s_nextListingId++;
        assert(s_nextListingId > previousId);

        return s_nextListingId - 1;
    }

    function purchase(uint256 listingId, uint256 amount) external payable  marketPlaceIsActive activeListing(listingId) nonReentrant {
        Listing storage listing = listings[listingId];

        // ASSERT: Listing must exist (seller cannot be zero address)
        assert(listing.seller != address(0));
        
        // ASSERT: Token address must be valid
        assert(listing.token != address(0));

        if(amount == 0 || amount > listing.amount){
            revert RWAMarketPlace__invalidPurchaseAmount(amount,listing.amount);
        }

        uint256 totalValue = amount * listing.pricePerUnit;
        
        // ASSERT: Check for multiplication overflow
        assert(totalValue / listing.pricePerUnit == amount);
        
        if(msg.value != totalValue){
            revert RWAMarketPlace__incorrectPaymentAmount(msg.value,totalValue);
        }

        uint256 previousAmount = listing.amount;
        listing.amount -= amount;
        
        // ASSERT: Amount decreased correctly
        assert(listing.amount == previousAmount - amount);
        
        if (listing.amount == 0) {
            listing.active = false;
        }

        payable(listing.seller).transfer(totalValue);
        IERC20(listing.token).safeTransfer(msg.sender, amount);

        emit PropertyPurchased(listingId, msg.sender, amount, totalValue);
    }

    function cancelListing(uint256 listingId) external activeListing(listingId) nonReentrant {
        Listing storage listing = listings[listingId];
        
        // ASSERT: Listing must have a valid seller
        assert(listing.seller != address(0));
        
        // ASSERT: Listing must have valid token address
        assert(listing.token != address(0));
        
        if(msg.sender != listing.seller && msg.sender != owner()){
            revert RWAMarketPlace__NotAuthorized();
        }

        uint256 amountToReturn = listing.amount;
        listing.active = false;
        
        // ASSERT: Amount to return must be greater than 0
        assert(amountToReturn > 0);
        
        IERC20(listing.token).safeTransfer(listing.seller, amountToReturn);

        emit ListingCanceled(listingId);
    }

    function withdraw(address payable recipient) external onlyOwner {
        // ASSERT: Recipient address must not be zero
        assert(recipient != address(0));
        
        uint256 balance = address(this).balance;
        
        // ASSERT: Contract must have balance to withdraw
        assert(balance > 0);
        
        recipient.transfer(balance);
    }
}
