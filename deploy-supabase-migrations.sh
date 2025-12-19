#!/bin/bash

# Deploy Supabase Migrations via REST API
# This script uses the Supabase REST API to execute migrations

set -e

SUPABASE_URL="https://yiorietrtfosjnpzznnr.supabase.co"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set"
    echo "Get it from: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api"
    exit 1
fi

echo "🚀 Deploying Supabase Migrations..."
echo ""

# Function to execute SQL via REST API
execute_sql() {
    local sql_file=$1
    local sql_content=$(cat "$sql_file")
    
    echo "Executing: $(basename $sql_file)"
    
    # Use Supabase REST API to execute SQL
    response=$(curl -s -X POST \
        "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
        -H "apikey: ${SERVICE_ROLE_KEY}" \
        -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -d "{\"query\": $(echo "$sql_content" | jq -Rs .)}" 2>&1) || {
        echo "Note: Direct API execution may not work. Please run migrations manually in SQL Editor."
        return 1
    }
    
    echo "✅ Migration executed"
}

# Execute each migration
cd supabase/migrations

for migration in 20251220092638_populate_custom_games.sql \
                 20251220092639_add_admin_users.sql \
                 20251220092640_add_bonus_system.sql \
                 20251220092641_add_provably_fair.sql \
                 20251220092642_add_user_tiers.sql \
                 20251220092643_add_rate_limiting.sql; do
    if [ -f "$migration" ]; then
        execute_sql "$migration" || echo "⚠️  Migration $migration needs manual execution"
    fi
done

echo ""
echo "✅ Migration deployment complete!"
echo ""
echo "If migrations failed via API, please run them manually:"
echo "1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new"
echo "2. Copy and paste each migration SQL"
echo "3. Click 'Run'"

