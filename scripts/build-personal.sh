#!/usr/bin/env bash
# Assemble static personal site into docs/ (GitHub Pages: branch main → /docs).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/docs"
SRC="$ROOT/apps/personal"

rm -rf "$DIST"
mkdir -p "$DIST/data" "$DIST/assets" "$DIST/js"

# Pages
cp "$SRC/index.html" "$DIST/"
cp "$SRC/favicon.ico" "$DIST/"
cp "$SRC/styles.css" "$DIST/"
cp -R "$SRC/js/." "$DIST/js/"
cp -R "$SRC/projects" "$DIST/projects"
cp -R "$SRC/library" "$DIST/library"
cp -R "$SRC/about" "$DIST/about"
touch "$DIST/.nojekyll"

# Structured data
cp "$ROOT/content/projects.json" "$DIST/data/"
cp "$ROOT/content/learning.json" "$DIST/data/"
cp -R "$ROOT/assets/personal/coursera" "$DIST/assets/coursera"

# Library Markdown → indexes + HTML
python3 "$ROOT/scripts/build-library.py" "$DIST/data/library"

# Local preview alias
rm -rf "$ROOT/dist-personal"
cp -R "$DIST" "$ROOT/dist-personal"

echo "✓ built personal → $DIST (and dist-personal/)"
