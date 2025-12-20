#!/bin/bash
echo "🔑 Supabase Access Token Required"
echo ""
echo "⚠️  IMPORTANT: This is NOT the verification code!"
echo "   The access token starts with 'sbp_' and is much longer"
echo ""
echo "Get it from: https://supabase.com/dashboard/account/tokens"
echo "   Click 'Generate new token' if you don't have one"
echo ""
echo "Token format: sbp_0102030405060708091011121314151617181920..."
echo ""
read -p "Enter Supabase Access Token (starts with sbp_): " TOKEN

if [ -z "$TOKEN" ]; then
    echo "❌ Token cannot be empty!"
    exit 1
fi

export SUPABASE_ACCESS_TOKEN="$TOKEN"

echo ""
echo "🚀 Deploying functions..."
echo ""

echo "📦 Deploying: spin"
npx supabase functions deploy spin --project-ref yiorietrtfosjnpzznnr || {
    echo "  ⚠️  Failed to deploy spin"
}

echo ""
echo "📦 Deploying: claim-bonus"
npx supabase functions deploy claim-bonus --project-ref yiorietrtfosjnpzznnr || {
    echo "  ⚠️  Failed to deploy claim-bonus"
}

echo ""
echo "✅ Deployment complete!"
