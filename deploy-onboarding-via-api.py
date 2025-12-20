#!/usr/bin/env python3
"""
Deploy process-onboarding edge function via Supabase Management API
"""

import os
import sys
import requests
import json
from pathlib import Path

PROJECT_REF = "yiorietrtfosjnpzznnr"
FUNCTION_NAME = "process-onboarding"
FUNCTION_FILE = Path(__file__).parent / "supabase" / "functions" / FUNCTION_NAME / "index.ts"

def get_access_token():
    """Get Supabase access token from environment or prompt"""
    token = os.environ.get("SUPABASE_ACCESS_TOKEN")
    
    if not token:
        print("⚠️  SUPABASE_ACCESS_TOKEN not found in environment")
        print("\nTo get your access token:")
        print("  1. Go to: https://supabase.com/dashboard/account/tokens")
        print("  2. Click 'Generate new token'")
        print("  3. Copy the token (starts with 'sbp_')\n")
        token = input("Enter your Supabase access token (sbp_...): ").strip()
        
        if not token:
            print("❌ Access token is required")
            sys.exit(1)
    
    return token

def read_function_code():
    """Read the function code from file"""
    if not FUNCTION_FILE.exists():
        print(f"❌ Function file not found: {FUNCTION_FILE}")
        sys.exit(1)
    
    with open(FUNCTION_FILE, 'r', encoding='utf-8') as f:
        return f.read()

def deploy_function(token, code):
    """Deploy function via Supabase Management API"""
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/functions/{FUNCTION_NAME}"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    
    # First, try to get existing function to check if it exists
    response = requests.get(url, headers=headers)
    
    if response.status_code == 404:
        # Function doesn't exist, create it
        print(f"📦 Creating new function: {FUNCTION_NAME}")
        create_url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/functions"
        
        payload = {
            "name": FUNCTION_NAME,
            "body": code,
            "verify_jwt": False,
        }
        
        response = requests.post(create_url, headers=headers, json=payload)
        
    elif response.status_code == 200:
        # Function exists, update it
        print(f"🔄 Updating existing function: {FUNCTION_NAME}")
        payload = {
            "body": code,
            "verify_jwt": False,
        }
        
        response = requests.patch(url, headers=headers, json=payload)
    
    else:
        print(f"❌ Error checking function: {response.status_code}")
        print(f"Response: {response.text}")
        sys.exit(1)
    
    if response.status_code in [200, 201]:
        print(f"✅ Function deployed successfully!")
        print(f"   URL: https://{PROJECT_REF}.supabase.co/functions/v1/{FUNCTION_NAME}")
        return True
    else:
        print(f"❌ Deployment failed: {response.status_code}")
        print(f"Response: {response.text}")
        return False

def main():
    print("🚀 DEPLOYING ONBOARDING FUNCTION")
    print("=" * 60)
    print()
    
    # Get access token
    token = get_access_token()
    
    # Read function code
    print(f"📖 Reading function code from: {FUNCTION_FILE}")
    code = read_function_code()
    print(f"   Code size: {len(code)} characters")
    print()
    
    # Deploy function
    if deploy_function(token, code):
        print()
        print("✅ Deployment complete!")
        print()
        print("Next steps:")
        print("  1. Test the function:")
        print(f"     curl -X POST https://{PROJECT_REF}.supabase.co/functions/v1/{FUNCTION_NAME} \\")
        print("       -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY'")
        print()
        print("  2. Set up scheduled task to call it every minute")
        print("  3. Monitor onboarding queue:")
        print("     SELECT * FROM public.onboarding_queue WHERE status = 'pending';")
    else:
        print()
        print("❌ Deployment failed. Try manual deployment via Supabase Dashboard:")
        print(f"   https://supabase.com/dashboard/project/{PROJECT_REF}/functions")
        sys.exit(1)

if __name__ == "__main__":
    main()

