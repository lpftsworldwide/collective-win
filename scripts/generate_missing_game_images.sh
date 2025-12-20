#!/bin/bash
# Generate Missing Game Images Script
# Copies existing images as placeholders for missing game images

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
GAME_TILES_DIR="$PROJECT_ROOT/public/game-tiles"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🎮 Generating Missing Game Images"
echo "=================================="
echo ""

# Extract game codes from SQL migration
echo "📋 Extracting game codes from SQL migration..."
GAME_CODES=(
  "big-bass-splash"
  "gates-of-olympus"
  "sweet-bonanza"
  "starlight-princess"
  "legend-of-cleopatra"
  "egypt-fire"
  "golden-pharaoh-megaways"
  "crystal-fortune-deluxe"
  "oceans-treasure-quest"
  "blackjack-royal-vip"
  "dragons-fire-prosperity"
  "lightning-strike-roulette"
  "wild-west-bounty-hunter"
  "cosmic-gems-cluster"
  "mega-fortune-jackpot-king"
  "ancient-aztec-gold"
  "baccarat-royale-supreme"
  "neon-city-nights"
  "viking-conquest-saga"
  "crash-rocket-multiplier"
  "diamond-dynasty-deluxe"
  "egyptian-mysteries-unlimited"
  "fruit-blitz-super-spin"
  "pirates-plunder-megaways"
  "starburst-crystal-classic"
  "buffalo-thunder-lightning"
  "zeus-power-reels"
  "sugar-rush-candy-blitz"
  "moon-princess-trinity"
  "roulette-pro-european"
  "aztec-bonanza-infinity"
  "mega-moolah-fortune"
  "dead-or-alive-outlaw"
  "jammin-jars-cluster-party"
  "book-of-secrets-deluxe"
  "gonzos-quest-megaways"
  "bonanza-goldmine-megaways"
  "legacy-of-egypt-power"
  "immortal-romance-remastered"
  "fire-joker-respin"
  "reactoonz-quantum-leap"
  "street-racer-nitro"
  "tiki-fortune-totem"
  "tomb-raider-expedition"
  "space-invaders-arcade"
  "rainbow-riches-megaways"
  "wolf-gold-moon-spin"
  "poker-face-texas-holdem"
  "jungle-adventure-expedition"
  "mega-ball-live"
  "gladiator-arena-champion"
  "fortune-tiger-prosperity"
  "fishing-frenzy-megaways"
)

