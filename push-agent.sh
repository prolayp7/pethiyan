#!/usr/bin/env bash
# =============================================================================
# push-agent.sh — Auto Push Agent for prolayp7/pethiyan → dev branch
# =============================================================================
# Usage:
#   ./push-agent.sh                        # interactive: prompts for commit msg
#   ./push-agent.sh "My commit message"    # non-interactive: uses given message
#   ./push-agent.sh --auto                 # fully automatic: generates commit msg
# =============================================================================

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
REPO_DIR="/var/www/lcommerce"
REMOTE="origin"
BRANCH="dev"
EXPECTED_REMOTE="https://github.com/prolayp7/pethiyan.git"

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

log()    { echo -e "${CYAN}[agent]${RESET} $*"; }
ok()     { echo -e "${GREEN}[✓]${RESET} $*"; }
warn()   { echo -e "${YELLOW}[!]${RESET} $*"; }
error()  { echo -e "${RED}[✗]${RESET} $*" >&2; }
banner() { echo -e "\n${BOLD}${CYAN}══════════════════════════════════════════${RESET}"; echo -e "${BOLD}${CYAN}  🚀  pethiyan Push Agent  ${RESET}"; echo -e "${BOLD}${CYAN}══════════════════════════════════════════${RESET}\n"; }

# ── Helpers ───────────────────────────────────────────────────────────────────
generate_commit_message() {
  local staged_files
  staged_files=$(git -C "$REPO_DIR" diff --cached --name-only 2>/dev/null || true)

  # Detect dominant area of changes
  local areas=()
  echo "$staged_files" | grep -qi "^admin/" && areas+=("Admin")
  echo "$staged_files" | grep -qi "^frontend/" && areas+=("Frontend")
  echo "$staged_files" | grep -qi "^api/" && areas+=("API")
  echo "$staged_files" | grep -qi "test\|spec" && areas+=("Tests")

  local area_str
  if [[ ${#areas[@]} -gt 0 ]]; then
    area_str=$(IFS=" & "; echo "${areas[*]}")
  else
    area_str="General"
  fi

  # Count changes
  local num_files
  num_files=$(echo "$staged_files" | grep -c . || echo 0)

  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M')

  echo "${area_str} updates — ${num_files} file(s) changed [${timestamp}]"
}

check_prerequisites() {
  log "Checking prerequisites..."

  # Must be inside the repo
  if [[ ! -d "$REPO_DIR/.git" ]]; then
    error "Not a git repository: $REPO_DIR"
    exit 1
  fi

  # Verify remote
  local actual_remote
  actual_remote=$(git -C "$REPO_DIR" remote get-url "$REMOTE" 2>/dev/null || echo "")
  if [[ "$actual_remote" != "$EXPECTED_REMOTE" ]]; then
    error "Remote '$REMOTE' points to '$actual_remote', expected '$EXPECTED_REMOTE'"
    exit 1
  fi

  # Verify branch
  local current_branch
  current_branch=$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD)
  if [[ "$current_branch" != "$BRANCH" ]]; then
    warn "Current branch is '$current_branch', switching to '$BRANCH'..."
    git -C "$REPO_DIR" checkout "$BRANCH"
  fi

  ok "Repository: $EXPECTED_REMOTE"
  ok "Branch: $BRANCH"
}

show_status() {
  log "Current working tree status:"
  echo ""
  git -C "$REPO_DIR" status --short
  echo ""
}

stage_changes() {
  log "Staging all changes (git add -A)..."
  git -C "$REPO_DIR" add -A
  ok "All changes staged."

  local staged_count
  staged_count=$(git -C "$REPO_DIR" diff --cached --name-only | wc -l)

  if [[ "$staged_count" -eq 0 ]]; then
    warn "Nothing to commit — working tree is clean."
    exit 0
  fi

  log "Files to be committed ($staged_count):"
  git -C "$REPO_DIR" diff --cached --name-only | sed 's/^/  + /'
  echo ""
}

commit_changes() {
  local message="$1"
  log "Committing with message: \"$message\""
  git -C "$REPO_DIR" commit -m "$message"
  ok "Commit created."
}

pull_and_push() {
  log "Pulling latest from $REMOTE/$BRANCH (rebase)..."
  if ! git -C "$REPO_DIR" pull "$REMOTE" "$BRANCH" --rebase --autostash 2>&1; then
    error "Pull/rebase failed. Please resolve conflicts manually, then run:"
    error "  git rebase --continue"
    error "  ./push-agent.sh --no-stage"
    exit 1
  fi
  ok "Pull complete."

  log "Pushing to $REMOTE/$BRANCH..."
  git -C "$REPO_DIR" push "$REMOTE" "$BRANCH"
  ok "Push successful! Code is live on prolayp7/pethiyan@${BRANCH}."
}

# ── Main ──────────────────────────────────────────────────────────────────────
banner

MODE="interactive"
CUSTOM_MESSAGE=""
SKIP_STAGE=false

# Parse args
for arg in "$@"; do
  case "$arg" in
    --auto)       MODE="auto" ;;
    --no-stage)   SKIP_STAGE=true ;;
    --help|-h)
      echo "Usage: $0 [\"commit message\"] [--auto] [--no-stage]"
      echo ""
      echo "  (no args)          Interactive: prompts for commit message"
      echo "  \"msg\"              Non-interactive: uses given message"
      echo "  --auto             Fully automatic: generates commit message"
      echo "  --no-stage         Skip git add (use already-staged changes)"
      exit 0
      ;;
    -*)           warn "Unknown flag: $arg (ignored)" ;;
    *)            CUSTOM_MESSAGE="$arg"; MODE="custom" ;;
  esac
done

check_prerequisites
show_status

# Stage unless skipped
if [[ "$SKIP_STAGE" == false ]]; then
  stage_changes
fi

# Determine commit message
COMMIT_MSG=""
case "$MODE" in
  interactive)
    echo -e "${CYAN}Enter commit message${RESET} (or press Enter to auto-generate):"
    read -r -p "  > " COMMIT_MSG
    if [[ -z "$COMMIT_MSG" ]]; then
      COMMIT_MSG=$(generate_commit_message)
      log "Auto-generated: \"$COMMIT_MSG\""
    fi
    ;;
  auto)
    COMMIT_MSG=$(generate_commit_message)
    log "Auto-generated message: \"$COMMIT_MSG\""
    ;;
  custom)
    COMMIT_MSG="$CUSTOM_MESSAGE"
    ;;
esac

commit_changes "$COMMIT_MSG"

# Confirm push in interactive mode
if [[ "$MODE" == "interactive" ]]; then
  echo -e "\n${YELLOW}Ready to push to ${BOLD}$REMOTE/$BRANCH${RESET}${YELLOW}. Proceed? [Y/n]${RESET} "
  read -r -p "  > " CONFIRM
  CONFIRM="${CONFIRM:-Y}"
  if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    warn "Push cancelled. Your commit is saved locally."
    exit 0
  fi
fi

pull_and_push

echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════════${RESET}"
echo -e "${BOLD}${GREEN}  ✅  Done! View on GitHub:${RESET}"
echo -e "${BOLD}${GREEN}  https://github.com/prolayp7/pethiyan/tree/${BRANCH}${RESET}"
echo -e "${BOLD}${GREEN}════════════════════════════════════════${RESET}"
echo ""
