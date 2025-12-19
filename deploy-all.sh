#!/bin/bash

# COLLECTIVE-WINS Complete Deployment Script
# Deploys migrations, edge functions, and frontend to Vercel

set -e

echo "🚀 Starting COLLECTIVE-WINS Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo -e "${RED}Error: Must run from COLLECTIVE-WINS directory${NC}"
    exit 1
fi

# Step 1: Deploy Supabase Migrations
echo -e "${YELLOW}Step 1: Deploying Supabase Migrations...${NC}"
cd supabase

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI not found. Install with: npm install -g supabase${NC}"
    exit 1
fi

# Link to project (if not already linked)
echo "Linking to Supabase project..."
supabase link --project-ref yiorietrtfosjnpzznnr || echo "Project may already be linked"

# Push migrations
echo "Pushing migrations..."
supabase db push || {
    echo -e "${YELLOW}Warning: Migration push failed. You may need to run migrations manually in Supabase Dashboard.${NC}"
}

cd ..

# Step 2: Deploy Edge Functions
echo ""
echo -e "${YELLOW}Step 2: Deploying Edge Functions...${NC}"

# Deploy critical functions
FUNCTIONS=("demo-spin" "claim-bonus")

for func in "${FUNCTIONS[@]}"; do
    echo "Deploying $func..."
    supabase functions deploy "$func" || {
        echo -e "${YELLOW}Warning: Failed to deploy $func. You may need to deploy manually.${NC}"
    }
done

# Step 3: Deploy to Vercel
echo ""
echo -e "${YELLOW}Step 3: Deploying to Vercel...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Install with: npm install -g vercel${NC}"
    echo "You can also deploy via Vercel Dashboard: https://vercel.com/dashboard"
    exit 0
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod --yes || {
    echo -e "${YELLOW}Warning: Vercel deployment failed. You may need to deploy manually.${NC}"
    echo "Visit: https://vercel.com/dashboard"
}

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "Next Steps:"
echo "1. Verify all migrations are applied in Supabase Dashboard"
echo "2. Check edge functions are deployed: supabase functions list"
echo "3. Verify Vercel deployment is live"
echo "4. Test the live site and games"
echo ""
echo "Supabase Dashboard: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr"
echo "Vercel Dashboard: https://vercel.com/dashboard"

