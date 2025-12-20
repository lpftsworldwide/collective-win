#!/usr/bin/env python3
"""
Deploy SQL migrations to Supabase via Management API
"""

import os
import sys
import requests
import json
from pathlib import Path

PROJECT_REF = "yiorietrtfosjnpzznnr"
SUPABASE_URL = f"https://{PROJECT_REF}.supabase.co"

def get_service_role_key():
    """Get service role key"""
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if key:
        return key
    
    # Check .env
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if "SERVICE_ROLE" in line.upper():
                    parts = line.split("=", 1)
                    if len(parts) == 2:
                        return parts[1].strip().strip('"').strip("'")
    
    print("❌ SUPABASE_SERVICE_ROLE_KEY not found")
    print("Get it from: https://supabase.com/dashboard/project/{}/settings/api".format(PROJECT_REF))
    return None

def execute_sql_via_rest_api(sql_content: str, service_key: str) -> bool:
    """Try to execute SQL via Supabase REST API"""
    # Supabase doesn't allow direct SQL execution via REST API
    # But we can try using the PostgREST RPC endpoint if a function exists
    # Or use the Management API
    
    # Try Management API
    url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"
    headers = {
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "query": sql_content
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        if response.status_code in [200, 201]:
            print("✅ SQL executed via Management API")
            return True
        else:
            print(f"⚠️  Management API returned {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"⚠️  Management API error: {e}")
        return False

def execute_sql_via_rpc(sql_content: str, service_key: str) -> bool:
    """Try to execute SQL via RPC function"""
    # Some Supabase setups have an exec_sql RPC function
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "sql": sql_content
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        if response.status_code == 200:
            print("✅ SQL executed via RPC")
            return True
        else:
            return False
    except:
        return False

def main():
    print("🚀 Deploying SQL Migrations to Supabase")
    print("=" * 60)
    
    service_key = get_service_role_key()
    if not service_key:
        print("\n⚠️  Cannot deploy SQL automatically without service role key")
        print("   SQL must be deployed manually via SQL Editor")
        print("   Go to: https://supabase.com/dashboard/project/{}/sql/new".format(PROJECT_REF))
        return
    
    project_dir = Path(__file__).parent
    sql_files = [
        project_dir / "REAL_MONEY_COMPLETE_MIGRATION.sql",
        project_dir / "UPDATE_GAME_THUMBNAILS.sql"
    ]
    
    for sql_file in sql_files:
        if not sql_file.exists():
            print(f"⚠️  File not found: {sql_file}")
            continue
        
        print(f"\n📦 Deploying: {sql_file.name}")
        with open(sql_file) as f:
            sql_content = f.read()
        
        # Try Management API first
        if execute_sql_via_rest_api(sql_content, service_key):
            continue
        
        # Try RPC
        if execute_sql_via_rpc(sql_content, service_key):
            continue
        
        print(f"⚠️  Could not deploy {sql_file.name} automatically")
        print(f"   Manual deployment required")
    
    print("\n" + "=" * 60)
    print("✅ SQL deployment attempt complete")
    print("=" * 60)

if __name__ == "__main__":
    main()

