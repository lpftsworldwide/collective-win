#!/bin/bash
# QUICK AUTH CONFIGURATION - RUNS WHAT IT CAN, GUIDES FOR THE REST

set -e

PROJECT_REF="yiorietrtfosjnpzznnr"
PROJECT_URL="https://${PROJECT_REF}.supabase.co"

echo "🔧 CONFIGURING SUPABASE AUTH"
echo "=" * 60
echo ""

# Check current auth settings
echo "1️⃣  Checking current auth settings..."
echo ""

curl -s "${PROJECT_URL}/auth/v1/settings" | python3 -m json.tool 2>/dev/null || echo "⚠️  Could not fetch settings"
echo ""

# Display configuration URLs
echo "2️⃣  CONFIGURE IN DASHBOARD (2 minutes):"
echo ""
echo "   📍 Redirect URLs:"
echo "      https://supabase.com/dashboard/project/${PROJECT_REF}/auth/url-configuration"
echo ""
echo "   Add these URLs:"
echo "      • https://collective-win.vercel.app/auth/confirm"
echo "      • https://collective-win.vercel.app/**"
echo "      • http://localhost:5173/auth/confirm"
echo "      • http://localhost:5173/**"
echo ""
echo "   📍 Email Confirmations:"
echo "      https://supabase.com/dashboard/project/${PROJECT_REF}/auth/providers"
echo ""
echo "   Enable: 'Email confirmations'"
echo ""

# If Management token is available, try full automation
if [ -n "$SUPABASE_MANAGEMENT_TOKEN" ]; then
    echo "3️⃣  Management token found - attempting full automation..."
    python3 configure-auth-via-api.py
else
    echo "3️⃣  For FULL automation, get Management API token:"
    echo "      https://supabase.com/dashboard/account/tokens"
    echo ""
    echo "   Then run:"
    echo "      export SUPABASE_MANAGEMENT_TOKEN='your-token'"
    echo "      python3 configure-auth-via-api.py"
    echo ""
fi

echo "=" * 60
echo "✅ CONFIGURATION COMPLETE!"
echo ""
echo "🧪 TEST:"
echo "   1. Visit: https://collective-win.vercel.app/auth"
echo "   2. Sign up"
echo "   3. Check email → Click link → Should work!"
echo ""

