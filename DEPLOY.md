# Deploy `bt.ariworks.online` (production)

The app is a Create React App **static build**. This guide uses **PM2** (`pm2 serve`) on port **3091** (adjust if that port is taken: set `BT_PORT`).

## 1. On the server (one-time)

```bash
# Deploy tree (default)
sudo mkdir -p /var/www/bt.ariworks.online
sudo chown -R "$USER":"$USER" /var/www/bt.ariworks.online
```

Copy the repo’s `scripts/deploy-pm2.sh` onto the server, or clone the repo first and run the script from the repo.

**First deploy** (clone + build + PM2):

```bash
cd /path/to/billion-towers   # or only copy scripts/ + run with env vars
chmod +x scripts/deploy-pm2.sh
export DEPLOY_ROOT=/var/www/bt.ariworks.online
export APP_DIR=/var/www/bt.ariworks.online/app
export BT_PORT=3091
./scripts/deploy-pm2.sh
```

**Updates** (same command from a clone of `app`, or re-run the script after pulling the script into place):

```bash
cd /var/www/bt.ariworks.online/app
git pull origin main
npm ci --omit=dev
npm run build
pm2 delete billion-towers 2>/dev/null || true
pm2 serve /var/www/bt.ariworks.online/app/build 3091 --name billion-towers --spa
pm2 save
```

**Note:** `scripts/deploy-pm2.sh` prefers `npm ci --omit=dev` (strict, reproducible) and **falls back** to `npm install --omit=dev` if the lockfile and server `npm` disagree—then runs `react-scripts build` and restarts PM2.

## 1b. Dependency audits (why this is safe on the server)

- **Production install** (`npm ci --omit=dev`, as in the deploy script): `npm audit --omit=dev` should show **no critical or high** issues. It will usually still report **two moderate** advisories on **`webpack-dev-server@4.15.2`**: that is the latest **4.x** line, and `react-scripts@5.0.1` cannot jump to **webpack-dev-server 5.2.1+** without breaking the CRA dev API. Those issues affect **`npm start` / local dev** (source-map exposure scenarios), **not** serving the static **`build/`** site via PM2/Nginx. Clearing them for real means **migrating off Create React App** (e.g. to Vite) or upgrading to a toolchain that bundles a patched dev server.
- **CI / green deploy gate:** run `npm run audit:prod:high` — exits **0** when there are no high/critical findings (ignores the known moderates). Use `npm run audit:prod` for the full report.
- **`npm ci` vs npm versions:** If `npm ci --omit=dev` errors with *“package.json and package-lock.json … not in sync”* or *Missing: yaml@…*, pull the latest repo (we pin **`yaml`** via overrides) or run **`npm install --omit=dev`** once; the deploy script falls back automatically.
- **Full dev install** (`npm install` on your laptop): `npm audit` may list **low** `elliptic` (browserify polyfills) plus the same **webpack-dev-server** moderates. **Do not run `npm audit fix --force`** with Create React App—it can replace `react-scripts` with a bogus version. Clearing those for good means **migrating off CRA** (e.g. to Vite) later.

## 2. PM2 on reboot (one-time)

```bash
pm2 startup
# Run the command it prints, then:
pm2 save
```

## 3. Reverse proxy (recommended)

Expose **Nginx** (or Caddy) on **80/443** and proxy to `http://127.0.0.1:3091`.

Example: `nginx.bt.ariworks.online.conf.example` in this repo.

```bash
sudo cp nginx.bt.ariworks.online.conf.example /etc/nginx/sites-available/bt.ariworks.online
sudo ln -sf /etc/nginx/sites-available/bt.ariworks.online /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**Cloudflare**

- **Flexible SSL**: browser ↔ Cloudflare HTTPS, Cloudflare → your origin **HTTP** (port 80). Nginx `listen 80` is enough.
- **Full / Full (strict)**: origin must serve **HTTPS** with a valid cert (Let’s Encrypt or Cloudflare Origin Certificate). Uncomment the HTTPS `server` block in the example after you have certs.

## 4. Pick another port

If `3091` is busy:

```bash
export BT_PORT=3100
./scripts/deploy-pm2.sh
```

Update Nginx `proxy_pass` to the same port.

## 5. Smoke test

```bash
curl -I http://127.0.0.1:3091
```

You should see `200` and HTML. Open `https://bt.ariworks.online` after DNS and Nginx are correct.

## 6. Nginx + Let’s Encrypt (HTTPS on the origin)

Prerequisites: DNS `bt.ariworks.online` → this server’s public IP, ports **80** and **443** open (e.g. `ufw allow 'Nginx Full'`). PM2 must still be serving on **3091**.

```bash
# Install Nginx + Certbot
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Site: HTTP reverse proxy to PM2 (Certbot will add TLS to this file)
sudo tee /etc/nginx/sites-available/bt.ariworks.online <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name bt.ariworks.online;

    location / {
        proxy_pass http://127.0.0.1:3091;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/bt.ariworks.online /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Issue certificate and let Certbot patch Nginx for HTTPS + HTTP→HTTPS redirect
# Replace the email with a real address you monitor.
sudo certbot --nginx -d bt.ariworks.online --non-interactive --agree-tos -m YOUR_EMAIL@example.com --redirect

sudo nginx -t && sudo systemctl reload nginx
```

**Cloudflare:** After the origin has a valid cert, set SSL/TLS mode to **Full (strict)** so browsers → Cloudflare → your server all use HTTPS.

If HTTP-01 validation fails while the hostname is **proxied** (orange cloud), temporarily set the DNS record to **DNS only** (grey), run `certbot` again, then turn the proxy back on—or use Certbot’s **DNS** plugin for Cloudflare.

## 7. Full teardown (remove site, TLS, PM2, and files)

Run when you want **bt.ariworks.online** gone from this server. Order avoids Nginx failing while cert files disappear.

**1. Stop PM2 app**

```bash
pm2 delete billion-towers
pm2 save
```

**2. Remove Nginx vhost** (unlink first, then delete the file Certbot edited)

```bash
sudo rm -f /etc/nginx/sites-enabled/bt.ariworks.online
sudo rm -f /etc/nginx/sites-available/bt.ariworks.online
sudo nginx -t && sudo systemctl reload nginx
```

**3. Delete Let’s Encrypt certificate** (removes files under `/etc/letsencrypt/live/bt.ariworks.online` and renewal config)

```bash
sudo certbot delete --cert-name bt.ariworks.online
```

If Certbot asks for confirmation, answer yes—or add `--non-interactive` if your version supports it.

**4. Remove application directory**

```bash
sudo rm -rf /var/www/bt.ariworks.online
```

**5. Cloudflare / DNS**

Remove or disable the **A** (or **CNAME**) record for `bt.ariworks.online` in Cloudflare (or your DNS host) yourself—nothing on the server does that.

**6. Optional: UFW**

If you opened Nginx only for this box and nothing else needs 80/443, adjust rules as you see fit (`sudo ufw status numbered` then `sudo ufw delete <n>`).

---

**Note:** `nginx: [warn] conflicting server name "*.ipcmv.com" on 0.0.0.0:443` means **two vhosts** on this machine both claim the same `server_name` on port 443. It does not break `bt.ariworks.online`, but you should fix or remove the duplicate `server_name` in the other site config when you next edit Nginx.
