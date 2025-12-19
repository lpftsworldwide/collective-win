#!/bin/bash

# Verify COLLECTIVE-WINS Live Deployment
# Checks if everything is deployed and working

set -e

echo "🔍 Verifying COLLECTIVE-WINS Live Deployment..."
echo ""

SUPABASE_URL="https://yiorietrtfosjnpzznnr.supabase.co"
PUBLISHABLE_KEY="sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ"
VERCEL_URL="https://collective-win.vercel.app"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check 1: Games in database
echo "1️⃣  Checking if games are populated..."
games_response=$(curl -s "${SUPABASE_URL}/rest/v1/licensed_games?select=id&limit=1" \
  -H "apikey: ${PUBLISHABLE_KEY}" \
  -H "Prefer: count=exact" 2>/dev/null || echo "")

if echo "$games_response" | grep -q "id"; then
  echo -e "${GREEN}✅ Games table accessible${NC}"
else
  echo -e "${YELLOW}⚠️  Games may not be populated - run DEPLOY_ALL_MIGRATIONS.sql${NC}"
fi

# Check 2: Edge Functions
echo ""
echo "2️⃣  Checking edge functions..."

for func in "demo-spin" "claim-bonus"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" \
    "${SUPABASE_URL}/functions/v1/${func}" \
    -X POST \
    -H "Authorization: Bearer ${PUBLISHABLE_KEY}" \
    -H "Content-Type: application/json" \
    -d '{}' 2>/dev/null || echo "000")
  
  if [ "$response" = "401" ] || [ "$response" = "400" ]; then
    echo -e "${GREEN}✅ Function ${func} is deployed (HTTP ${response})${NC}"
  elif [ "$response" = "404" ]; then
    echo -e "${RED}❌ Function ${func} not found (HTTP 404)${NC}"
  else
    echo -e "${YELLOW}⚠️  Function ${func} returned HTTP ${response}${NC}"
  fi
done

# Check 3: Vercel deployment
echo ""
echo "3️⃣  Checking Vercel deployment..."
vercel_response=$(curl -s -o /dev/null -w "%{http_code}" "${VERCEL_URL}" 2>/dev/null || echo "000")

if [ "$vercel_response" = "200" ] || [ "$vercel_response" = "401" ]; then
  echo -e "${GREEN}✅ Vercel site is accessible (HTTP ${vercel_response})${NC}"
  echo "   URL: ${VERCEL_URL}"
else
  echo -e "${YELLOW}⚠️  Vercel site returned HTTP ${vercel_response}${NC}"
fi

# Check 4: Database tables
echo ""
echo "4️⃣  Checking database tables..."
tables=("admin_users" "user_bonuses" "user_tiers" "rate_limit_logs")

for table in "${tables[@]}"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" \
    "${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1" \
    -H "apikey: ${PUBLISHABLE_KEY}" 2>/dev/null || echo "000")
  
  if [ "$response" = "200" ] || [ "$response" = "406" ]; then
    echo -e "${GREEN}✅ Table ${table} exists${NC}"
  else
    echo -e "${YELLOW}⚠️  Table ${table} may not exist (HTTP ${response})${NC}"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Verification complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. If migrations failed, run DEPLOY_ALL_MIGRATIONS.sql"
echo "   2. If functions failed, deploy via Supabase Dashboard"
echo "   3. Test live site: ${VERCEL_URL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

