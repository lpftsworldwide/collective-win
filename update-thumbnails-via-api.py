#!/usr/bin/env python3
"""
Update game thumbnails via Supabase REST API
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

# Games that have images
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

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def update_thumbnail(game_code: str) -> bool:
    """Update thumbnail URL for a single game"""
    url = f"{SUPABASE_URL}/rest/v1/licensed_games"
    params = {"game_code": f"eq.{game_code}"}
    
    payload = {
        "thumbnail_url": f"/game-tiles/{game_code}.jpg"
    }
    
    try:
        response = requests.patch(url, json=payload, headers=headers, params=params, timeout=10)
        if response.status_code in [200, 204]:
            return True
        else:
            print(f"   ⚠️  {game_code}: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"   ⚠️  {game_code}: {e}")
        return False

def main():
    print("🚀 Updating Game Thumbnails")
    print("=" * 60)
    
    # First, check current state
    print("\n📋 Checking current games...")
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/licensed_games?select=game_code,name,thumbnail_url&limit=5",
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            games = response.json()
            print(f"✅ Found {len(games)} games (showing first 5)")
            for game in games:
                thumb = game.get('thumbnail_url', 'NULL')
                print(f"   - {game.get('name')}: {thumb}")
    except Exception as e:
        print(f"⚠️  Could not check games: {e}")
    
    # Update thumbnails
    print(f"\n📦 Updating thumbnails for {len(GAMES_WITH_IMAGES)} games...")
    print("-" * 60)
    
    success_count = 0
    for game_code in GAMES_WITH_IMAGES:
        if update_thumbnail(game_code):
            success_count += 1
            if success_count % 10 == 0:
                print(f"   ✅ Updated {success_count}/{len(GAMES_WITH_IMAGES)}...")
    
    print(f"\n✅ Updated {success_count}/{len(GAMES_WITH_IMAGES)} game thumbnails")
    
    # Verify
    print("\n🔍 Verifying updates...")
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/licensed_games?select=game_code,thumbnail_url&thumbnail_url=not.is.null&limit=10",
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            games = response.json()
            print(f"✅ {len(games)} games now have thumbnails (showing first 10)")
            for game in games[:5]:
                print(f"   - {game.get('game_code')}: {game.get('thumbnail_url')}")
    except Exception as e:
        print(f"⚠️  Could not verify: {e}")
    
    print("\n" + "=" * 60)
    print("✅ Thumbnail update complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()

