# 🎴 Tarot-Style Game Images Guide

## Overview
Create ancient, god-like tarot card images for each game in the casino. These images will replace the current game thumbnails and enhance the mystical theme.

## Image Specifications

### Technical Requirements
- **Size**: 300x400px (3:4 aspect ratio)
- **Format**: JPG
- **Location**: `public/game-tiles/{game-slug}.jpg`
- **Style**: Ancient tarot card aesthetic
- **Theme**: God-like, mystical, Egyptian

### Visual Style Guidelines

1. **Color Palette**:
   - Primary: Gold/Amber (#D4AF37, #CD7F32)
   - Secondary: Deep purples, dark blues
   - Accents: Egyptian hieroglyphs, mystical symbols

2. **Border Style**:
   - Ornate tarot card borders
   - Gold filigree patterns
   - Ancient Egyptian motifs

3. **Content**:
   - Game theme represented as ancient deity/mythological figure
   - Mystical symbols related to game mechanics
   - Dark, atmospheric backgrounds

## Game-Specific Themes

### Tumble/Cascade Games
- **Symbol**: 🌊 (Water/Wave)
- **Theme**: Ancient water deities, cascading waterfalls
- **Examples**: Sweet Bonanza, Starlight Princess

### Scatter Games
- **Symbol**: ⭐ (Star)
- **Theme**: Celestial gods, star constellations
- **Examples**: Gates of Olympus, Super Scatter variants

### Hold & Win Games
- **Symbol**: 💎 (Diamond)
- **Theme**: Treasure guardians, vault keepers
- **Examples**: 3 Hot Chillies, Hold and Win variants

### Megaways Games
- **Symbol**: ⚡ (Lightning)
- **Theme**: Thunder gods, power deities
- **Examples**: Brick House, Bonanza variants

### Jackpot Games
- **Symbol**: 👑 (Crown)
- **Theme**: Royalty, pharaohs, divine rulers
- **Examples**: Any jackpot-enabled game

## Image Sources

### Recommended Sources
1. **Unsplash**: Search "ancient egyptian", "tarot cards", "mystical"
2. **Pexels**: Search "egyptian mythology", "ancient art"
3. **AI Generation**: 
   - Midjourney: "ancient egyptian tarot card, [game theme], gold borders, mystical"
   - DALL-E: Similar prompts
   - Stable Diffusion: Use "ancient egyptian" + "tarot" + game name

### Custom Creation
- Use image editing software (Photoshop, GIMP)
- Combine stock images with tarot card borders
- Add game-specific symbols and themes
- Apply gold/amber color grading

## Implementation Steps

1. **Generate/Find Images**: Create or source 51 tarot-style images
2. **Resize**: Ensure all images are 300x400px
3. **Optimize**: Compress JPG files (aim for <100KB each)
4. **Name**: Use exact game slug (e.g., `gates-of-olympus.jpg`)
5. **Place**: Save to `public/game-tiles/` directory
6. **Update Database**: Ensure `thumbnail_url` points to `/game-tiles/{slug}.jpg`

## Example Prompts for AI Generation

```
"Ancient Egyptian tarot card featuring [GAME THEME], ornate gold borders with hieroglyphs, mystical dark background, god-like figure, 300x400px, cinematic lighting"
```

Replace `[GAME THEME]` with:
- "Greek god Zeus" for Gates of Olympus
- "Princess in starlight" for Starlight Princess
- "Three fiery peppers" for 3 Hot Chillies
- "Brick temple" for Brick House
- etc.

## Current Status

All 51 games have placeholder images. Replace them with tarot-style versions to complete the mystical aesthetic.

