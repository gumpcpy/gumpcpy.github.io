#!/usr/bin/env bash
# Build + deploy personal (GitHub Pages) and company (rsync).
#
# Usage:
#   ./deploy.sh "your commit message"   # build → commit if dirty → push → company
#   ./deploy.sh                         # build → push (working tree must be clean) → company
#   ./deploy.sh --personal-only "msg"
#   ./deploy.sh --company-only
#   ./deploy.sh --dry-run "msg"         # company rsync dry-run only
#
# Requires:
#   - git remote write access for personal (https://gumpcpy.github.io/)
#   - .env.company for company rsync (https://www.huhu-tech.com/)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

REMOTE="${REMOTE:-origin}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

PERSONAL=true
COMPANY=true
DRY=false
MSG=""

for arg in "$@"; do
  case "$arg" in
    --personal-only) COMPANY=false ;;
    --company-only) PERSONAL=false ;;
    --dry-run) DRY=true ;;
    -h|--help)
      sed -n '2,14p' "$0"
      exit 0
      ;;
    -*)
      echo "unknown option: $arg" >&2
      exit 1
      ;;
    *)
      if [[ -n "$MSG" ]]; then
        echo "error: unexpected extra argument: $arg" >&2
        exit 1
      fi
      MSG="$arg"
      ;;
  esac
done

if [[ "$BRANCH" == "HEAD" ]]; then
  echo "error: detached HEAD — checkout a branch first." >&2
  exit 1
fi

if [[ "$PERSONAL" == true ]] && ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "error: remote '$REMOTE' not found." >&2
  exit 1
fi

# ── build ──────────────────────────────────────────────────────────
if [[ "$PERSONAL" == true ]]; then
  echo "→ building personal…"
  bash "$ROOT/scripts/build-personal.sh"
fi

if [[ "$COMPANY" == true ]]; then
  echo "→ building company…"
  bash "$ROOT/scripts/build-company.sh"
fi

# ── personal: commit + push ────────────────────────────────────────
if [[ "$PERSONAL" == true ]]; then
  # Never stage secrets / huge local media
  EXCLUDE=(
    '.env.company'
    'assets/personal/speech'
    'assets/personal/speech/**'
  )

  dirty=false
  if [[ -n "$(git status --porcelain)" ]]; then
    dirty=true
  fi

  if [[ "$dirty" == true ]]; then
    if [[ -z "$MSG" ]]; then
      echo "error: uncommitted changes detected. Pass a commit message:" >&2
      echo "  ./deploy.sh \"update sites\"" >&2
      git status --short >&2
      exit 1
    fi

    # Stage everything except excluded paths
    git add -A
    for path in "${EXCLUDE[@]}"; do
      git reset -q -- "$path" 2>/dev/null || true
    done

    if [[ -z "$(git diff --cached --name-only)" ]]; then
      echo "error: nothing to commit after exclusions." >&2
      git status --short >&2
      exit 1
    fi

    git commit -m "$MSG"
    echo "✓ committed: $MSG"
  elif [[ -n "$MSG" ]]; then
    echo "· working tree clean — skip commit (message ignored)"
  fi

  if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
    git push "$REMOTE" "$BRANCH"
  else
    git push -u "$REMOTE" "$BRANCH"
  fi

  echo "✓ personal pushed $BRANCH → $REMOTE"
  echo "  https://gumpcpy.github.io/"
fi

# ── company: rsync ─────────────────────────────────────────────────
if [[ "$COMPANY" == true ]]; then
  COMPANY_ARGS=(--skip-build)
  if [[ "$DRY" == true ]]; then
    COMPANY_ARGS+=(--dry-run)
  fi
  bash "$ROOT/scripts/deploy-company.sh" "${COMPANY_ARGS[@]}"
fi

echo ""
echo "✓ deploy complete"
[[ "$PERSONAL" == true ]] && echo "  personal → https://gumpcpy.github.io/"
[[ "$COMPANY" == true && "$DRY" != true ]] && echo "  company  → https://www.huhu-tech.com/"
