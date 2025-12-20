#!/bin/bash

# =============================================================================
# DEPLOY ONBOARDING FUNCTION
# =============================================================================
# Deploys the process-onboarding edge function to Supabase
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_REF="yiorietrtfosjnpzznnr"
FUNCTION_NAME="process-onboarding"

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

print_header "DEPLOY ONBOARDING FUNCTION"

# Check if function file exists
if [ ! -f "${PROJECT_DIR}/supabase/functions/${FUNCTION_NAME}/index.ts" ]; then
    print_error "Function file not found: supabase/functions/${FUNCTION_NAME}/index.ts"
    exit 1
fi

print_success "Function file found"

# Check for access token
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    print_warning "SUPABASE_ACCESS_TOKEN not set"
    echo ""
    echo "To get your access token:"
    echo "  1. Go to: https://supabase.com/dashboard/account/tokens"
    echo "  2. Click 'Generate new token'"
    echo "  3. Copy the token (starts with 'sbp_')"
    echo ""
    read -p "Enter your Supabase access token (sbp_...): " ACCESS_TOKEN
    
    if [ -z "$ACCESS_TOKEN" ]; then
        print_error "Access token is required"
        exit 1
    fi
    
    export SUPABASE_ACCESS_TOKEN="$ACCESS_TOKEN"
    print_success "Access token set"
else
    print_success "Using SUPABASE_ACCESS_TOKEN from environment"
fi

# Try to deploy via CLI
print_step "Deploying function via Supabase CLI..."

if npx supabase functions deploy "${FUNCTION_NAME}" \
    --project-ref "${PROJECT_REF}" \
    --no-verify-jwt 2>&1; then
    print_success "Function deployed successfully via CLI!"
    exit 0
fi

# If CLI fails, provide manual instructions
print_warning "CLI deployment failed. Use manual deployment:"
echo ""
echo "OPTION 1: Deploy via Supabase Dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Go to: https://supabase.com/dashboard/project/${PROJECT_REF}/functions"
echo "2. Click 'Create Function' or 'New Function'"
echo "3. Name: ${FUNCTION_NAME}"
echo "4. Copy contents from: ${PROJECT_DIR}/supabase/functions/${FUNCTION_NAME}/index.ts"
echo "5. Paste into the editor"
echo "6. Click 'Deploy'"
echo ""

echo "OPTION 2: Deploy via Management API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Run this Python script:"
echo "  python3 deploy-onboarding-via-api.py"
echo ""

echo "OPTION 3: Try CLI again with debug"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  npx supabase functions deploy ${FUNCTION_NAME} \\"
echo "    --project-ref ${PROJECT_REF} \\"
echo "    --debug"
echo ""

exit 1

