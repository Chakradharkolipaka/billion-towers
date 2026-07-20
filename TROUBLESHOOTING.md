# Troubleshooting Guide - Billion Towers

## Problem: Server Startup Hangs or is Very Slow

### Root Cause
Running Node.js from Windows PowerShell while accessing files in WSL2 via `\\wsl.localhost\...` paths causes **extreme performance degradation**. Node modules can take minutes to load.

### Solution: Always Run from WSL Terminal

**DO THIS:**
1. Open **Ubuntu terminal** (from Windows Start menu, search "Ubuntu")
2. OR open **Windows Terminal** and select the Ubuntu/WSL tab
3. Navigate to project:
   ```bash
   cd /home/chakradhar_kolipaka/Assesments/billion-towers
   ```
4. Run backend:
   ```bash
   npm run backend
   ```
5. In a separate terminal tab, run frontend:
   ```bash
   npm start
   ```

**DON'T DO THIS:**
❌ Running from PowerShell: `cd \\wsl.localhost\Ubuntu\...`
❌ Running from CMD: `cd \\wsl.localhost\Ubuntu\...`

---

## Problem: "unable to verify the first certificate"

### Root Cause
MongoDB Atlas SSL certificates can fail validation on Windows/WSL.

### Solution Already Applied
The database connection now sets `NODE_TLS_REJECT_UNAUTHORIZED=0` for development.

**File:** `server/config/database.js`
```javascript
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
```

---

## Problem: 431 Request Header Fields Too Large

### Symptoms
- Cannot signup or signin
- All API requests fail with 431 error
- Browser console shows: "Failed to load resource: the server responded with a status of 431"

### Root Cause
Browser cookies, MetaMask headers, or accumulated request data exceeds server's max header size.

### Quick Fix
1. **Clear browser cookies and storage:**
   - Press `F12` → **Application** tab → **Clear site data**
   - Or see `CLEAR_COOKIES.md` for detailed instructions

2. **Restart backend with increased limits:**
   ```bash
   # Stop server (Ctrl+C)
   npm run backend
   ```

3. **Hard refresh browser:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

### Verification
After restart, check server logs for:
```
[server] HTTP max header size set to: 327680 bytes (320KB)
```

If still having issues, try:
- Different browser (Firefox, Safari)
- Incognito mode with extensions disabled
- Manually delete `token` cookie in DevTools

See **CLEAR_COOKIES.md** for detailed instructions.

---

## Problem: Signup/Signin Errors

### Common Causes and Fixes

#### 1. Backend Not Running
**Check:**
```bash
curl http://localhost:3099/api/health
```

**Expected:**
```json
{"success":true,"message":"API is running","database":"connected"}
```

**If connection refused:** Start backend with `npm run backend` from WSL terminal.

#### 2. Database Not Connected
**Symptoms:** Health check shows `"database":"disconnected"`

**Fix:** Check MongoDB URI in `server/config/config.env`:
```env
MONGO_URI=mongodb+srv://assesments:Chakravarthi@myatlasclusteredu.stzff.mongodb.net/billion-towers?retryWrites=true&w=majority
```

#### 3. Frontend Can't Reach Backend
**Check `package.json` has proxy:**
```json
"proxy": "http://localhost:3099"
```

**Restart frontend** after adding proxy.

#### 4. CORS Errors
**Check `server/config/config.env`:**
```env
FRONTEND_URL=http://localhost:3000
```

#### 5. JWT Secret Missing
**Check `server/config/config.env` has:**
```env
JWT_SECRET=117f93427b8fca4b2c42c81023f0814045662c6e1268844651e656ac23f16d66
```

---

## Problem: Wallet Connection Errors

### Common Causes

#### 1. MetaMask Not Installed
Install MetaMask browser extension from [metamask.io](https://metamask.io)

#### 2. Wrong Network
The app uses **Arbitrum Sepolia** (testnet), not Arbitrum One.

**Network Details:**
- Chain ID: `421614` (0x66eee)
- RPC: https://arbitrum-sepolia-rpc.publicnode.com
- Explorer: https://sepolia.arbiscan.io

MetaMask will auto-prompt to add/switch when you connect.

#### 3. Contracts Not Deployed
**Check `.env` has:**
```env
REACT_APP_RWA_PROPERTY_TOKEN_ADDRESS=0x741F37dcDcc40369e34240c60B10Ee8f0c789Cc2
REACT_APP_RWA_MARKETPLACE_ADDRESS=0x98e28AB23A63Ea26AF47A6d077fb95BF25285777
REACT_APP_CHAIN_ID=421614
```

---

## Problem: "Cannot read file" or "Module not found"

### Cause
Likely running from wrong directory or node_modules corrupted.

### Fix
```bash
cd /home/chakradhar_kolipaka/Assesments/billion-towers
rm -rf node_modules package-lock.json
npm install
npm run backend
```

---

## Admin Credentials (For Testing)

- **Email:** admin@billiontowers.demo
- **Password:** Admin@12345

The admin user is auto-created on first server startup.

---

## Health Check Endpoints

### Backend Health
```bash
curl http://localhost:3099/api/health
```

### Test Login
```bash
curl -X POST http://localhost:3099/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@billiontowers.demo","password":"Admin@12345"}'
```

Should return user data with success=true.

---

## Environment Variable Checker

Run this to validate all required env vars:
```bash
npm run check:env
```

Expected output:
```
=== Environment Variable Check ===
✅ MONGO_URI
✅ JWT_SECRET
✅ JWT_EXPIRE
✅ COOKIE_EXPIRE
✅ PORT
... (all 17 variables)
```

---

## Quick Start Checklist

- [ ] Open Ubuntu terminal (not PowerShell)
- [ ] `cd /home/chakradhar_kolipaka/Assesments/billion-towers`
- [ ] `npm install` (if node_modules missing)
- [ ] `npm run backend` - wait for "Server running on http://localhost:3099"
- [ ] Open new terminal tab
- [ ] `npm start` - wait for "webpack compiled successfully"
- [ ] Open http://localhost:3000
- [ ] Click "Sign In" → use admin@billiontowers.demo / Admin@12345
- [ ] Connect MetaMask → approve Arbitrum Sepolia network switch

---

## Still Having Issues?

1. **Check all files are saved**
2. **Restart both terminals** (frontend + backend)
3. **Clear browser cache** and cookies
4. **Check browser console** for errors (F12 → Console tab)
5. **Check backend logs** in the terminal running `npm run backend`

### Get Detailed Logs

Backend with verbose logging:
```bash
NODE_ENV=development DEBUG=* npm run backend
```

Frontend with full error stack:
```bash
REACT_APP_DEBUG=true npm start
```
