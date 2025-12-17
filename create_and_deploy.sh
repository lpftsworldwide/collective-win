#!/bin/bash
# Complete setup: Create GitHub repo, push, and deploy to Vercel

set -e

REPO_NAME="collective-wins"
GITHUB_USERNAME=""  # Will prompt if not set
GITHUB_TOKEN=""     # Optional - for API creation

echo "🚀 COLLECTIVE-WINS - Complete Setup Script"
echo "=========================================="
echo ""

cd "$(dirname "$0")"

# Step 1: Get GitHub username
if [ -z "$GITHUB_USERNAME" ]; then
    echo "📝 Enter your GitHub username:"
    read -r GITHUB_USERNAME
fi

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username required!"
    exit 1
fi

REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo ""
echo "📦 Repository will be: ${REPO_URL}"
echo ""

# Step 2: Create GitHub repository
echo "🔨 Step 1: Creating GitHub repository..."
echo ""

# Check if GitHub CLI is available
if command -v gh &> /dev/null; then
    echo "✅ Using GitHub CLI..."
    gh repo create "${REPO_NAME}" --public --source=. --remote=origin --push 2>&1 || {
        echo "⚠️  GitHub CLI failed, trying manual method..."
        # Remove if it partially created
        git remote remove origin 2>/dev/null || true
    }
else
    echo "📝 GitHub CLI not found. Please create the repository manually:"
    echo ""
    echo "   1. Go to: https://github.com/new"
    echo "   2. Repository name: ${REPO_NAME}"
    echo "   3. Description: COLLECTIVE-WINS Casino Platform"
    echo "   4. Visibility: Public (or Private)"
    echo "   5. DO NOT initialize with README, .gitignore, or license"
    echo "   6. Click 'Create repository'"
    echo ""
    echo "⏳ Press Enter when the repository is created..."
    read -r
    
    # Add remote and push
    echo "🔗 Adding remote..."
    git remote add origin "${REPO_URL}" 2>/dev/null || git remote set-url origin "${REPO_URL}"
    
    echo "📤 Pushing to GitHub..."
    git push -u origin master
fi

echo ""
echo "✅ Code pushed to GitHub!"
echo ""

# Step 3: Deploy to Vercel
echo "🚀 Step 2: Deploying to Vercel..."
echo ""

if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if already linked
if [ -d ".vercel" ]; then
    echo "✅ Project already linked to Vercel"
    echo "🚀 Deploying to production..."
    vercel --prod --yes
else
    echo "🔗 Linking project to Vercel..."
    echo "   (This will open a browser for authentication)"
    vercel --yes
    
    echo ""
    echo "🚀 Deploying to production..."
    vercel --prod --yes
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 IMPORTANT: Set Environment Variables in Vercel Dashboard"
echo "   1. Go to: https://vercel.com/dashboard"
echo "   2. Select your project: ${REPO_NAME}"
echo "   3. Settings → Environment Variables"
echo "   4. Add:"
echo "      - VITE_SUPABASE_URL = https://yiorietrtfosjnpzznnr.supabase.co"
echo "      - VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ"
echo "   5. Redeploy: vercel --prod"
echo ""
echo "🌐 Your site will be live at: https://${REPO_NAME}.vercel.app"
echo ""

