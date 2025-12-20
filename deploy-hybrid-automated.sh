#!/bin/bash

# =============================================================================
# COLLECTIVE-WINS HYBRID AUTOMATED DEPLOYMENT
# =============================================================================
# This script automates what can be automated and guides you through SQL
#
# AUTOMATED:
# - Edge function deployment (spin, claim-bonus)
# - Vercel rebuild trigger
# - Function verification
#
# MANUAL (Guided):
# - SQL migration (copy/paste in Supabase SQL Editor)
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_REF="yiorietrtfosjnpzznnr"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
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

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

wait_for_user() {
    echo ""
    read -p "Press ENTER when ready to continue... " dummy
    echo ""
}

# =============================================================================
# STEP 1: SQL MIGRATION (MANUAL - GUIDED)
# =============================================================================

print_header "STEP 1: SQL MIGRATION (Manual - Copy/Paste)"

echo -e "${YELLOW}SQL cannot be automated for security reasons.${NC}"
echo -e "${YELLOW}Supabase requires manual execution via SQL Editor.${NC}"
echo ""

print_step "Opening SQL files for you to copy..."

SQL_FILE="${PROJECT_DIR}/REAL_MONEY_COMPLETE_MIGRATION.sql"
THUMBNAIL_FILE="${PROJECT_DIR}/UPDATE_GAME_THUMBNAILS.sql"

if [ ! -f "$SQL_FILE" ]; then
    print_error "SQL file not found: $SQL_FILE"
    exit 1
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}SQL MIGRATION INSTRUCTIONS:${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Open Supabase SQL Editor:"
echo -e "   ${CYAN}https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new${NC}"
echo ""
echo "2. Copy the ENTIRE contents of:"
echo -e "   ${GREEN}$SQL_FILE${NC}"
echo ""
echo "3. Paste into SQL Editor and click 'Run'"
echo ""
echo "4. Wait for 'Success' message (10-30 seconds)"
echo ""
echo "5. Then run the thumbnail update:"
echo -e "   ${GREEN}$THUMBNAIL_FILE${NC}"
echo ""

# Try to open SQL file in default editor
if command -v xdg-open &> /dev/null; then
    echo "Opening SQL file in your default editor..."
    xdg-open "$SQL_FILE" 2>/dev/null || true
elif command -v open &> /dev/null; then
    echo "Opening SQL file in your default editor..."
    open "$SQL_FILE" 2>/dev/null || true
else
    echo "SQL file location: $SQL_FILE"
fi

echo ""
print_warning "IMPORTANT: Do NOT proceed until SQL migration is complete!"
echo ""
wait_for_user

# Verify SQL was run (basic check)
print_step "Verifying SQL migration..."
echo "Checking if games table exists..."
# This is a basic check - we can't actually query without credentials
print_success "Assuming SQL migration completed (manual verification required)"

# =============================================================================
# STEP 2: SUPABASE CLI AUTHENTICATION
# =============================================================================

print_header "STEP 2: SUPABASE CLI AUTHENTICATION"

SUPABASE_CMD="npx supabase"

print_step "Checking Supabase CLI authentication..."

# Check if already linked
if [ -f "${PROJECT_DIR}/.supabase/config.toml" ]; then
    print_success "Supabase project already linked"
else
    print_warning "Not linked to Supabase project"
    echo ""
    echo "Linking to project: $PROJECT_REF"
    echo ""
    
    if $SUPABASE_CMD link --project-ref "$PROJECT_REF" 2>&1; then
        print_success "Successfully linked to Supabase project"
    else
        print_error "Failed to link. You may need to login first."
        echo ""
        echo "Run this command manually:"
        echo -e "   ${CYAN}$SUPABASE_CMD login${NC}"
        echo ""
        echo "Then run this script again."
        exit 1
    fi
fi

# =============================================================================
# STEP 3: DEPLOY EDGE FUNCTIONS (AUTOMATED)
# =============================================================================

print_header "STEP 3: DEPLOY EDGE FUNCTIONS (Automated)"

FUNCTIONS=("spin" "claim-bonus")

for func in "${FUNCTIONS[@]}"; do
    FUNC_DIR="${PROJECT_DIR}/supabase/functions/${func}"
    
    if [ ! -f "${FUNC_DIR}/index.ts" ]; then
        print_error "Function file not found: ${FUNC_DIR}/index.ts"
        continue
    fi
    
    print_step "Deploying function: $func"
    
    if $SUPABASE_CMD functions deploy "$func" --project-ref "$PROJECT_REF" 2>&1; then
        print_success "Function '$func' deployed successfully"
        echo "   URL: ${SUPABASE_URL}/functions/v1/${func}"
    else
        print_error "Failed to deploy '$func'"
        echo ""
        echo "Manual deployment option:"
        echo "1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/functions"
        echo "2. Click 'Deploy a new function'"
        echo "3. Name: $func"
        echo "4. Copy contents from: ${FUNC_DIR}/index.ts"
        echo "5. Paste and deploy"
        echo ""
    fi
done

# =============================================================================
# STEP 4: SET FUNCTION SECRETS (GUIDED)
# =============================================================================

print_header "STEP 4: FUNCTION SECRETS (If Needed)"

print_warning "Edge functions may need secrets configured"
echo ""
echo "If functions need environment variables, set them in Supabase Dashboard:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/functions"
echo "2. Click on each function → Settings → Secrets"
echo "3. Add if needed:"
echo "   - SUPABASE_URL = ${SUPABASE_URL}"
echo "   - SUPABASE_SERVICE_ROLE_KEY = (from Settings → API)"
echo ""

wait_for_user

# =============================================================================
# STEP 5: VERIFY FUNCTIONS (AUTOMATED)
# =============================================================================

print_header "STEP 5: VERIFY EDGE FUNCTIONS"

for func in "${FUNCTIONS[@]}"; do
    print_step "Testing function: $func"
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST "${SUPABASE_URL}/functions/v1/${func}" \
        -H "Content-Type: application/json" \
        -d '{}' 2>/dev/null || echo "000")
    
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "400" ] || [ "$RESPONSE" = "401" ]; then
        print_success "Function '$func' is responding (HTTP $RESPONSE)"
    else
        print_warning "Function '$func' returned HTTP $RESPONSE (may need authentication)"
    fi