# Function to find best matching image
find_best_match() {
  local game_code=$1
  local category=$2
  
  # Theme-based matching
  case "$game_code" in
    *egypt*|*pharaoh*|*cleopatra*|*aztec*)
      # Egyptian theme
      if [ -f "$GAME_TILES_DIR/ancient-aztec-gold.jpg" ]; then
        echo "ancient-aztec-gold.jpg"
        return
      fi
      if [ -f "$GAME_TILES_DIR/egypt-fire.jpg" ]; then
        echo "egypt-fire.jpg"
        return
      fi
      ;;
    *ocean*|*treasure*|*fishing*|*pirate*)
      # Ocean/Water theme
      if [ -f "$GAME_TILES_DIR/oceans-treasure-quest.jpg" ]; then
        echo "oceans-treasure-quest.jpg"
        return
      fi
      ;;
    *zeus*|*olympus*|*greek*)
      # Greek/Mythology theme
      if [ -f "$GAME_TILES_DIR/gates-of-olympus.jpg" ]; then
        echo "gates-of-olympus.jpg"
        return
      fi
      ;;
    *wild*|*west*|*outlaw*|*bounty*)
      # Wild West theme
      if [ -f "$GAME_TILES_DIR/wild-west-bounty-hunter.jpg" ]; then
        echo "wild-west-bounty-hunter.jpg"
        return
      fi
      ;;
    *bass*|*fishing*)
      # Fishing theme
      if [ -f "$GAME_TILES_DIR/big-bass-splash.jpg" ]; then
        echo "big-bass-splash.jpg"
        return
      fi
      ;;
  esac
  
  # Category-based fallback
  case "$category" in
    live)
      if [ -f "$GAME_TILES_DIR/baccarat-royale-supreme.jpg" ]; then
        echo "baccarat-royale-supreme.jpg"
        return
      fi
      if [ -f "$GAME_TILES_DIR/lightning-strike-roulette.jpg" ]; then
        echo "lightning-strike-roulette.jpg"
        return
      fi
      ;;
    table)
      if [ -f "$GAME_TILES_DIR/blackjack-royal-vip.jpg" ]; then
        echo "blackjack-royal-vip.jpg"
        return
      fi
      ;;
    crash)
      if [ -f "$GAME_TILES_DIR/crash-rocket-multiplier.jpg" ]; then
        echo "crash-rocket-multiplier.jpg"
        return
      fi
      ;;
  esac
  
  # Generic slot fallback
  if [ -f "$GAME_TILES_DIR/sweet-bonanza.jpg" ]; then
    echo "sweet-bonanza.jpg"
    return
  fi
  if [ -f "$GAME_TILES_DIR/gates-of-olympus.jpg" ]; then
    echo "gates-of-olympus.jpg"
    return
  fi
  
  # Last resort - any existing image
  local first_image=$(ls "$GAME_TILES_DIR"/*.jpg 2>/dev/null | head -1 | xargs basename)
  if [ -n "$first_image" ]; then
    echo "$first_image"
    return
  fi
  
  echo ""
}

# Check if game-tiles directory exists
if [ ! -d "$GAME_TILES_DIR" ]; then
  echo -e "${RED}❌ Error: Game tiles directory not found: $GAME_TILES_DIR${NC}"
  exit 1
fi

# Track statistics
MISSING_COUNT=0
CREATED_COUNT=0
EXISTING_COUNT=0
MAPPINGS=()

echo "🔍 Checking for missing images..."
echo ""

# Process each game
for game_code in "${GAME_CODES[@]}"; do
  image_path="$GAME_TILES_DIR/${game_code}.jpg"
  
  if [ -f "$image_path" ]; then
    echo -e "${GREEN}✅${NC} $game_code.jpg (exists)"
    EXISTING_COUNT=$((EXISTING_COUNT + 1))
  else
    echo -e "${YELLOW}⚠️${NC}  $game_code.jpg (missing)"
    MISSING_COUNT=$((MISSING_COUNT + 1))
    
    # Determine category from game code or name
    category="slots"
    if [[ "$game_code" == *"live"* ]] || [[ "$game_code" == *"roulette"* ]] || [[ "$game_code" == *"baccarat"* ]] || [[ "$game_code" == *"mega-ball"* ]]; then
      category="live"
    elif [[ "$game_code" == *"blackjack"* ]] || [[ "$game_code" == *"poker"* ]] || [[ "$game_code" == *"roulette"* ]]; then
      category="table"
    elif [[ "$game_code" == *"crash"* ]]; then
      category="crash"
    fi
    
    # Find best matching image
    source_image=$(find_best_match "$game_code" "$category")
    
    if [ -n "$source_image" ] && [ -f "$GAME_TILES_DIR/$source_image" ]; then
      # Copy the image
      cp "$GAME_TILES_DIR/$source_image" "$image_path"
      echo -e "   ${GREEN}→ Created${NC} from $source_image"
      MAPPINGS+=("$game_code.jpg ← $source_image")
      CREATED_COUNT=$((CREATED_COUNT + 1))
    else
      echo -e "   ${RED}❌ No source image found${NC}"
    fi
  fi
done

echo ""
echo "=================================="
echo "📊 Summary:"
echo "   Total games: ${#GAME_CODES[@]}"
echo -e "   ${GREEN}Existing: $EXISTING_COUNT${NC}"
echo -e "   ${YELLOW}Missing: $MISSING_COUNT${NC}"
echo -e "   ${GREEN}Created: $CREATED_COUNT${NC}"
echo ""

if [ ${#MAPPINGS[@]} -gt 0 ]; then
  echo "📋 Image Mappings:"
  for mapping in "${MAPPINGS[@]}"; do
    echo "   $mapping"
  done
  echo ""
fi

if [ $CREATED_COUNT -gt 0 ]; then
  echo -e "${GREEN}✅ Successfully created $CREATED_COUNT placeholder images!${NC}"
  exit 0
elif [ $MISSING_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ All images exist!${NC}"
  exit 0
else
  echo -e "${RED}❌ Failed to create some images${NC}"
  exit 1
fi

