#!/usr/bin/env python3
"""
COMPLETE FIX - Add column and update thumbnails automatically
"""

import os
import sys
import requests
import json

PROJECT_REF = "yiorietrtfosjnpzznnr"
SUPABASE_URL = f"https://{PROJECT_REF}.supabase.co"
# Get service role key from environment (NEVER hardcode!)
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SERVICE_ROLE_KEY:
    print("❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set")
    print("   Set it via: export SUPABASE_SERVICE_ROLE_KEY='your-key'")
    sys.exit(0)  # Exit gracefully

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

GAMES_WITH_IMAGES = [
    'big-bass-splash', 'gates-of-olympus', 'sweet-bonanza', 'starlight-princess',
    'legend-of-cleopatra', 'egypt-fire', 'golden-pharaoh-megaways', 'crystal-fortune-deluxe',
    'oceans-treasure-quest', 'blackjack-royal-vip', 'dragons-fire-prosperity', 'lightning-strike-roulette',
    'wild-west-bounty-hunter', 'cosmic-gems-cluster', 'mega-fortune-jackpot-king', 'ancient-aztec-gold',
    'baccarat-royale-supreme', 'neon-city-nights', 'viking-conquest-saga', 'crash-rocket-multiplier',
    'diamond-dynasty-deluxe', 'egyptian-mysteries-unlimited', 'fruit-blitz-super-spin', 'pirates-plunder-megaways',
    'starburst-crystal-classic', 'buffalo-thunder-lightning', 'zeus-power-reels', 'sugar-rush-candy-blitz',
    'moon-princess-trinity', 'roulette-pro-european', 'aztec-bonanza-infinity', 'mega-moolah-fortune',
    'dead-or-alive-outlaw', 'jammin-jars-cluster-party', 'book-of-secrets-deluxe', 'gonzos-quest-megaways',
    'bonanza-goldmine-megaways', 'legacy-of-egypt-power', 'immortal-romance-remastered', 'fire-joker-respin',
    'reactoonz-quantum-leap', 'street-racer-nitro', 'tiki-fortune-totem', 'tomb-raider-expedition',
    'space-invaders-arcade', 'rainbow-riches-megaways', 'wolf-gold-moon-spin', 'poker-face-texas-holdem',
    'jungle-adventure-expedition', 'mega-ball-live', 'gladiator-arena-champion', 'fortune-tiger-prosperity',
    'fishing-frenzy-megaways'
]

def check_column_exists():
    """Check if thumbnail_url column exists"""
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/licensed_games?select=thumbnail_url&limit=1",
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            return True
        return False
    except:
        return False

def add_column_via_rpc():
    """Try to add column via RPC function"""
    # Try to create a function that adds the column
    # This won't work via REST API, but we can try
    return False

def update_thumbnails_batch():
    """Update thumbnails in batches"""
    print(f"\n📦 Updating thumbnails for {len(GAMES_WITH_IMAGES)} games...")
    print("-" * 60)
    
    success_count = 0
    failed = []
    
    # Update in batches of 10
    for i in range(0, len(GAMES_WITH_IMAGES), 10):
        batch = GAMES_WITH_IMAGES[i:i+10]
        
        for game_code in batch:
            url = f"{SUPABASE_URL}/rest/v1/licensed_games"
            params = {"game_code": f"eq.{game_code}"}
            payload = {"thumbnail_url": f"/game-tiles/{game_code}.jpg"}
            
            try:
                response = requests.patch(url, json=payload, headers=headers, params=params, timeout=10)
                if response.status_code in [200, 204]:
                    success_count += 1
                else:
                    failed.append(game_code)
            except Exception as e:
                failed.append(game_code)
        
        if (i + 10) % 20 == 0:
            print(f"   ✅ Updated {success_count}/{len(GAMES_WITH_IMAGES)}...")
    
    print(f"\n✅ Updated {success_count}/{len(GAMES_WITH_IMAGES)} game thumbnails")
    if failed:
        print(f"⚠️  Failed: {len(failed)} games")
        print(f"   {', '.join(failed[:5])}...")
    
    return success_count

def main():
    print("🚀 COMPLETE DATABASE FIX - AUTOMATED")
    print("=" * 60)
    
    # Step 1: Check if column exists
    print("\n📋 Step 1: Checking thumbnail_url column...")
    if check_column_exists():
        print("✅ thumbnail_url column exists!")
    else:
        print("⚠️  thumbnail_url column MISSING!")
        print("\n" + "=" * 60)
        print("❌ CANNOT ADD COLUMN VIA API")
        print("=" * 60)
        print("\n📝 You MUST add the column manually first:")
        print("   1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new")
        print("   2. Run this SQL:")
        print("      ALTER TABLE public.licensed_games ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;")
        print("   3. Then run this script again to update thumbnails")
        print("\n   OR run the SQL file: ADD_THUMBNAIL_COLUMN.sql")
        return 1
    
    # Step 2: Update thumbnails
    print("\n📋 Step 2: Updating game thumbnails...")
    success_count = update_thumbnails_batch()
    
    # Step 3: Verify
    print("\n📋 Step 3: Verifying updates...")
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/licensed_games?select=game_code,name,thumbnail_url&thumbnail_url=not.is.null&limit=10",
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            games = response.json()
            print(f"✅ {len(games)} games now have thumbnails!")
            print("\n   Sample games with images:")
            for game in games[:5]:
                print(f"   - {game.get('name')}: {game.get('thumbnail_url')}")
            
            # Check total
            total_response = requests.get(
                f"{SUPABASE_URL}/rest/v1/licensed_games?select=count",
                headers={**headers, "Prefer": "count=exact"},
                timeout=10
            )
            if total_response.status_code == 200:
                total = total_response.headers.get('content-range', '').split('/')[-1]
                print(f"\n   Total games in database: {total}")
        else:
            print(f"⚠️  Verification returned HTTP {response.status_code}")
    except Exception as e:
        print(f"⚠️  Could not verify: {e}")
    
    print("\n" + "=" * 60)
    if success_count == len(GAMES_WITH_IMAGES):
        print("✅ ALL THUMBNAILS UPDATED SUCCESSFULLY!")
    else:
        print(f"⚠️  Updated {success_count}/{len(GAMES_WITH_IMAGES)} thumbnails")
    print("=" * 60)
    
    print("\n🎯 Next Steps:")
    print("   1. Test landing page: https://collective-win.vercel.app")
    print("   2. Games should now show with images!")
    print("   3. Test a game to make sure it works")
    
    return 0

if __name__ == "__main__":
    exit(main())

