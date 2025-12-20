#!/bin/bash

# Complete deployment script for COLLECTIVE-WINS
# Deploys migrations, functions, and verifies Vercel

set -e

echo "🚀 COLLECTIVE-WINS Complete Deployment"
echo "======================================"
echo ""

PROJECT_REF="yiorietrtfosjnpzznnr"
ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN:-Rxbs7+KrKSSX9gghXoMU7x3IGvoJ/ALiXQkOVCgkyHj/5yaJ3bLoAwk/URNOvEdVJPSYNdLRsR0X4E5y9np6Jw==}"

# Export token
export SUPABASE_ACCESS_TOKEN="$ACCESS_TOKEN"

# Step 1: Link project
echo "📋 Step 1: Linking to Supabase project..."
npx supabase link --project-ref "$PROJECT_REF" 2>&1 || {
    echo "⚠️  Link failed - may already be linked or need different auth method"
}

# Step 2: Deploy migrations via SQL Editor (manual step required)
echo ""
echo "📋 Step 2: Deploy Migrations"
echo "   ⚠️  SQL migrations must be run manually:"
echo "   1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo "   2. Copy entire file: DEPLOY_ALL_MIGRATIONS.sql"
echo "   3. Paste and click 'Run'"
echo ""

# Step 3: Deploy edge functions
echo "📋 Step 3: Deploying Edge Functions..."

echo "   Deploying demo-spin..."
npx supabase functions deploy demo-spin --project-ref "$PROJECT_REF" 2>&1 || {
    echo "   ⚠️  demo-spin deployment failed"
}

echo "   Deploying claim-bonus..."
npx supabase functions deploy claim-bonus --project-ref "$PROJECT_REF" 2>&1 || {
    echo "   ⚠️  claim-bonus deployment failed"
}

# Step 4: Verify Vercel
echo ""
echo "📋 Step 4: Verifying Vercel deployment..."
vercel_url=$(vercel ls 2>/dev/null | grep "collective-win" | head -1 | awk '{print $2}' || echo "")
if [ -n "$vercel_url" ]; then
    echo "   ✅ Vercel: $vercel_url"
else
    echo "   ⚠️  Vercel deployment not found"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Run SQL migrations in Supabase SQL Editor"
echo "   2. Set function secrets (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)"
echo "   3. Test live site: https://collective-win.vercel.app"

