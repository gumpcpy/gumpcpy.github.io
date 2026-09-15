#!/usr/bin/env bash
# Build personal site and serve docs/ for local preview.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8090}"

bash "$ROOT/scripts/build-personal.sh"

cd "$ROOT"
echo "Personal site → http://localhost:${PORT}/  (serves docs/; rebuild after content edits)"
exec python3 -m http.server "$PORT" --directory docs
