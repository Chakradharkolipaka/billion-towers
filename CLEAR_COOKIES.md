# Fix 431 Error - Clear Browser State

## Error: 431 Request Header Fields Too Large

This error occurs when browser cookies, MetaMask state, or other headers exceed the server's maximum header size limit.

## Quick Fix: Clear Browser Data

### Chrome/Brave/Edge
1. Press `F12` to open DevTools
2. Go to **Application** tab
3. In left sidebar, expand **Storage**
4. Click **Clear site data**
5. Check all boxes
6. Click **Clear site data**
7. Refresh page (`Ctrl+R` or `Cmd+R`)

### Alternative Method
1. Open `http://localhost:3000`
2. Press `F12`
3. Go to **Console** tab
4. Paste and run:
```javascript
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Firefox
1. Press `F12`
2. Go to **Storage** tab
3. Right-click **Cookies** → **Delete All**
4. Right-click **Local Storage** → **Delete All**
5. Right-click **Session Storage** → **Delete All**
6. Refresh page

## If Issue Persists

### 1. Check Server is Running with Correct Flags

**Stop the server** (Ctrl+C) and restart with:

```bash
npm run backend
```

This runs with `--max-http-header-size=327680` (320KB limit).

### 2. Check Backend Logs

Look for:
```
[server] HTTP max header size set to: 327680 bytes (320KB)
```

If you see `163840` or lower, the server needs restart.

### 3. Disable Browser Extensions Temporarily

MetaMask and other extensions can add large headers. Try:
1. Open in **Incognito/Private window** with extensions disabled
2. Or temporarily disable MetaMask and other extensions
3. Test signup/signin
4. Re-enable extensions after

### 4. Check for Stuck Cookies

In DevTools **Application** → **Cookies** → `http://localhost:3000`:
- If you see `token` cookie > 10KB, delete it
- Delete any old/corrupt cookies manually

### 5. Hard Refresh

After clearing data:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

## Root Cause

The 431 error happens when:
- Old JWT tokens accumulate in cookies
- MetaMask injects large headers
- React DevTools adds debugging headers
- Multiple failed requests cache headers

## Prevention

The server is now configured with:
- 320KB max header size (was 160KB)
- 50MB body payload limit
- Large header warnings in logs

These limits should prevent 431 errors going forward.

## Still Getting 431?

If none of the above work:

1. **Check you're running from WSL terminal** (not PowerShell)
2. **Ensure backend restarted** after the fixes
3. **Try a different browser** (Safari, Firefox)
4. **Check server logs** for "Large header detected" warnings
5. **Report header size** from logs

### Get Header Size Info

The server now logs large headers. Check terminal output for:
```
[app] Large header detected: XXXXX bytes from /api/user/register
```

If you see this, post the size and we can increase limits further.
