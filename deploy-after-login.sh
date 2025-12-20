#!/bin/bash
# Deploy after Supabase login is complete

echo "🚀 Deploying COLLECTIVE-WINS..."
echo ""

# Link project
echo "📋 Linking project..."
npx supabase link --project-ref yiorietrtfosjnpzznnr || {
    echo "⚠️  Link failed - may already be linked"
}

# Deploy functions
echo ""
echo "📦 Deploying edge functions..."

echo "  Deploying: spin"
npx supabase functions deploy spin --project-ref yiorietrtfosjnpzznnr || {
    echo "  ⚠️  Failed to deploy spin"
}

echo "  Deploying: claim-bonus"
npx supabase functions deploy claim-bonus --project-ref yiorietrtfosjnpzznnr || {
    echo "  ⚠️  Failed to deploy claim-bonus"
}

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next: Deploy SQL migrations via SQL Editor"
echo "   https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new"
