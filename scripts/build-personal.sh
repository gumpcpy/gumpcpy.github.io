#!/usr/bin/env bash
# Assemble static personal site into docs/ (GitHub Pages: branch main → /docs).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/docs"

rm -rf "$DIST"
mkdir -p "$DIST/data" "$DIST/assets"

cp "$ROOT/apps/personal/index.html" "$DIST/"
cp "$ROOT/apps/personal/app.js" "$DIST/"
cp "$ROOT/apps/personal/styles.css" "$DIST/"
cp "$ROOT/apps/personal/favicon.ico" "$DIST/"
touch "$DIST/.nojekyll"

cp "$ROOT/content/projects.json" "$DIST/data/"
cp "$ROOT/content/learning.json" "$DIST/data/"
cp -R "$ROOT/assets/personal/coursera" "$DIST/assets/coursera"

# Keep dist-personal as a local preview alias
rm -rf "$ROOT/dist-personal"
cp -R "$DIST" "$ROOT/dist-personal"

echo "✓ built personal → $DIST (and dist-personal/)"
