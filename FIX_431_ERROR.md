# FIXING 431 ERROR - Request Header Fields Too Large

## What You're Seeing

```
api/user/register:1  Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
api/user/login:1  Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
api/user/me:1  Failed to load resource: the server responded with a status of 431 (Request Header Fields Too Large)
```

## What It Means

The browser is sending HTTP headers (cookies, tokens, MetaMask data) that exceed the server's maximum allowed size. The server rejects the request before processing it.

## 3-Step Fix

### Step 1: Stop Current Server

Press `Ctrl+C` in the terminal running the backend.

### Step 2: Clear Browser Data

**Quick Method (Chrome/Brave/Edge):**
1. Open http://localhost:3000
2. Press `F12` to open DevTools
3. Click **Application** tab
4. Click **Clear site data** button
5. Check all boxes
6. Click **Clear site data** again to confirm

**Or Run This in Browser Console (F12 → Console):**
```javascript
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Step 3: Restart Backend with Increased Limits

From WSL Ubuntu terminal (NOT PowerShell):

```bash
cd /home/chakradhar_kolipaka/Assesments/billion-towers
npm run backend
```

**Verify you see:**
```
[server] HTTP max header size set to: 327680 bytes (320KB)
```

If you see `163840` or lower, the fix didn't apply. Make sure you:
- Stopped the old server completely
- Are running `npm run backend` (not `node server/server.js` directly)
- Are in the correct directory

### Step 4: Hard Refresh Browser

After backend restarts:
- Windows/Linux: Press `Ctrl + Shift + R`
- Mac: Press `Cmd + Shift + R`

## Test the Fix

### 1. Check Backend Health

```bash
curl http://localhost:3099/api/health
```

Should return:
```json
{"success":true,"message":"API is running","database":"connected"}
```

### 2. Test Registration

Open http://localhost:3000 and try signing up with:
- Name: Test User
- Email: test@example.com
- Password: Test@12345
- Gender: male

### 3. Test Login

Use the admin credentials:
- Email: admin@billiontowers.demo
- Password: Admin@12345

## What Changed

### Backend Configuration

**File: `package.json`**
- Increased `--max-http-header-size` from 163840 to 327680 (160KB → 320KB)

**File: `server/server.js`**
- Increased `http.maxHeaderSize` to 327680
- Added logging to confirm header size limit

**File: `server/app.js`**
- Added 50MB body payload limits
- Added middleware to log large headers
- Increased all body parsers to 50MB

## Still Getting 431?

### Try These Additional Fixes:

#### 1. Test in Incognito Mode
- Opens without extensions or cached data
- Chrome: `Ctrl+Shift+N` / `Cmd+Shift+N`
- Tests if extensions (MetaMask, React DevTools) are causing the issue

#### 2. Check Server Logs
Look for:
```
[app] Large header detected: XXXXX bytes from /api/user/register
```

If you see this, the headers are still too large. Report the size.

#### 3. Manually Delete Token Cookie
In DevTools (F12):
1. **Application** tab
2. **Cookies** → `http://localhost:3000`
3. Find `token` cookie
4. Right-click → **Delete**
5. Refresh page

#### 4. Try Different Browser
- Firefox (no MetaMask by default)
- Safari
- Edge

#### 5. Disable MetaMask Temporarily
- Only for testing signup/signin
- Re-enable after to test wallet connection

#### 6. Check Your Terminal
Make sure you're running from **WSL Ubuntu terminal**, not:
- ❌ Windows PowerShell
- ❌ Windows CMD
- ❌ Git Bash

## Verify Server Configuration

Run this diagnostic:
```bash
npm run test:headers
```

Expected output:
```
✅ Node started with flags: --max-http-header-size=327680
✅ Header size limit is sufficient: 327680 bytes (320KB)
✅ Backend is running on http://localhost:3099
✅ Database: connected
```

## Why Did This Happen?

Common causes:
1. **MetaMask** adds ~20-50KB of headers
2. **React DevTools** adds debugging headers
3. **Old JWT tokens** accumulating in cookies
4. **Multiple failed requests** caching headers
5. **Browser extensions** injecting data

The default Node.js limit is only 16KB (16,384 bytes). Modern web apps with MetaMask easily exceed this.

## Prevention

- Clear browser data weekly during development
- Don't accumulate multiple JWT tokens
- Use incognito for testing when possible
- Monitor server logs for "Large header" warnings

## Summary

✅ Server now accepts headers up to 320KB (was 160KB)
✅ Body payloads up to 50MB (was default 100KB)
✅ Logging added to detect large headers
✅ Browser data needs to be cleared once

**Run from WSL terminal → Clear browser data → Restart backend → Hard refresh browser**

You should now be able to signup, signin, and connect wallet without 431 errors.
