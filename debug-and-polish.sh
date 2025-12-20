#!/bin/bash

# =============================================================================
# DEBUG AND POLISH - COLLECTIVE-WINS
# =============================================================================
# Comprehensive debugging and polishing script
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpb3JpZXRydGZvc2pucHp6bm5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMzOTI4OCwiZXhwIjoyMDcyOTE1Mjg4fQ.-qK8eeCrh-wV5FvwGS92zJ3xf11MWJf-v0kL_k3BiR4"
SUPABASE_URL="https://yiorietrtfosjnpzznnr.supabase.co"

print_header() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# =============================================================================
# STEP 1: CHECK DATABASE
# =============================================================================

print_header "STEP 1: DATABASE VERIFICATION"

print_step "Checking games table..."
GAMES_COUNT=$(curl -s "${SUPABASE_URL}/rest/v1/licensed_games?select=count" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Prefer: count=exact" 2>/dev/null | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['count'] if isinstance(data, list) and len(data) > 0 else '0')" 2>/dev/null || echo "0")

if [ "$GAMES_COUNT" != "0" ] && [ -n "$GAMES_COUNT" ]; then
    print_success "Games table exists with $GAMES_COUNT games"
else
    print_error "Games table empty or doesn't exist"
    echo "   Run: REAL_MONEY_COMPLETE_MIGRATION.sql"
fi

print_step "Checking thumbnail_url column..."
THUMBNAIL_CHECK=$(curl -s "${SUPABASE_URL}/rest/v1/licensed_games?select=thumbnail_url&limit=1" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" 2>/dev/null | python3 -c "import sys, json; data=json.load(sys.stdin); print('exists' if isinstance(data, list) and len(data) > 0 and 'thumbnail_url' in data[0] else 'missing')" 2>/dev/null || echo "missing")

if [ "$THUMBNAIL_CHECK" = "exists" ]; then
    print_success "thumbnail_url column exists"
    
    # Check how many have thumbnails
    WITH_THUMBS=$(curl -s "${SUPABASE_URL}/rest/v1/licensed_games?select=game_code&thumbnail_url=not.is.null" \
      -H "apikey: ${SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
      -H "Prefer: count=exact" 2>/dev/null | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data) if isinstance(data, list) else 0)" 2>/dev/null || echo "0")
    
    if [ "$WITH_THUMBS" != "0" ]; then
        print_success "$WITH_THUMBS games have thumbnails set"
    else
        print_warning "No games have thumbnails set - run UPDATE_GAME_THUMBNAILS.sql"
    fi
else
    print_error "thumbnail_url column missing"
    echo "   Run: ADD_THUMBNAIL_COLUMN.sql"
fi

# =============================================================================
# STEP 2: CHECK EDGE FUNCTIONS
# =============================================================================

print_header "STEP 2: EDGE FUNCTION VERIFICATION"

print_step "Testing spin function..."
SPIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "${SUPABASE_URL}/functions/v1/spin" \
  -H "Content-Type: application/json" \
  -d '{}' 2>/dev/null || echo "000")

if [ "$SPIN_RESPONSE" = "401" ] || [ "$SPIN_RESPONSE" = "400" ]; then
    print_success "spin function is responding (HTTP $SPIN_RESPONSE - needs auth, which is correct)"
elif [ "$SPIN_RESPONSE" = "404" ]; then
    print_error "spin function not found (404)"
else
    print_warning "spin function returned HTTP $SPIN_RESPONSE"
fi

print_step "Testing claim-bonus function..."
BONUS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "${SUPABASE_URL}/functions/v1/claim-bonus" \
  -H "Content-Type: application/json" \
  -d '{}' 2>/dev/null || echo "000")

if [ "$BONUS_RESPONSE" = "401" ] || [ "$BONUS_RESPONSE" = "400" ]; then
    print_success "claim-bonus function is responding (HTTP $BONUS_RESPONSE - needs auth, which is correct)"
elif [ "$BONUS_RESPONSE" = "404" ]; then
    print_error "claim-bonus function not found (404)"
else
    print_warning "claim-bonus function returned HTTP $BONUS_RESPONSE"
fi

# =============================================================================
# STEP 3: CHECK FRONTEND ISSUES
# =============================================================================

print_header "STEP 3: FRONTEND CODE CHECKS"

print_step "Checking for broken imports..."
if grep -r "DemoBanner" "${PROJECT_DIR}/src" --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "// Removed" | grep -v "Removed DemoBanner"; then
    print_error "DemoBanner still referenced in code"
else
    print_success "No DemoBanner references found"
fi

print_step "Checking for demo-spin references..."
if grep -r "demo-spin" "${PROJECT_DIR}/src" --include="*.tsx" --include="*.ts" 2>/dev/null; then
    print_error "demo-spin still referenced - should be 'spin'"
else
    print_success "No demo-spin references found"
fi

print_step "Checking auth routes..."
if grep -q "EmailConfirm" "${PROJECT_DIR}/src/App.tsx" 2>/dev/null; then
    print_success "Email confirmation route exists"
else
    print_error "Email confirmation route missing"
fi

# =============================================================================
# STEP 4: SUMMARY
# =============================================================================

print_header "DEBUG SUMMARY"

echo "✅ Fixed Issues:"
echo "   - Added EmailConfirm page for email confirmation redirect"
echo "   - Fixed signup flow to handle email confirmation"
echo "   - Updated auth context to handle email confirmation"
echo "   - Fixed CORS in claim-bonus function"
echo ""

echo "📋 Remaining Manual Steps:"
echo "   1. Add thumbnail_url column (if missing):"
echo "      ALTER TABLE public.licensed_games ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;"
echo ""
echo "   2. Update thumbnails (if column exists):"
echo "      Run: python3 fix-everything-now.py"
echo "      OR: UPDATE_GAME_THUMBNAILS.sql"
echo ""

echo "🧪 Test Checklist:"
echo "   [ ] Sign up with new email"
echo "   [ ] Check email for confirmation link"
echo "   [ ] Click confirmation link"
echo "   [ ] Should redirect to /auth/confirm"
echo "   [ ] Should auto-claim $111 bonus"
echo "   [ ] Should redirect to home page"
echo "   [ ] Landing page shows games with images"
echo "   [ ] Can click and play a game"
echo "   [ ] Spin function works"
echo ""

echo "🚀 Ready to test!"
echo "   Site: https://collective-win.vercel.app"
echo ""

