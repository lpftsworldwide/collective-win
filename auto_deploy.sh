#!/bin/bash
# Fully automated: Create repo, push, deploy

set -e

REPO_NAME="collective-wins"

echo "🚀 COLLECTIVE-WINS - Automated Deploy"
echo "====================================="
echo ""

cd "$(dirname "$0")"

# Get GitHub username
echo "📝 Enter your GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username required!"
    exit 1
fi

REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Try to create repo via GitHub API (optional token)
echo ""
echo "🔨 Creating GitHub repository..."
echo "   (If this fails, you'll be guided to create it manually)"

# Check if repo exists
if git ls-remote "${REPO_URL}" &>/dev/null; then
    echo "✅ Repository already exists!"
else
    echo "📝 Repository doesn't exist yet."
    echo ""
    echo "   Please create it at: https://github.com/new"
    echo "   - Name: ${REPO_NAME}"
    echo "   - DO NOT initialize with README/gitignore"
    echo ""
    echo "⏳ Press Enter when created..."
    read -r
fi

# Add remote and push
echo ""
echo "🔗 Setting up remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "${REPO_URL}"

echo "📤 Pushing to GitHub..."
git push -u origin master

echo ""
echo "✅ Pushed to GitHub: ${REPO_URL}"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""

if ! command -v vercel &> /dev/null; then
    echo "⚠️  Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy
if [ -d ".vercel" ]; then
    echo "✅ Already linked, deploying to production..."
    vercel --prod --yes
else
    echo "🔗 Linking to Vercel (first time)..."
    vercel --yes
    
    echo ""
    echo "🚀 Deploying to production..."
    vercel --prod --yes
fi

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "📝 Next: Add environment variables in Vercel Dashboard:"
echo "   - VITE_SUPABASE_URL = https://yiorietrtfosjnpzznnr.supabase.co"
echo "   - VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ"
echo ""
echo "   Then redeploy: vercel --prod"
echo ""

