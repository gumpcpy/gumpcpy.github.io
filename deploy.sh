#!/usr/bin/env bash
# Commit local changes (optional) and push to origin.
#
# Usage:
#   ./deploy.sh "your commit message"   # stage → commit → push
#   ./deploy.sh                         # push only (working tree must be clean)

set -euo pipefail

cd "$(dirname "$0")"

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

dirty=false
if [[ -n "$(git status --porcelain)" ]]; then
  dirty=true
fi

if [[ "$dirty" == true ]]; then
  if [[ $# -lt 1 || -z "${1:-}" ]]; then
    echo "error: uncommitted changes detected. Pass a commit message:" >&2
    echo "  ./deploy.sh \"update catalogue\"" >&2
    git status --short >&2
    exit 1
  fi

  MSG="$1"
  git add -A
  git commit -m "$MSG"
  echo "✓ committed: $MSG"
fi

# Push current branch; create upstream tracking on first push.
if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  git push "$REMOTE" "$BRANCH"
else
  git push -u "$REMOTE" "$BRANCH"
fi

echo "✓ pushed $BRANCH → $REMOTE"
echo "  https://gumpcpy.github.io/"
