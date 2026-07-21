#!/usr/bin/env bash
# Build company site and rsync dist/ to the remote nginx root.
#
# Setup:
#   cp .env.company.example .env.company
#   # edit host / path / ssh key
#
# Usage:
#   ./scripts/deploy-company.sh           # build + rsync
#   ./scripts/deploy-company.sh --dry-run # show rsync plan only
#   ./scripts/deploy-company.sh --skip-build

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="${COMPANY_ENV_FILE:-$ROOT/.env.company}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "error: missing $ENV_FILE" >&2
  echo "  cp .env.company.example .env.company" >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

: "${COMPANY_SSH_HOST:?set COMPANY_SSH_HOST in .env.company}"
: "${COMPANY_SSH_PATH:?set COMPANY_SSH_PATH in .env.company}"

COMPANY_SSH_PORT="${COMPANY_SSH_PORT:-22}"
COMPANY_SSH_KEY="${COMPANY_SSH_KEY:-}"
DIST="$ROOT/apps/company/dist"

DRY=false
SKIP_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=true ;;
    --skip-build) SKIP_BUILD=true ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
    *)
      echo "unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

if [[ "$SKIP_BUILD" != true ]]; then
  echo "→ building company…"
  bash "$ROOT/scripts/build-company.sh"
fi

if [[ ! -d "$DIST" ]] || [[ -z "$(ls -A "$DIST" 2>/dev/null)" ]]; then
  echo "error: $DIST is empty. Run build first." >&2
  exit 1
fi

RSYNC_OPTS=(-avz --delete --human-readable)
if [[ "$DRY" == true ]]; then
  RSYNC_OPTS+=(--dry-run)
  echo "→ dry-run rsync (no changes on server)"
fi

SSH_OPTS=(-p "$COMPANY_SSH_PORT")
if [[ -n "$COMPANY_SSH_KEY" ]]; then
  SSH_OPTS+=(-i "$COMPANY_SSH_KEY")
fi

echo "→ sync $DIST/ → ${COMPANY_SSH_HOST}:${COMPANY_SSH_PATH}/"
rsync "${RSYNC_OPTS[@]}" \
  -e "ssh ${SSH_OPTS[*]}" \
  "$DIST/" \
  "${COMPANY_SSH_HOST}:${COMPANY_SSH_PATH}/"

if [[ "$DRY" == true ]]; then
  echo "✓ dry-run complete"
else
  echo "✓ company site updated"
  echo "  https://www.huhu-tech.com/"
fi
