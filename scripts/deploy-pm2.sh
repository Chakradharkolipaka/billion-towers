#!/usr/bin/env bash
# Deploy Billion Towers (CRA static build) with PM2 on a free port.
# Run on the server after DNS for bt.ariworks.online points here.
#
# Usage:
#   chmod +x scripts/deploy-pm2.sh
#   ./scripts/deploy-pm2.sh              # first deploy (clone + build + pm2)
#   ./scripts/deploy-pm2.sh --update     # pull latest, rebuild, restart pm2

set -euo pipefail

APP_NAME="${PM2_APP_NAME:-billion-towers}"
PORT="${BT_PORT:-3091}"
DEPLOY_ROOT="${DEPLOY_ROOT:-/var/www/bt.ariworks.online}"
APP_DIR="${APP_DIR:-$DEPLOY_ROOT/app}"
GIT_URL="${GIT_URL:-https://github.com/ariworks-online/billion-towers.git}"
BRANCH="${GIT_BRANCH:-main}"

log() { printf '\n[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }

if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
  echo "Usage: $0 [--update]"
  echo "Env: DEPLOY_ROOT=$DEPLOY_ROOT APP_DIR=$APP_DIR PORT=$PORT GIT_URL=$GIT_URL PM2_APP_NAME=$APP_NAME"
  exit 0
fi

if [[ $EUID -eq 0 ]]; then
  log "Warning: running as root. Prefer a deploy user with sudo only where needed."
fi

mkdir -p "$DEPLOY_ROOT"

if [[ ! -d "$APP_DIR/.git" ]]; then
  log "Cloning into $APP_DIR ..."
  if [[ -d "$APP_DIR" ]] && [[ -n "$(ls -A "$APP_DIR" 2>/dev/null || true)" ]]; then
    echo "Directory $APP_DIR exists and is not empty. Remove it or set APP_DIR to an empty path." >&2
    exit 1
  fi
  mkdir -p "$(dirname "$APP_DIR")"
  git clone --branch "$BRANCH" "$GIT_URL" "$APP_DIR"
else
  log "Repo exists at $APP_DIR"
fi

cd "$APP_DIR"
log "Git pull ($BRANCH) ..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

log "Installing dependencies ..."
if [[ -f package-lock.json ]]; then
  if npm ci --omit=dev; then
    :
  else
    log "npm ci failed (often npm major-version vs lockfile); falling back to npm install --omit=dev"
    npm install --omit=dev
  fi
else
  npm install --omit=dev
fi

log "Production build ..."
npm run build

BUILD_DIR="$APP_DIR/build"
if [[ ! -d "$BUILD_DIR" ]]; then
  echo "Build failed: $BUILD_DIR missing." >&2
  exit 1
fi

log "Starting PM2 static server on port $PORT (SPA fallback) ..."
pm2 delete "$APP_NAME" 2>/dev/null || true
# --spa: send index.html for unknown routes (React Router)
pm2 serve "$BUILD_DIR" "$PORT" --name "$APP_NAME" --spa

pm2 save
log "Done. App name: $APP_NAME  URL: http://127.0.0.1:$PORT"
log "Point Nginx (or Caddy) at 127.0.0.1:$PORT for bt.ariworks.online — see nginx.bt.ariworks.online.conf.example"
