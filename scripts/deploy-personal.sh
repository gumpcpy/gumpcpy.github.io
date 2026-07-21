#!/usr/bin/env bash
# Build personal catalogue, commit (optional), push → GitHub Pages via Actions.
#
# Usage:
#   ./scripts/deploy-personal.sh "your commit message"
#   ./scripts/deploy-personal.sh                 # push only if clean
#
# Requires GitHub Pages source = GitHub Actions (see .github/workflows/deploy-personal.yml)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE="${REMOTE:-origin}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [[ "$BRANCH" == "HEAD" ]]; then
  echo "error: detached HEAD — checkout a branch first." >&2
  exit 1
fi

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "error: remote '$REMOTE' not found." >&2
  exit 1
fi

bash "$ROOT/scripts/build-personal.sh"

dirty=false
if [[ -n "$(git status --porcelain)" ]]; then
  dirty=true
fi

if [[ "$dirty" == true ]]; then
  if [[ $# -lt 1 || -z "${1:-}" ]]; then
    echo "error: uncommitted changes detected. Pass a commit message:" >&2
    echo "  ./scripts/deploy-personal.sh \"update catalogue\"" >&2
    git status --short >&2
    exit 1
  fi
  git add -A
  git commit -m "$1"
  echo "✓ committed: $1"
fi

if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  git push "$REMOTE" "$BRANCH"
else
  git push -u "$REMOTE" "$BRANCH"
fi

echo "✓ pushed $BRANCH → $REMOTE"
echo "  Pages: Settings → Deploy from branch → main → /docs"
echo "  https://gumpcpy.github.io/"
