# Quick Fix for 431 Request Header Fields Too Large

## Problem
All API requests failing with "431 Request Header Fields Too Large"

## Root Cause
Request headers (cookies, authorization tokens, or browser extension headers) exceed server limit.

## Fixes Applied

### 1. Increased Server Header Limit ✅
- Changed from 81920 bytes (80KB) to 163840 bytes (160KB)
- Updated in both `package.json` and `server/server.js`

### 2. Restart Backend Required

**Stop the backend if running** (Ctrl+C in the terminal)

**Start with new limits:**
```bash
npm run backend
```

You should see:
```
[server] HTTP max header size set to: 163840 bytes
```

### 3. Clear Browser State

#### Option A: Clear Site Data (Recommended)
1. Open http://localhost:3000
2. Press F12 (open DevTools)
3. Go to **Application** tab
4. Click **Clear site data** button
5. Reload page (Ctrl+R or F5)

#### Option B: Incognito/Private Window
1. Open browser in Incognito/Private mode
2. Go to http://localhost:3000
3. Sign up or sign in

#### Option C: Clear Cookies Manually
1. F12 → Application → Cookies → http://localhost:3000
2. Right-click → Clear all cookies
3. Also clear http://localhost:3099 cookies
4. Reload page

### 4. Check MetaMask
If MetaMask is installed and adding large headers:
1. Temporarily disable MetaMask extension
2. Test signup/signin (should work without wallet)
3. Re-enable MetaMask after successful login

---

## Testing After Fix

### 1. Health Check
```bash
curl http://localhost:3099/api/health
```

Should work (no 431 error).

### 2. Register Test
```bash
curl -X POST http://localhost:3099/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@12345",
    "gender": "other"
  }'
```

Should return success (not 431).

### 3. Login Test
```bash
curl -X POST http://localhost:3099/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@billiontowers.demo",
    "password": "Admin@12345"
  }'
```

Should return user data and token.

---

## If Still Getting 431

### Debugging Steps

1. **Check actual header size:**
   
   Open browser DevTools → Network tab → Click any failed request → Headers → Request Headers
   
   Look for unusually large headers (>50KB)

2. **Common culprits:**
   - Large cookies from other sites on localhost
   - Browser extensions (especially crypto wallets with many accounts)
   - Large authorization tokens
   - Debug/logging extensions

3. **Nuclear option - Clear everything:**
   ```bash
   # Stop both servers
   # Clear browser cache and cookies completely
   # Restart browser
   # Start backend: npm run backend
   # Start frontend: npm start
   ```

---

## Expected Working Flow

1. ✅ Open http://localhost:3000
2. ✅ Click "Sign Up"
3. ✅ Fill form and submit → Success message
4. ✅ Click "Sign In"  
5. ✅ Enter credentials → Redirected to dashboard
6. ✅ Click "Connect Wallet" → MetaMask opens → Approve → Connected

---

## Files Modified

- `package.json` - Increased `--max-http-header-size` to 163840
- `server/server.js` - Added `http.maxHeaderSize = 163840`

## Restart Required

**Must restart backend** for changes to take effect:
```bash
# Ctrl+C to stop
npm run backend  # Start again
```
