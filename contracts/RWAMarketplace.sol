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
        s_minimumPricePerUnit = _minimumPricePerUnit;
        s_isActive = false;
    }

    function setMinimumPricePerUnit(uint256 _minimumPricePerUnit) external onlyOwner{
        s_minimumPricePerUnit = _minimumPricePerUnit;
        emit MinimumPricePerUnitUpdated(_minimumPricePerUnit);
    }

    function activateMarketPlace() external onlyOwner{
        if(s_isActive){
            revert RWAMarketPlace__IsActive();
        }
        if(!s_isActive){
            s_isActive = true;
        }
        emit MarketPlaceActivated(s_isActive);
    }

    function listForSale(
        address token,
        uint256 amount,
        uint256 pricePerUnit
    ) external marketPlaceIsActive nonReentrant returns (uint256) {
        if(amount <= 0){
            revert RWAMarketPlace__amountMustBeGreaterThanZero(amount);
        }

        if(pricePerUnit < s_minimumPricePerUnit) {
            revert RWAMarketPlace__pricePerUnitLessThanMinimumPrice(pricePerUnit, s_minimumPricePerUnit);
        }

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        listings[s_nextListingId] = Listing({
            seller: msg.sender,
            token: token,
            amount: amount,
            pricePerUnit: pricePerUnit,
            active: true
        });

        emit PropertyListed(s_nextListingId, msg.sender, token, amount, pricePerUnit);
        s_nextListingId++;

        return s_nextListingId - 1;
    }

    function purchase(uint256 listingId, uint256 amount) external payable  marketPlaceIsActive activeListing(listingId) nonReentrant {
        Listing storage listing = listings[listingId];

        if(amount == 0 || amount > listing.amount){
            revert RWAMarketPlace__invalidPurchaseAmount(amount,listing.amount);
        }

        uint256 totalValue = amount * listing.pricePerUnit;
        if(msg.value != totalValue){
            revert RWAMarketPlace__incorrectPaymentAmount(msg.value,totalValue);
        }

        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.active = false;
        }

        payable(listing.seller).transfer(totalValue);
        IERC20(listing.token).safeTransfer(msg.sender, amount);

        emit PropertyPurchased(listingId, msg.sender, amount, totalValue);
    }

    function cancelListing(uint256 listingId) external activeListing(listingId) nonReentrant {
        Listing storage listing = listings[listingId];
        
        if(msg.sender != listing.seller || msg.sender != owner()){
            revert RWAMarketPlace__NotAuthorized();
        }

        listing.active = false;
        IERC20(listing.token).safeTransfer(listing.seller, listing.amount);

        emit ListingCanceled(listingId);
    }

    function withdraw(address payable recipient) external onlyOwner {
        recipient.transfer(address(this).balance);
    }
}
