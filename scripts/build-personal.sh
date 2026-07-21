#!/usr/bin/env bash
# Assemble static personal site into dist-personal/ for GitHub Pages.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist-personal"

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

# Bump cache-bust query in assembled HTML if present
# (apps/personal may already include ?v=; leave as-is)

echo "✓ built personal → $DIST"
