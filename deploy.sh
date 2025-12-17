#!/bin/bash
# Quick Vercel Deployment Script for COLLECTIVE-WINS

set -e

echo "🚀 Deploying COLLECTIVE-WINS to Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Project directory: $(pwd)"
echo ""

# Check if already linked
if [ -d ".vercel" ]; then
    echo "✅ Project already linked to Vercel"
    echo "🚀 Deploying to production..."
    vercel --prod
else
    echo "🔗 Linking project to Vercel..."
    echo "   (Follow the prompts to set up your project)"
    vercel
    
    echo ""
    echo "✅ Project linked! Now deploying to production..."
    vercel --prod
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Set environment variables in Vercel Dashboard:"
echo "      - VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co"
echo "      - VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ"
echo ""
echo "   2. Redeploy after setting environment variables:"
echo "      vercel --prod"
echo ""

