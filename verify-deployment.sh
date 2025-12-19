#!/bin/bash

# Verify COLLECTIVE-WINS Deployment
# Checks if migrations, functions, and Vercel are deployed

set -e

echo "🔍 Verifying COLLECTIVE-WINS Deployment..."
echo ""

SUPABASE_URL="https://yiorietrtfosjnpzznnr.supabase.co"
PUBLISHABLE_KEY="sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ"

# Check if games are in database
echo "1. Checking if games are populated..."
games_count=$(curl -s "${SUPABASE_URL}/rest/v1/licensed_games?select=count" \
  -H "apikey: ${PUBLISHABLE_KEY}" \
  -H "Prefer: count=exact" | grep -o '"count":[0-9]*' | cut -d: -f2 || echo "0")

if [ "$games_count" -gt "0" ]; then
  echo "✅ Games found: $games_count"
else
  echo "⚠️  No games found - migrations may not be deployed"
fi

# Check if tables exist
echo ""
echo "2. Checking if tables exist..."
tables=("admin_users" "user_bonuses" "user_tiers" "rate_limit_logs" "provably_fair_verification")

for table in "${tables[@]}"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" \
    "${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1" \
    -H "apikey: ${PUBLISHABLE_KEY}" 2>/dev/null || echo "000")
  
  if [ "$response" = "200" ] || [ "$response" = "406" ]; then
    echo "✅ Table $table exists"
  else
    echo "⚠️  Table $table may not exist (HTTP $response)"
  fi
done

# Check Vercel deployment
echo ""
echo "3. Checking Vercel deployment..."
vercel_url=$(vercel ls 2>/dev/null | grep "collective-win" | head -1 | awk '{print $2}' || echo "")

if [ -n "$vercel_url" ]; then
  echo "✅ Vercel deployment found: $vercel_url"
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$vercel_url" 2>/dev/null || echo "000")
  if [ "$http_code" = "200" ] || [ "$http_code" = "401" ]; then
    echo "✅ Site is accessible (HTTP $http_code)"
  else
    echo "⚠️  Site returned HTTP $http_code"
  fi
else
  echo "⚠️  Could not find Vercel deployment"
fi

# Check edge functions
echo ""
echo "4. Checking edge functions..."
functions=("demo-spin" "claim-bonus")

for func in "${functions[@]}"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" \
    "${SUPABASE_URL}/functions/v1/${func}" \
    -X POST \
    -H "Authorization: Bearer ${PUBLISHABLE_KEY}" \
    -H "Content-Type: application/json" \
    -d '{}' 2>/dev/null || echo "000")
  
  if [ "$response" = "401" ] || [ "$response" = "400" ]; then
    echo "✅ Function $func is deployed (HTTP $response - expected for missing auth/params)"
  elif [ "$response" = "404" ]; then
    echo "⚠️  Function $func not found (HTTP 404)"
  else
    echo "⚠️  Function $func returned HTTP $response"
  fi
done

echo ""
echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. If migrations failed, run DEPLOY_ALL_MIGRATIONS.sql in Supabase SQL Editor"
echo "2. If functions failed, deploy them via Supabase Dashboard"
echo "3. Test the live site: https://collective-win.vercel.app"

