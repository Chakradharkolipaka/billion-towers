# Starting the Billion Towers Server

## Issue: WSL Performance from Windows

The server startup is very slow when run from Windows PowerShell accessing WSL files via `\\wsl.localhost\...` paths. This is a known Windows/WSL2 performance issue.

## Solution: Run from WSL Terminal

1. **Open WSL Ubuntu terminal directly** (not PowerShell)
2. Navigate to the project:
   ```bash
   cd /home/chakradhar_kolipaka/Assesments/billion-towers
   ```
3. Start the backend:
   ```bash
   npm run backend
   ```

## Alternative: Run from Windows Terminal with WSL

1. Open Windows Terminal
2. Select Ubuntu/WSL tab
3. Run the commands above

## Expected Output

When server starts successfully, you should see:
```
[server] ENV loaded from: .../server/config/config.env
[server] Validating environment...
[server] ✅ MONGO_URI found
[server] ✅ JWT_SECRET found
[server] Connecting to database...
[database] Connecting to MongoDB...
[database] ✅ Connected to: billion-towers
[database] Running seed script...
Admin user already exists: admin@billiontowers.demo
Reset admin password to default: Admin@12345
Products collection ready (6 documents).
MongoDB collections: investments, orders, products, users
[database] ✅ Seed complete
[server] ✅ Database ready
[server] ✅ Server running on http://localhost:3099
[server] ✅ Health check: http://localhost:3099/api/health
```

## Testing the Server

Once running, test with:
```bash
curl http://localhost:3099/api/health
```

Should return:
```json
{
  "success": true,
  "message": "API is running",
  "database": "connected",
  "timestamp": "2026-07-19T..."
}
```

## Frontend Connection

The React frontend should have:
```bash
# In package.json
"proxy": "http://localhost:3099"
```

Start frontend from WSL terminal:
```bash
npm start
```

## Admin Credentials

- Email: `admin@billiontowers.demo`
- Password: `Admin@12345`
