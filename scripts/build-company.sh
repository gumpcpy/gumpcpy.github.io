#!/usr/bin/env bash
# Copy shared content/assets into apps/company/public, then Vite-build → dist/
#
# Usage:
#   ./scripts/build-company.sh           # sync public + production build
#   ./scripts/build-company.sh --dev-prep  # only sync public (for vite dev)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/apps/company"
PUBLIC="$APP/public"
DEV_PREP=false

if [[ "${1:-}" == "--dev-prep" ]]; then
  DEV_PREP=true
fi

rm -rf "$PUBLIC/media" "$PUBLIC/content"
mkdir -p "$PUBLIC/media" "$PUBLIC/content"

cp -R "$ROOT/assets/company" "$PUBLIC/media/company"
cp -R "$ROOT/assets/shared" "$PUBLIC/media/shared"
cp "$ROOT/content/company.json" "$PUBLIC/content/company.json"
cp "$ROOT/assets/company/brand/favicon.ico" "$PUBLIC/favicon.ico"

echo "✓ synced content/assets → apps/company/public"

if [[ "$DEV_PREP" == true ]]; then
  exit 0
fi

echo "→ vite build"
npm run build -w apps/company

echo "✓ built company → $APP/dist"
