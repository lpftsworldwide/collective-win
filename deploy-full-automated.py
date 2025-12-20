#!/usr/bin/env python3
"""
FULLY AUTOMATED DEPLOYMENT - COLLECTIVE-WINS
Deploys SQL migrations and edge functions automatically
Prompts for credentials if not found
"""

import os
import sys
import requests
import json
import subprocess
from pathlib import Path
from typing import Optional
import getpass
import argparse

PROJECT_REF = "yiorietrtfosjnpzznnr"
SUPABASE_URL = f"https://{PROJECT_REF}.supabase.co"
PROJECT_DIR = Path(__file__).parent

def prompt_for_credential(name: str, description: str, secret: bool = False) -> Optional[str]:
    """Prompt user for a credential (only if interactive)"""
    if not sys.stdin.isatty():
        # Non-interactive mode
        return None
    
    try:
        print(f"\n🔑 {name} Required")
        print(f"   {description}")
        if secret:
            value = getpass.getpass(f"   Enter {name}: ")
        else:
            value = input(f"   Enter {name}: ").strip()
        
        if not value:
            print(f"❌ {name} cannot be empty!")
            return None
        
        return value
    except (EOFError, KeyboardInterrupt):
        return None

def get_service_role_key() -> Optional[str]:
    """Get service role key from environment, .env, or prompt"""
    # Check environment
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if key:
        return key
    
    # Check .env file
    env_file = PROJECT_DIR / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if "SERVICE_ROLE" in line.upper() or "SERVICEKEY" in line.upper():
                    parts = line.split("=", 1)
                    if len(parts) == 2:
                        key = parts[1].strip().strip('"').strip("'")
                        if key:
                            return key
    
    # Prompt user
    print("\n" + "="*60)
    print("⚠️  SUPABASE_SERVICE_ROLE_KEY not found")
    print("="*60)
    print("\nGet it from:")
    print(f"   https://supabase.com/dashboard/project/{PROJECT_REF}/settings/api")
    print("\nLook for 'service_role' key (secret, starts with 'eyJ...')")
    
    key = prompt_for_credential(
        "SUPABASE_SERVICE_ROLE_KEY",
        "Service role key from Supabase Dashboard → Settings → API",
        secret=True
    )
    
    # Save to .env for next time
    save_to_env = input("\n💾 Save to .env file for future use? (y/n): ").strip().lower()
    if save_to_env == 'y':
        with open(env_file, 'a') as f:
            f.write(f"\nSUPABASE_SERVICE_ROLE_KEY={key}\n")
        print("✅ Saved to .env file")
    
    return key

