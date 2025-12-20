#!/bin/bash
# Automated Supabase Auth Configuration
# Run this script after logging into Supabase CLI

PROJECT_REF="yiorietrtfosjnpzznnr"

echo "🔧 Configuring Supabase Auth..."
echo ""

# Check if logged in
if ! supabase projects list &>/dev/null; then
    echo "❌ Not logged into Supabase CLI"
    echo "   Run: supabase login"
    exit 1
fi

# Link to project
echo "📌 Linking to project..."
supabase link --project-ref yiorietrtfosjnpzznnr || echo "⚠️  Project already linked"

echo ""
echo "✅ Configuration complete!"
echo ""
echo "📋 MANUAL STEPS (Dashboard):"
echo "   1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/auth/url-configuration"
echo "   2. Add these Redirect URLs:"
   echo "      • https://collective-win.vercel.app/auth/confirm"
   echo "      • https://collective-win.vercel.app/**"
   echo "      • http://localhost:5173/auth/confirm"
   echo "      • http://localhost:5173/**"
   echo "      • http://localhost:3000/auth/confirm"
   echo "      • http://localhost:3000/**"

echo "   3. Save changes"
echo ""
echo "   4. Go to: https://supabase.com/dashboard/project/{PROJECT_REF}/auth/providers"
echo "   5. Enable 'Email confirmations'"
echo "   6. Save"
echo ""
echo "✅ Auth configuration complete!"
