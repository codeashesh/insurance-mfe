#!/bin/bash
# deploy-firebase.sh — Build all apps and deploy to Firebase Hosting
# Usage: bash deploy-firebase.sh

set -e

echo "============================================"
echo "  SecureLife Insurance — Firebase Deployment"
echo "============================================"
echo ""

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Step 1: Install dependencies
echo "[1/4] Installing dependencies..."
cd "$ROOT_DIR/mfe-policy-dashboard" && npm install
cd "$ROOT_DIR/mfe-premium-payment" && npm install
cd "$ROOT_DIR/container" && npm install

# Step 2: Build MFEs first (container depends on their URLs)
echo ""
echo "[2/4] Building MFE 1 — Policy Dashboard..."
cd "$ROOT_DIR/mfe-policy-dashboard" && npm run build

echo ""
echo "[3/4] Building MFE 2 — Premium Payment..."
cd "$ROOT_DIR/mfe-premium-payment" && npm run build

# Step 3: Build Container (with production remote URLs)
echo ""
echo "[3/4] Building Container App..."
cd "$ROOT_DIR/container"
NODE_ENV=production npm run build

# Step 4: Deploy to Firebase
echo ""
echo "[4/4] Deploying to Firebase Hosting..."
cd "$ROOT_DIR"
firebase deploy --only hosting

echo ""
echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo ""
echo "  Container:        https://insurance-mfe.web.app"
echo "  Policy Dashboard: https://insurance-mfe-policy.web.app"
echo "  Premium Payment:  https://insurance-mfe-payment.web.app"
echo ""
