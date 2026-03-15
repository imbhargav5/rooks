#!/bin/bash
# Ralph - Autonomous AI development loop for Claude Code
# Adapted for rooks monorepo

set -e

VERSION="1.0.0"

# Help text
show_help() {
    echo "ralph - Autonomous AI development loop for Claude Code"
    echo ""
    echo "Usage:"
    echo "  ralph              Run until all stories complete"
    echo "  ralph 50           Limit to 50 iterations"
    echo "  ralph -v, --version"
    echo "  ralph -h, --help"
}

# Handle immediate commands first
case "${1:-}" in
    -v|--version)
        echo "ralph $VERSION"
        exit 0
        ;;
    -h|--help)
        show_help
        exit 0
        ;;
esac

# Defaults
MAX_ITERATIONS=0

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        *)
            MAX_ITERATIONS="$1"
            shift
            ;;
    esac
done

# Find prompt file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPT_FILE="$SCRIPT_DIR/ralph-prompt.md"

if [ ! -f "$PROMPT_FILE" ]; then
    echo "Error: Ralph prompt file not found at $PROMPT_FILE"
    exit 1
fi

if [ ! -f ".ralph/stories.json" ]; then
    echo "Error: .ralph/stories.json not found in current directory"
    echo "Create .ralph/stories.json first to define your tasks"
    exit 1
fi

# Braille spinner frames
SPINNER=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
if ! echo -e "⠋" | grep -q "⠋" 2>/dev/null; then
    SPINNER=("|" "/" "-" "\\")
fi

# Run Claude with spinner
run_claude() {
    local prompt="$1"
    local message="$2"

    local output_file=$(mktemp)

    claude --dangerously-skip-permissions --print "$prompt" > "$output_file" 2>&1 &
    local pid=$!

    local spin_idx=0
    while kill -0 $pid 2>/dev/null; do
        printf "\r${SPINNER[$spin_idx]} $message"
        spin_idx=$(( (spin_idx + 1) % ${#SPINNER[@]} ))
        sleep 0.1
    done

    wait $pid
    local exit_code=$?

    CLAUDE_OUTPUT=$(cat "$output_file")
    rm -f "$output_file"

    return $exit_code
}

# Initialize progress.txt if needed
if [ ! -f ".ralph/progress.txt" ]; then
    PROJECT_NAME=$(jq -r '.project // "Project"' .ralph/stories.json)
    cat > .ralph/progress.txt << EOF
# $PROJECT_NAME Progress Log

---

EOF
    echo "Created .ralph/progress.txt"
fi

# Initialize learnings.txt if needed
if [ ! -f ".ralph/learnings.txt" ]; then
    cat > .ralph/learnings.txt << EOF
# Project Learnings

## Codebase Patterns


## Gotchas

EOF
    echo "Created .ralph/learnings.txt"
fi

if [ "$MAX_ITERATIONS" -eq 0 ]; then
    echo "Starting Ralph (unlimited iterations)"
else
    echo "Starting Ralph - Max iterations: $MAX_ITERATIONS"
fi
echo ""

# Main loop
iter=1
while [ "$MAX_ITERATIONS" -eq 0 ] || [ "$iter" -le "$MAX_ITERATIONS" ]; do
    if [ "$MAX_ITERATIONS" -eq 0 ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Ralph Iteration $iter"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    else
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Ralph Iteration $iter / $MAX_ITERATIONS"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    fi
    echo ""

    # Check remaining stories
    incomplete=$(jq '[.stories[] | select(.passes == false)] | length' .ralph/stories.json 2>/dev/null || echo "0")

    if [ "$incomplete" -eq 0 ]; then
        echo "✓ All stories complete!"
        exit 0
    fi

    # Get next story info
    next_story=$(jq -r '[.stories[] | select(.passes == false)] | sort_by(.priority) | .[0] | "\(.id): \(.title)"' .ralph/stories.json 2>/dev/null || echo "Unknown")

    echo "Remaining: $incomplete stories"
    echo "Next: $next_story"
    echo ""

    # Run Claude
    prompt_content=$(cat "$PROMPT_FILE")
    if run_claude "$prompt_content" "Ralph is working on iteration $iter..."; then
        printf "\r✓ Ralph completed iteration $iter\n"
    else
        printf "\r✗ Ralph iteration $iter failed\n"
    fi
    echo ""

    # Check for completion signal
    if echo "$CLAUDE_OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
        echo "╔══════════════════════════════════════════════════════════════╗"
        echo "║ Ralph finished - All stories complete!                      ║"
        echo "╚══════════════════════════════════════════════════════════════╝"
        exit 0
    fi

    ((iter++))
done

echo "Ralph reached max iterations ($MAX_ITERATIONS)"
exit 1
