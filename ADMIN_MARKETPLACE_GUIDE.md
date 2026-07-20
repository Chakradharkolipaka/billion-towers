# Admin Marketplace Management Guide

## Overview

As an admin, you can now manage the on-chain marketplace directly from the admin dashboard.

---

## Accessing Admin Dashboard

1. **Sign in as admin:**
   - Email: `admin@billiontowers.demo`
   - Password: `Admin@12345`

2. **Navigate to Admin Products:**
   - Click "Admin" in the header menu
   - Or go to: http://localhost:3000/admin/products

---

## Marketplace Controls

At the top of the admin dashboard, you'll see the **Marketplace Controls** section with:

### 1. Marketplace Status Card

Shows:
- **Status:** Active/Inactive
- **Minimum Price:** Current minimum price per unit (in ETH)
- **Your Role:** Whether you're the contract owner or not

### 2. Activate Marketplace Button

- **Purpose:** Activate the marketplace to allow users to create listings and purchase tokens
- **Requirements:** 
  - Must be connected with the **contract owner wallet**
  - Owner address: `0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA` (the deployer wallet)
- **Action:** Click "Activate Marketplace" button
- **Result:** Marketplace status changes from Inactive to Active

### 3. Set Minimum Price Form

- **Purpose:** Set the minimum price per unit that sellers must list at
- **Requirements:** Must be contract owner
- **Fields:**
  - Minimum Price (ETH per unit) - e.g., `0.001`
- **Action:** Enter new price and click "Update Minimum Price"
- **Result:** Minimum price is updated on-chain

---

## Important Notes

### Contract Owner vs Admin User

- **Admin User (Database):** `admin@billiontowers.demo` - manages products/listings in database
- **Contract Owner (Blockchain):** `0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA` - manages marketplace contract

These are **separate**! To manage marketplace settings:

1. **Sign in** as admin user (for UI access)
2. **Connect MetaMask** with the contract owner wallet (for blockchain operations)

### Connect Contract Owner Wallet

1. Open MetaMask
2. Switch to the account: `0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA`
3. Make sure you're on **Arbitrum Sepolia** (Chain ID: 421614)
4. Click "Connect Wallet" in the app
5. The marketplace controls will now show you as "Contract Owner"

### What Happens If You're Not the Owner?

- You'll see a warning message: "⚠️ You must connect with the contract owner wallet"
- The owner address will be displayed
- Buttons will be disabled
- You can still view the marketplace status

---

## Step-by-Step: Activate Marketplace

### Prerequisites
- [ ] Signed in as admin user
- [ ] MetaMask connected with owner wallet (`0x68f76F3...`)
- [ ] On Arbitrum Sepolia network
- [ ] Marketplace is currently inactive

### Steps

1. **Go to Admin Dashboard:**
   ```
   http://localhost:3000/admin/products
   ```

2. **Verify Connection:**
   - Check "Your Role" shows "Contract Owner" (in gold)
   - If it says "Not Owner", switch MetaMask account

3. **Click "Activate Marketplace" Button:**
   - Button should be enabled (not grayed out)
   - Shows a power icon

4. **Approve Transaction in MetaMask:**
   - MetaMask popup will appear
   - Gas fee will be shown
   - Click "Confirm"

5. **Wait for Confirmation:**
   - You'll see "Activating marketplace..." toast
   - Wait for blockchain confirmation (~2-5 seconds on testnet)

6. **Success:**
   - Toast message: "Marketplace activated successfully!"
   - Status card updates to show "Active" in green
   - Users can now create listings

---

## Step-by-Step: Set Minimum Price

### Prerequisites
- [ ] Signed in as admin user
- [ ] MetaMask connected with owner wallet
- [ ] On Arbitrum Sepolia network

### Steps

1. **Scroll to "Set Minimum Price" Section**

2. **Enter New Price:**
   - Example: `0.001` for 0.001 ETH per token unit
   - Must be a positive number

3. **Click "Update Minimum Price"**

4. **Approve Transaction in MetaMask**

5. **Wait for Confirmation:**
   - "Updating minimum price..." toast appears
   - Blockchain confirmation takes a few seconds

6. **Success:**
   - Toast: "Minimum price set to 0.001 ETH"
   - Status card updates with new price
   - All new listings must meet this minimum

---

## Troubleshooting

### "Only the contract owner can activate the marketplace"

**Solution:** Connect MetaMask with the deployer wallet (`0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA`)

### "Marketplace is already active"

**Solution:** No action needed - marketplace is already activated. Users can create listings.

### "Please connect your wallet first"

**Solution:** 
1. Click "Connect Wallet" button in header
2. Approve connection in MetaMask
3. Return to admin dashboard

### Buttons are disabled/grayed out

**Reasons:**
- Not connected as contract owner
- Wrong network (not Arbitrum Sepolia)
- Transaction in progress

**Solution:**
- Verify you're on Arbitrum Sepolia (Chain ID: 421614)
- Switch to owner account in MetaMask
- Refresh the page

### Transaction Failed

**Common Reasons:**
- Insufficient ETH for gas fees
- Wrong network
- Marketplace already active (for activation)

**Solution:**
- Get testnet ETH from faucet: https://faucet.quicknode.com/arbitrum/sepolia
- Verify network in MetaMask
- Click "Refresh Status" button to see current state

---

## Contract Functions Reference

### `activateMarketPlace()`
- **Access:** Owner only
- **Purpose:** Enable marketplace for trading
- **Reverts if:** Already active
- **Event:** `MarketPlaceActivated(true)`

### `setMinimumPricePerUnit(uint256 _minimumPricePerUnit)`
- **Access:** Owner only
- **Purpose:** Set minimum listing price
- **Parameter:** Price in wei per token unit
- **Event:** `MinimumPricePerUnitUpdated(_minimumPricePerUnit)`

---

## Contract Information

- **Token Address:** `0x0BE44C81B5932F71735dA1df1e38f153350D64c4`
- **Marketplace Address:** `0x3211F66A0f0Dc7E40d986E1840a513c1Cf03C130`
- **Network:** Arbitrum Sepolia (421614)
- **Owner:** `0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA`

**View on Explorer:**
- Token: https://sepolia.arbiscan.io/address/0x0BE44C81B5932F71735dA1df1e38f153350D64c4
- Marketplace: https://sepolia.arbiscan.io/address/0x3211F66A0f0Dc7E40d986E1840a513c1Cf03C130

---

## Summary

✅ Admin dashboard now includes marketplace controls  
✅ Can activate marketplace on-chain  
✅ Can set minimum price for listings  
✅ Shows real-time marketplace status  
✅ Owner-only access enforced  
✅ Transaction feedback with toast notifications  
✅ Refresh button to update status

The marketplace is now fully manageable from the admin UI!
