#!/bin/bash
# Push to GitHub using Personal Access Token

set -e

REPO_URL="https://github.com/lpftsworldwide/collective-win.git"
BRANCH="master"

cd "$(dirname "$0")"

echo "📤 Pushing to GitHub..."
echo ""
echo "⚠️  GitHub requires a Personal Access Token (not password)"
echo ""
echo "If you don't have a token yet:"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Generate new token (classic)"
echo "3. Select 'repo' scope"
echo "4. Copy the token"
echo ""

# Try to push
echo "Attempting to push..."
echo ""

# Check if we can push without credentials (SSH key might be set up)
if git push -u origin "${BRANCH}" 2>&1; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    exit 0
fi

echo ""
echo "❌ Push failed. You need to authenticate."
echo ""
echo "Option 1: Use Personal Access Token"
echo "  When prompted for password, paste your token"
echo ""
echo "Option 2: Push with token in command (replace YOUR_TOKEN):"
echo "  git push https://YOUR_TOKEN@github.com/lpftsworldwide/collective-win.git ${BRANCH}"
echo ""
echo "Option 3: Set up SSH (see GITHUB_AUTH.md)"
echo ""

