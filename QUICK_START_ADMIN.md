# Quick Start - Admin Features

## 🚀 Getting Started (2 Minutes)

### Step 1: Start the Application
```bash
cd ~/Assesments/billion-towers
npm start
```
Wait for both servers to start:
- Backend: http://localhost:3099
- Frontend: http://localhost:3000

### Step 2: Sign In as Admin
1. Open http://localhost:3000
2. Click "Sign In"
3. Enter credentials:
   - Email: `admin@billiontowers.demo`
   - Password: `Admin@12345`

### Step 3: Connect Owner Wallet
1. Click "Connect Wallet" button
2. Select MetaMask
3. Choose account: `0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA`
4. Approve connection

### Step 4: Access Admin Dashboard
1. Click your profile menu (top right)
2. Select "Admin Dashboard"
3. You'll see marketplace controls at the top

---

## 🎯 What You Can Do Now

### ✅ View Marketplace Status
Instantly see:
- Active/Inactive status
- Current minimum price
- **Contract balance** (NEW!)
- Your role (Owner/Not Owner)

### ✅ Activate Marketplace
If marketplace is inactive:
1. Click "Activate Marketplace" button
2. Confirm transaction in MetaMask
3. Wait for confirmation (~5-10 seconds)
4. Status changes to "Active"

### ✅ Set Minimum Price
To change the minimum listing price:
1. Enter new price (e.g., `0.002`)
2. Click "Update Minimum Price"
3. Confirm transaction
4. New price is displayed

### ✅ Withdraw Funds (NEW!)
To withdraw accumulated fees:
1. Check available balance in status card
2. Scroll to "Withdraw Funds" section
3. Verify/edit withdrawal address
4. Click "Withdraw Funds"
5. Confirm transaction
6. Funds sent to specified address

### ✅ Add Properties (FIXED!)
To create a new property listing:
1. Click "Add Property" button (in Products section)
2. **Use sample data** from `SAMPLE_PRODUCT_DATA.md`
3. Fill in all required fields
4. Click "Create Property"
5. Property appears in admin list

---

## 📝 Sample Property (Copy & Paste)

**Quick Test Property:**
```
Name: Downtown Luxury Apartment
Description: Beautiful modern apartment in prime downtown location with stunning views and amenities.
Price: 50000
Cutted Price: 55000
Category: residential (select from dropdown)
City: New York
State: NY
Country: USA
Total Shares: 1000
Available Shares: 750
Investors: 0
Target Yield: 8
Projected ROI: 10
Occupancy: 95
Features: Pool, Gym, Security, Parking
Image URLs: (one per line)
https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800
https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800
```

---

## ⚡ Quick Troubleshooting

### "Not Owner" Warning
**Problem:** Buttons are disabled, yellow warning shows
**Solution:** Connect with owner wallet `0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA`

### "Gas price too low" Error
**Problem:** Transaction fails with gas error
**Solution:** Code automatically adds 20% buffer. If still fails, wait 30 seconds and retry.

### "400 Bad Request" on Product Creation
**Problem:** Form validation fails
**Solution:** 
- Description must be at least 10 characters ✅
- At least one image URL required ✅
- Price and stock must be numbers ✅
- Category must be: residential, commercial, or industrial ✅

### Can't See Contract Balance
**Problem:** Balance shows 0.000000 ETH
**Solution:** Normal if no purchases have been made yet. Balance increases when users buy tokens.

---

## 🔄 Quick Actions Checklist

### Initial Setup
- [ ] Start server with `npm start`
- [ ] Sign in as admin
- [ ] Connect owner wallet
- [ ] Navigate to Admin Dashboard

### Marketplace Management
- [ ] Check marketplace status
- [ ] Activate if needed
- [ ] Set/update minimum price
- [ ] Monitor contract balance

### Property Management
- [ ] View existing properties
- [ ] Add new property with sample data
- [ ] Edit property details
- [ ] Delete test properties

### Financial Management
- [ ] Check contract balance
- [ ] Withdraw accumulated fees
- [ ] Verify withdrawal transaction

---

## 📞 Need More Help?

- **Sample Data:** See `SAMPLE_PRODUCT_DATA.md`
- **Full Documentation:** See `ADMIN_FEATURES_COMPLETE.md`
- **Contract Addresses:** See `.env` file
- **Troubleshooting:** See `TROUBLESHOOTING.md`

---

## ⏱️ Typical Task Times

| Task | Time |
|------|------|
| Start application | 30 seconds |
| Sign in + connect wallet | 20 seconds |
| Activate marketplace | 10 seconds |
| Set minimum price | 10 seconds |
| Add property | 2 minutes |
| Withdraw funds | 15 seconds |

Total time to test all features: **~5 minutes**

---

## 🎉 You're All Set!

The admin dashboard is fully functional with:
- ✅ Marketplace activation controls
- ✅ Minimum price management
- ✅ Withdraw funds feature (NEW)
- ✅ Property creation (FIXED)

Start managing your RWA marketplace! 🚀
