#!/usr/bin/env bash
# Assemble static personal site into docs/ (GitHub Pages: branch main → /docs).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/docs"
SRC="$ROOT/apps/personal"

rm -rf "$DIST"
mkdir -p "$DIST/data/work" "$DIST/assets" "$DIST/js"

# Pages
cp "$SRC/index.html" "$DIST/"
cp "$SRC/favicon.ico" "$DIST/"
cp "$SRC/styles.css" "$DIST/"
cp -R "$SRC/js/." "$DIST/js/"
cp -R "$SRC/work" "$DIST/work"
cp -R "$SRC/profile" "$DIST/profile"
touch "$DIST/.nojekyll"

# Keep index.json ready flags in sync with item JSON files
python3 "$ROOT/scripts/sync-work-index.py"

# Structured data
mkdir -p "$DIST/data/work/items"
cp "$ROOT/content/work/taxonomy.json" "$DIST/data/work/"
cp "$ROOT/content/work/index.json" "$DIST/data/work/"
cp -R "$ROOT/content/work/items/." "$DIST/data/work/items/"
cp "$ROOT/content/profile.json" "$DIST/data/"
cp "$ROOT/content/learning.json" "$DIST/data/"

# Assets
cp -R "$ROOT/assets/personal/coursera" "$DIST/assets/coursera"
mkdir -p "$DIST/assets/shared"
cp -R "$ROOT/assets/shared/posters" "$DIST/assets/shared/posters"
if [[ -d "$ROOT/assets/work" ]]; then
  cp -R "$ROOT/assets/work" "$DIST/assets/work"
fi

# Local preview alias
rm -rf "$ROOT/dist-personal"
cp -R "$DIST" "$ROOT/dist-personal"

echo "✓ built personal → $DIST (and dist-personal/)"
