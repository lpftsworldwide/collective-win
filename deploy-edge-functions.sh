#!/bin/bash

# Deploy COLLECTIVE-WINS Edge Functions to Supabase
# This script deploys demo-spin and claim-bonus functions

set -e

echo "🚀 Deploying COLLECTIVE-WINS Edge Functions..."
echo ""

PROJECT_REF="yiorietrtfosjnpzznnr"
FUNCTIONS=("demo-spin" "claim-bonus")

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Error: Supabase CLI not found. Install with: npm install -g supabase"
    echo ""
    echo "📝 Manual Deployment Instructions:"
    echo "1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/functions"
    echo "2. For each function, click 'Deploy' and upload the index.ts file"
    echo "3. Set secrets: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Use npx if supabase not in PATH
SUPABASE_CMD="supabase"
if ! command -v supabase &> /dev/null; then
    SUPABASE_CMD="npx supabase"
fi

# Try to login/link
echo "📋 Linking to Supabase project..."
$SUPABASE_CMD link --project-ref "$PROJECT_REF" 2>&1 || {
    echo "⚠️  Could not link automatically. You may need to:"
    echo "   1. Run: $SUPABASE_CMD login"
    echo "   2. Then run this script again"
    echo ""
    echo "Or deploy manually via Dashboard:"
    echo "   https://supabase.com/dashboard/project/${PROJECT_REF}/functions"
    exit 1
}

# Deploy each function
for func in "${FUNCTIONS[@]}"; do
    echo ""
    echo "📦 Deploying $func..."
    
    if [ -f "supabase/functions/$func/index.ts" ]; then
        $SUPABASE_CMD functions deploy "$func" 2>&1 || {
            echo "⚠️  Failed to deploy $func"
            echo "   You can deploy manually:"
            echo "   1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/functions"
            echo "   2. Click on $func"
            echo "   3. Copy contents from supabase/functions/$func/index.ts"
            echo "   4. Paste and deploy"
        }
    else
        echo "❌ Function file not found: supabase/functions/$func/index.ts"
    fi
done

echo ""
echo "✅ Edge function deployment complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Set function secrets in Supabase Dashboard:"
echo "   - SUPABASE_URL = https://${PROJECT_REF}.supabase.co"
echo "   - SUPABASE_SERVICE_ROLE_KEY = (from Settings → API)"
echo ""
echo "2. Test functions:"
echo "   - demo-spin: https://${PROJECT_REF}.supabase.co/functions/v1/demo-spin"
echo "   - claim-bonus: https://${PROJECT_REF}.supabase.co/functions/v1/claim-bonus"

