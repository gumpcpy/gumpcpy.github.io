#!/usr/bin/env bash
# Serve apps/personal directly (no build). Symlinks content/assets into place.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PERSONAL="$ROOT/apps/personal"
PORT="${PORT:-8080}"

mkdir -p "$PERSONAL/assets"
ln -sfn "$ROOT/content" "$PERSONAL/data"
ln -sfn "$ROOT/assets/personal/coursera" "$PERSONAL/assets/coursera"

cd "$PERSONAL"
echo "Personal site (no build) → http://localhost:${PORT}/"
echo "Editing apps/personal or content/ — refresh the browser to see changes."
exec python3 -m http.server "$PORT"
