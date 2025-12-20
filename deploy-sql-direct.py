#!/usr/bin/env python3
"""
Deploy SQL migrations directly to COLLECTIVE-WINS Supabase project
Uses service role key to execute SQL via Management API
"""

import os
import sys
import requests
import json
from pathlib import Path

# COLLECTIVE-WINS project details
PROJECT_REF = "yiorietrtfosjnpzznnr"
SUPABASE_URL = f"https://{PROJECT_REF}.supabase.co"

# Get service role key from environment or prompt
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SERVICE_ROLE_KEY:
    print("❌ SUPABASE_SERVICE_ROLE_KEY not found in environment")
    print("Get it from: https://supabase.com/dashboard/project/{}/settings/api".format(PROJECT_REF))
    print("Then run: export SUPABASE_SERVICE_ROLE_KEY='your-key'")
    sys.exit(1)

def execute_sql_via_api(sql_content: str) -> bool:
    """
    Execute SQL via Supabase Management API
    Note: Supabase doesn't expose direct SQL execution via REST API
    This is a placeholder - actual execution must be done via:
    1. SQL Editor in Dashboard
    2. Supabase CLI
    3. psql connection
    """
    print("⚠️  Supabase doesn't allow direct SQL execution via REST API for security")
    print("   SQL must be executed via SQL Editor or CLI")
    return False

def main():
    print("🚀 Deploying COLLECTIVE-WINS SQL Migrations")
    print("=" * 60)
    print(f"Project: {PROJECT_REF}")
    print(f"URL: {SUPABASE_URL}")
    print()
    
    # Read SQL file
    sql_file = Path(__file__).parent / "DEPLOY_ALL_MIGRATIONS.sql"
    if not sql_file.exists():
        print(f"❌ SQL file not found: {sql_file}")
        sys.exit(1)
    
    sql_content = sql_file.read_text()
    print(f"✅ Loaded SQL file: {len(sql_content)} characters, {sql_content.count(chr(10)) + 1} lines")
    print()
    
    # Since Supabase doesn't allow direct SQL execution via REST API,
    # we'll provide the SQL and instructions
    print("📝 SQL Migration Ready")
    print("=" * 60)
    print()
    print("To deploy, you have 3 options:")
    print()
    print("Option 1: SQL Editor (Easiest)")
    print(f"  1. Go to: https://supabase.com/dashboard/project/{PROJECT_REF}/sql/new")
    print("  2. Copy entire contents of DEPLOY_ALL_MIGRATIONS.sql")
    print("  3. Paste into SQL Editor")
    print("  4. Click 'Run'")
    print()
    print("Option 2: Supabase CLI")
    print("  npx supabase db push --db-url 'postgresql://...'")
    print()
    print("Option 3: psql (if you have connection string)")
    print("  psql 'connection-string' < DEPLOY_ALL_MIGRATIONS.sql")
    print()
    print("=" * 60)
    print("✅ SQL file is ready at: {}".format(sql_file.absolute()))

if __name__ == "__main__":
    main()

