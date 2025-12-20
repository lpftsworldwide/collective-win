#!/usr/bin/env python3
"""
Deploy SQL directly to Supabase using service role key
Tries multiple methods to execute SQL
"""

import os
import sys
import requests
import json
import subprocess
from pathlib import Path

PROJECT_REF = "yiorietrtfosjnpzznnr"
SUPABASE_URL = f"https://{PROJECT_REF}.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpb3JpZXRydGZvc2pucHp6bm5yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzMzOTI4OCwiZXhwIjoyMDcyOTE1Mjg4fQ.-qK8eeCrh-wV5FvwGS92zJ3xf11MWJf-v0kL_k3BiR4"

def execute_sql_via_postgrest(sql_content: str) -> bool:
    """Try executing SQL via PostgREST RPC if exec_sql function exists"""
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {"sql": sql_content}
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        if response.status_code == 200:
            print("✅ SQL executed via PostgREST RPC")
            return True
        return False
    except:
        return False

def execute_sql_via_management_api(sql_content: str) -> bool:
    """Try executing SQL via Supabase Management API"""
    # Try different Management API endpoints
    endpoints = [
        f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query",
        f"https://api.supabase.com/v1/projects/{PROJECT_REF}/sql",
    ]
    
    headers = {
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    for url in endpoints:
        try:
            payload = {"query": sql_content}
            response = requests.post(url, json=payload, headers=headers, timeout=120)
            if response.status_code in [200, 201]:
                print(f"✅ SQL executed via Management API: {url}")
                return True
        except:
            continue
    
    return False

def execute_sql_via_psql(sql_content: str, connection_string: str) -> bool:
    """Execute SQL using psql"""
    try:
        # Write SQL to temp file
        temp_file = Path("/tmp/supabase_migration.sql")
        temp_file.write_text(sql_content)
        
        result = subprocess.run(
            ["psql", connection_string, "-f", str(temp_file)],
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode == 0:
            print("✅ SQL executed via psql")
            return True
        else:
            print(f"⚠️  psql error: {result.stderr[:200]}")
            return False
    except FileNotFoundError:
        print("⚠️  psql not found")
        return False
    except Exception as e:
        print(f"⚠️  psql error: {e}")
        return False

def get_database_url() -> str:
    """Construct database URL from service role key"""
    # Extract password from service role key (we need the actual DB password)
    # For now, try to get it from Supabase API or use connection pooling
    # Connection string format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
    
    # Try connection pooling URL (works with service role key)
    pooler_url = f"postgresql://postgres.{PROJECT_REF}:{SERVICE_ROLE_KEY}@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
    
    return pooler_url

def execute_sql_chunks(sql_content: str) -> bool:
    """Execute SQL in smaller chunks via REST API"""
    # Split SQL by semicolons and execute statements one by one
    statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]
    
    print(f"📦 Executing {len(statements)} SQL statements...")
    
    # Try to execute via REST API using a stored procedure approach
    # Since direct SQL execution isn't available, we'll need to use psql or manual deployment
    
    return False

def main():
    print("🚀 DEPLOYING SQL MIGRATIONS TO SUPABASE")
    print("=" * 60)
    print(f"Project: {PROJECT_REF}")
    print(f"Service Role Key: {SERVICE_ROLE_KEY[:20]}...")
    print()
    
    project_dir = Path(__file__).parent
    sql_files = [
        ("REAL_MONEY_COMPLETE_MIGRATION.sql", "Main migration - creates all tables and games"),
        ("UPDATE_GAME_THUMBNAILS.sql", "Thumbnail update - fixes game images")
    ]
    
    all_success = True
    
    for sql_file_name, description in sql_files:
        sql_file = project_dir / sql_file_name
        
        if not sql_file.exists():
            print(f"❌ File not found: {sql_file}")
            all_success = False
            continue
        
        print(f"\n📦 Deploying: {sql_file_name}")
        print(f"   {description}")
        print("-" * 60)
        
        with open(sql_file) as f:
            sql_content = f.read()
        
        print(f"   Size: {len(sql_content)} characters, {sql_content.count(chr(10))} lines")
        
        # Try multiple methods
        success = False
        
        # Method 1: Try PostgREST RPC
        if execute_sql_via_postgrest(sql_content):
            success = True
        
        # Method 2: Try Management API
        if not success and execute_sql_via_management_api(sql_content):
            success = True
        
        # Method 3: Try psql (if we can construct connection string)
        if not success:
            try:
                db_url = get_database_url()
                if execute_sql_via_psql(sql_content, db_url):
                    success = True
            except Exception as e:
                print(f"   ⚠️  psql method failed: {e}")
        
        if success:
            print(f"   ✅ {sql_file_name} deployed successfully!")
        else:
            print(f"   ❌ Could not deploy {sql_file_name} automatically")
            print(f"   📝 Manual deployment required:")
            print(f"      1. Go to: https://supabase.com/dashboard/project/{PROJECT_REF}/sql/new")
            print(f"      2. Copy entire contents of: {sql_file}")
            print(f"      3. Paste and click 'Run'")
            all_success = False
    
    # Verify deployment
    print("\n" + "=" * 60)
    print("🔍 Verifying deployment...")
    print("=" * 60)
    
    try:
        # Check if games table exists and has data
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/licensed_games?select=game_code,name&limit=5",
            headers={
                "apikey": SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {SERVICE_ROLE_KEY}"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            games = response.json()
            print(f"✅ Games table accessible - found {len(games)} games")
            if games:
                print("   Sample games:")
                for game in games[:3]:
                    print(f"     - {game.get('name', 'Unknown')} ({game.get('game_code', 'N/A')})")
        else:
            print(f"⚠️  Games table returned HTTP {response.status_code}")
            if response.status_code == 404:
                print("   → Table doesn't exist - SQL not deployed yet")
    except Exception as e:
        print(f"⚠️  Could not verify: {e}")
    
    print("\n" + "=" * 60)
    if all_success:
        print("✅ ALL SQL MIGRATIONS DEPLOYED SUCCESSFULLY!")
    else:
        print("⚠️  SOME MIGRATIONS NEED MANUAL DEPLOYMENT")
        print("   See instructions above")
    print("=" * 60)
    
    return 0 if all_success else 1

if __name__ == "__main__":
    sys.exit(main())