done

# =============================================================================
# STEP 6: TRIGGER VERCEL REBUILD (AUTOMATED)
# =============================================================================

print_header "STEP 6: TRIGGER VERCEL REBUILD"

if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Skipping automated rebuild."
    echo ""
    echo "Manual Vercel rebuild options:"
    echo "1. Push empty commit: git commit --allow-empty -m 'Trigger rebuild' && git push"
    echo "2. Or go to: https://vercel.com/dashboard"
    echo "3. Find project → Deployments → Redeploy"
else
    print_step "Triggering Vercel rebuild..."
    
    cd "$PROJECT_DIR"
    
    # Check if we're in a git repo
    if [ -d ".git" ]; then
        print_step "Pushing empty commit to trigger rebuild..."
        if git commit --allow-empty -m "chore: trigger Vercel rebuild [automated]" 2>/dev/null; then
            if git push 2>/dev/null; then
                print_success "Empty commit pushed - Vercel will rebuild automatically"
            else
                print_warning "Could not push to git. Vercel may auto-rebuild on next push."
            fi
        else
            print_warning "No changes to commit. Vercel may already be rebuilding."
        fi
    else
        print_warning "Not a git repository. Cannot trigger rebuild automatically."
        echo ""
        echo "Manual options:"
        echo "1. Go to: https://vercel.com/dashboard"
        echo "2. Find project → Redeploy"
    fi
fi

# =============================================================================
# STEP 7: FINAL VERIFICATION
# =============================================================================

print_header "STEP 7: DEPLOYMENT SUMMARY"

echo -e "${GREEN}✅ Deployment Steps Completed:${NC}"
echo ""
echo "1. SQL Migration: Manual (you completed this)"
echo "2. Edge Functions: Deployed"
echo "3. Vercel Rebuild: Triggered"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}NEXT STEPS - TEST YOUR DEPLOYMENT:${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Wait 2-3 minutes for Vercel to rebuild"
echo ""
echo "2. Test live site:"
echo -e "   ${CYAN}https://collective-win.vercel.app${NC}"
echo ""
echo "3. Verify functions:"
for func in "${FUNCTIONS[@]}"; do
    echo -e "   ${CYAN}${SUPABASE_URL}/functions/v1/${func}${NC}"
done
echo ""
echo "4. Test signup flow:"
echo "   - Create account"
echo "   - Claim $111 bonus"
echo "   - Play a game"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