def get_access_token() -> Optional[str]:
    """Get Supabase access token from environment or prompt"""
    # Check environment
    token = os.environ.get("SUPABASE_ACCESS_TOKEN")
    if token:
        return token
    
    # Check if user is logged in via CLI
    try:
        result = subprocess.run(
            ["npx", "supabase", "projects", "list"],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            print("✅ Supabase CLI is authenticated")
            return "CLI_AUTHENTICATED"  # Special marker
    except:
        pass
    
    # Prompt user
    print("\n" + "="*60)
    print("⚠️  SUPABASE_ACCESS_TOKEN not found")
    print("="*60)
    print("\nYou have two options:")
    print("\nOption 1: Login via CLI (Recommended)")
    print("   Run: npx supabase login")
    print("   Then run this script again")
    print("\nOption 2: Provide access token directly")
    print("   Get it from: https://supabase.com/dashboard/account/tokens")
    
    choice = input("\nLogin via CLI now? (y/n): ").strip().lower()
    
    if choice == 'y':
        print("\n🔐 Opening Supabase login...")
        subprocess.run(["npx", "supabase", "login"], check=False)
        # Check if login worked
        try:
            result = subprocess.run(
                ["npx", "supabase", "projects", "list"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                print("✅ Login successful!")
                return "CLI_AUTHENTICATED"
        except:
            pass
    
    # Get token directly
    token = prompt_for_credential(
        "SUPABASE_ACCESS_TOKEN",
        "Access token from Supabase Dashboard → Account → Access Tokens",
        secret=True
    )
    
    return token

def get_database_url(service_key: str) -> Optional[str]:
    """Get database connection string from Supabase API"""
    try:
        # Try to get project settings
        url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}"
        headers = {
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            # Database URL format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
            # We need the password from project settings
            db_host = f"db.{PROJECT_REF}.supabase.co"
            # Password would be in project settings, but API might not expose it
            # For now, return None and use alternative method
            return None
    except:
        pass
    
    return None

def deploy_sql_via_psql(sql_file: Path, connection_string: str) -> bool:
    """Deploy SQL using psql"""
    try:
        result = subprocess.run(
            ["psql", connection_string, "-f", str(sql_file)],
            capture_output=True,
            text=True,
            timeout=120
        )
        if result.returncode == 0:
            print(f"✅ SQL deployed: {sql_file.name}")
            return True
        else:
            print(f"⚠️  psql error: {result.stderr}")
            return False
    except FileNotFoundError:
        print("⚠️  psql not found - install PostgreSQL client")
        return False
    except Exception as e:
        print(f"⚠️  psql error: {e}")
        return False

def deploy_sql_via_api(sql_file: Path, service_key: str) -> bool:
    """Deploy SQL via Supabase Management API (if available)"""
    # Supabase doesn't expose direct SQL execution via REST API
    # But we can try using the SQL Editor API endpoint
    try:
        with open(sql_file) as f:
            sql_content = f.read()
        
        # Try Management API
        url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/sql"
        headers = {
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "query": sql_content
        }
        
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        if response.status_code in [200, 201]:
            print(f"✅ SQL deployed via API: {sql_file.name}")
            return True
        else:
            # API doesn't support this - need manual or psql
            return False
    except Exception as e:
        return False

def deploy_function_via_cli(function_name: str, function_path: Path, access_token: Optional[str] = None) -> bool:
    """Deploy edge function via Supabase CLI"""
    try:
        env = os.environ.copy()
        if access_token and access_token != "CLI_AUTHENTICATED":
            env["SUPABASE_ACCESS_TOKEN"] = access_token
        
        cmd = [
            "npx", "supabase", "functions", "deploy", function_name,
            "--project-ref", PROJECT_REF
        ]
        
        result = subprocess.run(
            cmd,
            cwd=PROJECT_DIR,
            env=env,
            capture_output=True,
            text=True,
            timeout=180
        )
        
        if result.returncode == 0:
            print(f"✅ Function '{function_name}' deployed via CLI")
            print(f"   URL: {SUPABASE_URL}/functions/v1/{function_name}")
            return True
        else:
            error_msg = result.stderr or result.stdout
            if "Access token" in error_msg or "login" in error_msg.lower():
                print(f"⚠️  Authentication required for {function_name}")
            else:
                print(f"⚠️  CLI error: {error_msg[:200]}")
            return False
            
    except Exception as e:
        print(f"⚠️  CLI error: {e}")
        return False

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Fully automated COLLECTIVE-WINS deployment")
    parser.add_argument("--service-role-key", help="Supabase service role key")
    parser.add_argument("--access-token", help="Supabase access token")
    parser.add_argument("--database-url", help="PostgreSQL connection string")
    args = parser.parse_args()
    
    # Set environment variables from args
    if args.service_role_key:
        os.environ["SUPABASE_SERVICE_ROLE_KEY"] = args.service_role_key
    if args.access_token:
        os.environ["SUPABASE_ACCESS_TOKEN"] = args.access_token
    if args.database_url:
        os.environ["DATABASE_URL"] = args.database_url
    
    print("🚀 FULLY AUTOMATED COLLECTIVE-WINS DEPLOYMENT")
    print("=" * 60)
    print(f"Project: {PROJECT_REF}")
    print(f"URL: {SUPABASE_URL}")
    print()
    
    # Get credentials
    print("📋 Getting credentials...")
    service_key = get_service_role_key()
    access_token = get_access_token()
    
    print("\n" + "=" * 60)
    print("🚀 STARTING DEPLOYMENT")
    print("=" * 60)
    
    # Step 1: Deploy SQL Migrations
    print("\n📋 STEP 1: Deploying SQL Migrations")
    print("-" * 60)
    
    sql_files = [
        PROJECT_DIR / "REAL_MONEY_COMPLETE_MIGRATION.sql",
        PROJECT_DIR / "UPDATE_GAME_THUMBNAILS.sql"
    ]
    
    # Try to get database URL
    db_url = os.environ.get("DATABASE_URL") or os.environ.get("SUPABASE_DB_URL")
    
    if not db_url and service_key:
        print("⚠️  Database connection string not found")
        print("   Attempting to get from Supabase API...")
        db_url = get_database_url(service_key)
    
    if not db_url:
        print("\n⚠️  Database connection string required for SQL deployment")
        print("   Get it from: https://supabase.com/dashboard/project/{}/settings/database".format(PROJECT_REF))
        print("   Look for 'Connection string' → 'URI'")
        db_url = prompt_for_credential(
            "DATABASE_URL",
            "PostgreSQL connection string (postgresql://...)",
            secret=True
        )
    
    # Deploy SQL files
    sql_success = True
    for sql_file in sql_files:
        if not sql_file.exists():
            print(f"⚠️  SQL file not found: {sql_file}")
            continue
        
        print(f"\n📦 Deploying: {sql_file.name}")
        
        # Try psql first
        if deploy_sql_via_psql(sql_file, db_url):
            continue
        
        # Try API
        if service_key and deploy_sql_via_api(sql_file, service_key):
            continue
        
        print(f"⚠️  Could not deploy {sql_file.name} automatically")
        print(f"   Manual deployment required via SQL Editor")
        sql_success = False
    
    if not sql_success:
        print("\n⚠️  SQL migrations need manual deployment")
        print("   Go to: https://supabase.com/dashboard/project/{}/sql/new".format(PROJECT_REF))
        print("   Copy and paste the SQL files")
    
    # Step 2: Deploy Edge Functions
    print("\n📋 STEP 2: Deploying Edge Functions")
    print("-" * 60)
    
    functions = [
        ("spin", PROJECT_DIR / "supabase" / "functions" / "spin" / "index.ts"),
        ("claim-bonus", PROJECT_DIR / "supabase" / "functions" / "claim-bonus" / "index.ts")
    ]
    
    func_success = True
    for func_name, func_path in functions:
        if not func_path.exists():
            print(f"⚠️  Function file not found: {func_path}")
            continue
        
        print(f"\n📦 Deploying: {func_name}")
        
        if deploy_function_via_cli(func_name, func_path, access_token):
            continue
        
        print(f"⚠️  Could not deploy {func_name} automatically")
        func_success = False
    
    # Step 3: Verify
    print("\n📋 STEP 3: Verification")
    print("-" * 60)
    
    if service_key:
        try:
            response = requests.get(
                f"{SUPABASE_URL}/rest/v1/licensed_games?select=id&limit=1",
                headers={
                    "apikey": service_key,
                    "Authorization": f"Bearer {service_key}"
                },
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Games table accessible ({len(data)} games found)")
            else:
                print(f"⚠️  Games table returned HTTP {response.status_code}")
        except Exception as e:
            print(f"⚠️  Could not verify games: {e}")
    
    # Test functions
    for func_name, _ in functions:
        try:
            response = requests.post(
                f"{SUPABASE_URL}/functions/v1/{func_name}",
                headers={"Content-Type": "application/json"},
                json={},
                timeout=5
            )
            if response.status_code != 404:
                print(f"✅ Function '{func_name}' is responding (HTTP {response.status_code})")
            else:
                print(f"⚠️  Function '{func_name}' returned 404 (not deployed)")
        except Exception as e:
            print(f"⚠️  Could not test {func_name}: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    if sql_success and func_success:
        print("✅ DEPLOYMENT COMPLETE!")
    else:
        print("⚠️  DEPLOYMENT PARTIALLY COMPLETE")
        if not sql_success:
            print("   - SQL migrations need manual deployment")
        if not func_success:
            print("   - Edge functions need manual deployment")
    print("=" * 60)
    
    print("\n📝 Next steps:")
    if not sql_success:
        print("1. Deploy SQL: https://supabase.com/dashboard/project/{}/sql/new".format(PROJECT_REF))
    if not func_success:
        print("2. Deploy functions: https://supabase.com/dashboard/project/{}/functions".format(PROJECT_REF))
    print("3. Test site: https://collective-win.vercel.app")

if __name__ == "__main__":
    main()
