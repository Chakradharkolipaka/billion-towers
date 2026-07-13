// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title RWA Property Token
/// @notice Represents fractional ownership of a real-world asset on Arbitrum.
contract RWAPropertyToken is ERC20, Ownable {
    string public assetId;
    string public assetLocation;
    uint256 public assetValuationUsd;

    event Fractionalized(address indexed owner, uint256 totalSupply);

    constructor(
        string memory name_,
        string memory symbol_,
        string memory assetId_,
        string memory assetLocation_,
        uint256 assetValuationUsd_,
        uint256 initialSupply_,
        address initialHolder_
    ) ERC20(name_, symbol_) {
        assetId = assetId_;
        assetLocation = assetLocation_;
        assetValuationUsd = assetValuationUsd_;

        _mint(initialHolder_, initialSupply_);
        emit Fractionalized(initialHolder_, initialSupply_);
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
