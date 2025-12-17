export interface Game {
  GameTitle: string;
  GameID: string;
  Provider: string;
  RTP: string;
  Volatility: "Low" | "Medium" | "High";
  GameType: "Slot" | "Live" | "Table" | "Crash";
  UI_ShortDescription: string;
  UI_RulesModal: {
    Mechanics: string;
    PayoutStructure: string;
  };
}

export const gameLibrary: Game[] = [
  {
    GameTitle: "Big Bass Splash",
    GameID: "big-bass-splash",
    Provider: "Pragmatic Play",
    RTP: "96.71",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Dive into the fishing adventure with massive multipliers and free spins.",
    UI_RulesModal: {
      Mechanics: "Land 3+ scatter symbols to trigger free spins. Each fisherman collects all visible fish values.",
      PayoutStructure: "Retrigger up to 55 free spins with growing multipliers up to 10x."
    }
  },
  {
    GameTitle: "Gates of Olympus",
    GameID: "gates-of-olympus",
    Provider: "Pragmatic Play",
    RTP: "96.50",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Zeus powers tumble wins with multipliers up to 500x.",
    UI_RulesModal: {
      Mechanics: "Tumble mechanic removes winning symbols for new ones. Zeus can randomly apply multipliers of 2x-500x.",
      PayoutStructure: "Get 4+ scatter symbols for 15 free spins with unlimited multiplier potential."
    }
  },
  {
    GameTitle: "Sweet Bonanza",
    GameID: "sweet-bonanza",
    Provider: "Pragmatic Play",
    RTP: "96.48",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Candy-filled tumbles with lollipop bombs and free spins.",
    UI_RulesModal: {
      Mechanics: "Match 8+ symbols anywhere to win. Tumbles continue until no new wins.",
      PayoutStructure: "Lollipop bombs apply 2x-100x multipliers in free spins. Land 4+ scatters for 10 free spins."
    }
  },
  {
    GameTitle: "Starlight Princess 1000",
    GameID: "starlight-princess",
    Provider: "Pragmatic Play",
    RTP: "96.55",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Anime princess delivers multipliers up to 1000x.",
    UI_RulesModal: {
      Mechanics: "Match 8+ symbols for wins. Princess can randomly add 2x-500x multipliers.",
      PayoutStructure: "Free spins trigger with 4+ scatters. Multipliers persist and multiply together during free spins."
    }
  },
  {
    GameTitle: "Legend of Cleopatra",
    GameID: "legend-of-cleopatra",
    Provider: "Playson",
    RTP: "95.05",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Egyptian queen offers expanding wilds and mystery symbols.",
    UI_RulesModal: {
      Mechanics: "Wild symbols expand to cover entire reels. Mystery symbols reveal the same random symbol.",
      PayoutStructure: "3+ scatters award 10 free spins with enhanced expanding wilds."
    }
  },
  {
    GameTitle: "Egypt Fire (Hold and Win)",
    GameID: "egypt-fire",
    Provider: "Pragmatic Play",
    RTP: "96.25",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Ancient Egypt meets Hold and Win mechanic with progressive jackpots.",
    UI_RulesModal: {
      Mechanics: "Land 6+ fire symbols to trigger Hold and Win feature. Each new symbol resets spins to 3. Fill the grid to win Grand Jackpot.",
      PayoutStructure: "Three jackpot levels: Mini (20x), Major (100x), Grand (1000x). Hold and Win symbols award multipliers and instant prizes."
    }
  },
  {
    GameTitle: "Golden Pharaoh Megaways",
    GameID: "golden-pharaoh-megaways",
    Provider: "Nova Gaming Studios",
    RTP: "96.8%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "6-reel Megaways with expanding wilds and cascading wins up to 50,000x stake",
    UI_RulesModal: {
      Mechanics: "1. Up to 117,649 ways to win. 2. Golden scarab symbols trigger free spins (3+ scatters). 3. Unlimited win multipliers during bonus rounds. 4. Expanding wild pharaohs cover entire reels.",
      PayoutStructure: "Megaways system with dynamic paylines. Maximum payout 50,000x your stake. Base game pays left to right."
    }
  },
  {
    GameTitle: "Crystal Fortune Deluxe",
    GameID: "crystal-fortune-deluxe",
    Provider: "Apex Play",
    RTP: "96.5%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "5x3 grid featuring sticky wilds and a progressive pick-and-win bonus game",
    UI_RulesModal: {
      Mechanics: "1. Land 3+ crystal scatter symbols for bonus round. 2. Sticky wilds remain for 3 spins. 3. Pick-and-win bonus reveals instant prizes. 4. Retrigger feature available.",
      PayoutStructure: "20 fixed paylines. Maximum win 10,000x stake. Scatter pays are multiplied by total bet."
    }
  },
  {
    GameTitle: "Ocean's Treasure Quest",
    GameID: "oceans-treasure-quest",
    Provider: "Deep Blue Gaming",
    RTP: "97.1%",
    Volatility: "Low",
    GameType: "Slot",
    UI_ShortDescription: "Underwater adventure with 243 ways to win and frequent small payouts",
    UI_RulesModal: {
      Mechanics: "1. 243 ways to win on 5x3 grid. 2. Treasure chest scatters award 10 free spins. 3. Wild symbols double all wins. 4. Dolphin symbols pay both ways.",
      PayoutStructure: "243 ways to win system. Maximum payout 5,000x. High hit frequency for regular wins."
    }
  },
  {
    GameTitle: "Blackjack Royal VIP",
    GameID: "blackjack-royal-vip",
    Provider: "Elite Table Games",
    RTP: "99.5%",
    Volatility: "Low",
    GameType: "Table",
    UI_ShortDescription: "Classic blackjack with perfect pairs side bet and dealer chat interface",
    UI_RulesModal: {
      Mechanics: "1. Standard blackjack rules (dealer stands on soft 17). 2. Perfect pairs side bet available. 3. Insurance offered on dealer ace. 4. Surrender option after initial deal.",
      PayoutStructure: "Blackjack pays 3:2. Insurance pays 2:1. Perfect pairs pays up to 25:1."
    }
  },
  {
    GameTitle: "Dragon's Fire Prosperity",
    GameID: "dragons-fire-prosperity",
    Provider: "Eastern Legends",
    RTP: "96.9%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Asian-themed 5x4 slot with expanding reels and mystery symbol feature",
    UI_RulesModal: {
      Mechanics: "1. Reels expand to 5x6 during free spins. 2. Mystery dragon symbols reveal matching symbols. 3. 8+ free spins triggered by 3 scatters. 4. Multipliers increase with each cascade.",
      PayoutStructure: "1024 ways to win base game, expanding to 15,625 ways. Maximum win 25,000x stake."
    }
  },
  {
    GameTitle: "Lightning Strike Roulette",
    GameID: "lightning-strike-roulette",
    Provider: "Elite Table Games",
    RTP: "97.3%",
    Volatility: "Medium",
    GameType: "Live",
    UI_ShortDescription: "Live roulette with random lightning multipliers up to 500x on straight bets",
    UI_RulesModal: {
      Mechanics: "1. European roulette wheel (single zero). 2. 1-5 lucky numbers receive multipliers each round. 3. Lightning multipliers range from 50x to 500x. 4. Standard inside and outside bets available.",
      PayoutStructure: "Straight up bets pay 29:1 (30:1 with lightning). Lightning multipliers applied to winning numbers."
    }
  },
  {
    GameTitle: "Wild West Bounty Hunter",
    GameID: "wild-west-bounty-hunter",
    Provider: "Frontier Gaming",
    RTP: "96.6%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Volatile western-themed slot with walking wilds and bounty multiplier feature",
    UI_RulesModal: {
      Mechanics: "1. Walking wilds move one reel left each spin. 2. Wanted poster scatters trigger bounty hunt bonus. 3. Collect bounties for increasing multipliers. 4. Sheriff badge awards instant cash prizes.",
      PayoutStructure: "25 paylines on 5x3 grid. Maximum win 20,000x. Bounty multipliers stack during bonus."
    }
  },
  {
    GameTitle: "Cosmic Gems Cluster",
    GameID: "cosmic-gems-cluster",
    Provider: "Galaxy Slots",
    RTP: "96.7%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Cluster pays mechanic with cascade feature and quantum wild transformations",
    UI_RulesModal: {
      Mechanics: "1. 5+ matching symbols in cluster trigger win. 2. Winning symbols cascade to reveal new ones. 3. Quantum wilds transform into random symbols. 4. Free spins awarded at 100% charge meter.",
      PayoutStructure: "Cluster pays system on 7x7 grid. Maximum payout 15,000x with cascade multipliers."
    }
  },
  {
    GameTitle: "Mega Fortune Jackpot King",
    GameID: "mega-fortune-jackpot-king",
    Provider: "Progressive Network",
    RTP: "95.8%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Progressive jackpot slot with three-tier prize pool and luxury theme",
    UI_RulesModal: {
      Mechanics: "1. Wheel of Fortune bonus triggered by 3+ jackpot symbols. 2. Three progressive levels (Rapid, Major, Mega). 3. Base game features expanding wilds. 4. Mega jackpot starts at $1,000,000.",
      PayoutStructure: "20 paylines with progressive jackpots. Base game max win 1,000x plus jackpot opportunities."
    }
  },
  {
    GameTitle: "Ancient Aztec Gold",
    GameID: "ancient-aztec-gold",
    Provider: "Temple Gaming",
    RTP: "96.4%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Mayan temple exploration with avalanche reels and increasing multipliers",
    UI_RulesModal: {
      Mechanics: "1. Avalanche feature removes winning symbols. 2. Consecutive avalanches increase multiplier (up to 15x). 3. Golden mask scatter triggers 12 free spins. 4. Additional spins awarded during bonus.",
      PayoutStructure: "729 ways to win on 6-reel layout. Maximum win 21,000x with avalanche multipliers."
    }
  },
  {
    GameTitle: "Baccarat Royale Supreme",
    GameID: "baccarat-royale-supreme",
    Provider: "Elite Table Games",
    RTP: "98.9%",
    Volatility: "Low",
    GameType: "Live",
    UI_ShortDescription: "Premium live baccarat with squeeze feature and full game history display",
    UI_RulesModal: {
      Mechanics: "1. Standard punto banco rules. 2. Player, Banker, or Tie bets accepted. 3. Card squeeze available for high rollers. 4. Side bets: Player/Banker pair, Perfect pair.",
      PayoutStructure: "Player pays 1:1, Banker pays 0.95:1 (5% commission), Tie pays 8:1. Pair bets pay 11:1."
    }
  },
  {
    GameTitle: "Neon City Nights",
    GameID: "neon-city-nights",
    Provider: "Urban Gaming",
    RTP: "96.8%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Futuristic 5x4 cyberpunk slot with stacked wilds and neon respins",
    UI_RulesModal: {
      Mechanics: "1. Stacked neon wilds on all reels. 2. Landing 2+ wilds triggers respin with locked wilds. 3. Scatter symbols award 15 free spins. 4. Win multipliers active during free spins.",
      PayoutStructure: "40 fixed paylines. Maximum win 12,500x. Respins can retrigger multiple times."
    }
  },
  {
    GameTitle: "Viking Conquest Saga",
    GameID: "viking-conquest-saga",
    Provider: "Nordic Legends",
    RTP: "97.0%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Norse mythology slot with shield wall feature and progressive free spins",
    UI_RulesModal: {
      Mechanics: "1. Shield wall feature collects special symbols for big wins. 2. 3, 4, or 5 scatters award 10, 15, or 20 free spins. 3. Each spin increases multiplier during bonus. 4. Ragnarok feature randomly transforms symbols.",
      PayoutStructure: "243 ways expanding to 3125 ways during bonus. Maximum payout 30,000x stake."
    }
  },
  {
    GameTitle: "Crash Rocket Multiplier",
    GameID: "crash-rocket-multiplier",
    Provider: "Quantum Gaming",
    RTP: "97.5%",
    Volatility: "High",
    GameType: "Crash",
    UI_ShortDescription: "Real-time crash game with auto-cashout and live multiplier up to 10,000x",
    UI_RulesModal: {
      Mechanics: "1. Place bet before rocket launches. 2. Cashout any time before crash. 3. Multiplier increases in real-time. 4. Auto-cashout settings available. 5. Watch live player cashouts.",
      PayoutStructure: "Multiplier-based payout. Cash out at 1.5x for safe wins or risk for 100x+ multipliers. Provably fair algorithm."
    }
  },
  {
    GameTitle: "Diamond Dynasty Deluxe",
    GameID: "diamond-dynasty-deluxe",
    Provider: "Jewel Gaming",
    RTP: "96.5%",
    Volatility: "Low",
    GameType: "Slot",
    UI_ShortDescription: "Classic luxury slot with 243 ways, expanding wilds, and frequent payouts",
    UI_RulesModal: {
      Mechanics: "1. Wild symbols expand to cover entire reel when part of a win. 2. 3+ diamond scatters trigger 10 free spins. 3. Retrigger possible during free spins. 4. High frequency of small to medium wins.",
      PayoutStructure: "243 ways to win. Maximum win 8,000x stake. Designed for extended play sessions."
    }
  },
  {
    GameTitle: "Egyptian Mysteries Unlimited",
    GameID: "egyptian-mysteries-unlimited",
    Provider: "Ancient Gaming",
    RTP: "96.9%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "5x3 Egyptian adventure featuring unlimited win multipliers in free spins",
    UI_RulesModal: {
      Mechanics: "1. Book scatter triggers 10 free spins with special expanding symbol. 2. Win multiplier increases by 1x after each winning spin (no limit). 3. Additional spins awarded by landing 3+ scatters during bonus.",
      PayoutStructure: "10 adjustable paylines. Maximum theoretical win unlimited with multipliers. Base game max 5,000x."
    }
  },
  {
    GameTitle: "Fruit Blitz Super Spin",
    GameID: "fruit-blitz-super-spin",
    Provider: "Classic Gaming",
    RTP: "97.2%",
    Volatility: "Low",
    GameType: "Slot",
    UI_ShortDescription: "Modern fruit machine with hold-and-spin feature and rapid gameplay",
    UI_RulesModal: {
      Mechanics: "1. Land 6+ bonus symbols to trigger hold-and-spin. 2. Bonus symbols reveal cash prizes or multipliers. 3. Three respins reset when new symbol lands. 4. Fill screen for Grand prize.",
      PayoutStructure: "5 paylines on 3x3 grid. Maximum win 2,500x. Hold-and-spin jackpots: Mini (20x), Minor (50x), Major (200x), Grand (1,000x)."
    }
  },
  {
    GameTitle: "Pirate's Plunder Megaways",
    GameID: "pirates-plunder-megaways",
    Provider: "High Seas Gaming",
    RTP: "96.6%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "6-reel pirate adventure with cascading wins and unlimited multipliers",
    UI_RulesModal: {
      Mechanics: "1. Megaways system up to 117,649 ways. 2. Cascading wins remove symbols for new ones. 3. Treasure map scatters award 12 free spins with progressive multipliers. 4. Buy bonus feature available.",
      PayoutStructure: "Variable paylines (Megaways). Maximum payout 20,000x. Multiplier increases by 1x per cascade during free spins."
    }
  },
  {
    GameTitle: "Starburst Crystal Classic",
    GameID: "starburst-crystal-classic",
    Provider: "Nova Gaming Studios",
    RTP: "96.3%",
    Volatility: "Low",
    GameType: "Slot",
    UI_ShortDescription: "Iconic 5x3 slot with expanding wilds and win-both-ways paylines",
    UI_RulesModal: {
      Mechanics: "1. Wins pay both left-to-right and right-to-left. 2. Wild symbols expand on reels 2, 3, and 4. 3. Expanded wilds remain for one respin. 4. Up to 3 respins possible with multiple wilds.",
      PayoutStructure: "10 paylines paying both ways (effectively 20). Maximum win 50,000 coins. High-frequency small wins."
    }
  },
  {
    GameTitle: "Buffalo Thunder Lightning",
    GameID: "buffalo-thunder-lightning",
    Provider: "Prairie Gaming",
    RTP: "96.7%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "4096 ways to win with mystery stacks and lightning respins feature",
    UI_RulesModal: {
      Mechanics: "1. Mystery stack symbols transform to any symbol. 2. Land 6+ gold coins for lightning respins. 3. Coin values are locked and respins reset with each new coin. 4. Four jackpot levels available.",
      PayoutStructure: "4096 ways to win on 6x4 grid. Maximum base win 5,000x. Jackpots: Mini (25x), Minor (100x), Major (500x), Mega (5,000x)."
    }
  },
  {
    GameTitle: "Zeus Power Reels",
    GameID: "zeus-power-reels",
    Provider: "Olympus Gaming",
    RTP: "96.8%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Greek mythology slot with power reels and lightning bolt multipliers",
    UI_RulesModal: {
      Mechanics: "1. Power reels feature adds extra wilds randomly. 2. Lightning bolts award instant multipliers (2x-10x). 3. 3+ scatter symbols trigger 15 free spins. 4. During free spins, lightning appears more frequently.",
      PayoutStructure: "50 paylines on 5x4 grid. Maximum win 10,000x stake. Multipliers stack during bonus rounds."
    }
  },
  {
    GameTitle: "Sugar Rush Candy Blitz",
    GameID: "sugar-rush-candy-blitz",
    Provider: "Sweet Gaming",
    RTP: "96.4%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Cluster pays candy slot with multiplier spots and free tumbles feature",
    UI_RulesModal: {
      Mechanics: "1. 5+ matching symbols in cluster wins. 2. Winning symbols tumble away for new ones. 3. Special spots reveal multipliers up to 128x. 4. Free tumbles triggered by scatter symbols.",
      PayoutStructure: "Cluster pays on 7x7 grid. Maximum win 5,000x. Multiplier spots combine for bigger wins."
    }
  },
  {
    GameTitle: "Moon Princess Trinity",
    GameID: "moon-princess-trinity",
    Provider: "Anime Slots",
    RTP: "96.5%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Anime-themed 5x5 cascade slot with three princess powers and multipliers",
    UI_RulesModal: {
      Mechanics: "1. Three princesses grant special powers randomly. 2. Cascade wins increase multiplier (up to 20x). 3. Clear grid to trigger Trinity feature. 4. Trinity awards free spins with selected princess power.",
      PayoutStructure: "Cascade system on 5x5 grid. Maximum payout 15,000x. Each princess offers unique wild patterns."
    }
  },
  {
    GameTitle: "Roulette Pro European",
    GameID: "roulette-pro-european",
    Provider: "Elite Table Games",
    RTP: "97.3%",
    Volatility: "Low",
    GameType: "Table",
    UI_ShortDescription: "Classic European roulette with statistics tracker and quick bet options",
    UI_RulesModal: {
      Mechanics: "1. Single zero European wheel (37 numbers). 2. Inside bets: Straight, Split, Street, Corner, Line. 3. Outside bets: Red/Black, Even/Odd, Dozens, Columns. 4. Neighbor bets and special tracks available.",
      PayoutStructure: "Straight up pays 35:1, Split 17:1, Street 11:1, Corner 8:1, Line 5:1. Even money bets pay 1:1."
    }
  },
  {
    GameTitle: "Aztec Bonanza Infinity",
    GameID: "aztec-bonanza-infinity",
    Provider: "Temple Gaming",
    RTP: "96.6%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Expanding reels system that grows to 8x8 with thousands of paylines",
    UI_RulesModal: {
      Mechanics: "1. Grid starts at 5x5 and expands with wins. 2. Reach 8x8 for maximum 262,144 ways. 3. Golden symbol collections trigger free spins. 4. Reels reset between base spins but maintain size in bonus.",
      PayoutStructure: "Variable ways to win (up to 262,144). Maximum payout 10,000x. Progressive reel expansion."
    }
  },
  {
    GameTitle: "Mega Moolah Fortune",
    GameID: "mega-moolah-fortune",
    Provider: "Progressive Network",
    RTP: "95.9%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Legendary progressive jackpot slot with four-tier prize wheel",
    UI_RulesModal: {
      Mechanics: "1. Random jackpot wheel trigger on any spin. 2. Wheel awards one of four progressive jackpots. 3. Base game features expanding wilds and free spins. 4. Mega jackpot averages $5,000,000.",
      PayoutStructure: "25 paylines. Jackpots: Mini (starts at $10), Minor ($100), Major ($10,000), Mega ($1,000,000+). Base max win 1,125x."
    }
  },
  {
    GameTitle: "Dead or Alive Outlaw",
    GameID: "dead-or-alive-outlaw",
    Provider: "Frontier Gaming",
    RTP: "96.8%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "High volatility western with sticky wild free spins and massive potential",
    UI_RulesModal: {
      Mechanics: "1. Land 3+ scatters for 12 free spins. 2. Wild symbols stick in place for all free spins. 3. Additional spins awarded for more scatters during bonus. 4. Line wins pay from leftmost reel.",
      PayoutStructure: "9 paylines on 5x3 grid. Maximum win 12,000x stake. Extended dry spells possible but huge bonus potential."
    }
  },
  {
    GameTitle: "Jammin' Jars Cluster Party",
    GameID: "jammin-jars-cluster-party",
    Provider: "Sweet Gaming",
    RTP: "96.8%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "8x8 cluster pays with moving wilds and progressive multipliers",
    UI_RulesModal: {
      Mechanics: "1. 5+ matching symbols in cluster wins. 2. Rainbow wild jars increase multiplier with each cascade. 3. Wilds move to new positions after each win. 4. Free spins triggered by filling 3+ jars.",
      PayoutStructure: "Cluster pays system on 8x8 grid. Maximum win 20,000x. Wild multipliers stack during cascades."
    }
  },
  {
    GameTitle: "Book of Secrets Deluxe",
    GameID: "book-of-secrets-deluxe",
    Provider: "Ancient Gaming",
    RTP: "96.5%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Egyptian book-style slot with expanding symbols and gamble feature",
    UI_RulesModal: {
      Mechanics: "1. Book scatter triggers 10 free spins. 2. Special expanding symbol selected before spins. 3. Expanding symbol fills entire reel when appearing. 4. Gamble feature available to double wins.",
      PayoutStructure: "10 paylines on 5x3 grid. Maximum win 5,000x base game, enhanced during free spins. Gamble up to 5 times."
    }
  },
  {
    GameTitle: "Gonzo's Quest Megaways",
    GameID: "gonzos-quest-megaways",
    Provider: "Expedition Gaming",
    RTP: "96.0%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Avalanche reels with increasing multipliers and earthquake feature",
    UI_RulesModal: {
      Mechanics: "1. Megaways up to 117,649 ways to win. 2. Avalanche feature with increasing multipliers (1x-5x base, 3x-15x free spins). 3. Earthquake feature randomly destroys low-value symbols. 4. Free spins triggered by 3+ scatter symbols.",
      PayoutStructure: "Variable Megaways system. Maximum payout 21,000x. Multipliers increase: 1x→2x→3x→5x per consecutive avalanche."
    }
  },
  {
    GameTitle: "Bonanza Goldmine Megaways",
    GameID: "bonanza-goldmine-megaways",
    Provider: "Mining Gaming",
    RTP: "96.4%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "6-reel mining adventure with free spins and unlimited win multipliers",
    UI_RulesModal: {
      Mechanics: "1. Up to 117,649 Megaways. 2. 4 scatter symbols trigger 12 free spins. 3. Win multiplier increases by +1 after each cascade (no limit). 4. Additional spins awarded by +5 for 4 scatters during bonus.",
      PayoutStructure: "Megaways system with horizontal reel. Maximum theoretical win unlimited via multipliers. Recorded max 10,000x+."
    }
  },
  {
    GameTitle: "Legacy of Egypt Power",
    GameID: "legacy-of-egypt-power",
    Provider: "Ancient Gaming",
    RTP: "96.5%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "5x3 Egyptian slot with wheel of gods and multiplier free spins",
    UI_RulesModal: {
      Mechanics: "1. Wheel of Gods triggered by 3+ pyramid scatters. 2. Wheel awards free spins (5-20) with multipliers (2x-10x). 3. During free spins, wild symbols appear with multipliers. 4. Collect ankh symbols for extra spins.",
      PayoutStructure: "30 paylines. Maximum win 15,000x. Wheel multipliers apply to all wins during free spins."
    }
  },
  {
    GameTitle: "Immortal Romance Remastered",
    GameID: "immortal-romance-remastered",
    Provider: "Gothic Gaming",
    RTP: "96.9%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Vampire-themed 243-ways slot with four unique free spin chambers",
    UI_RulesModal: {
      Mechanics: "1. Four free spin features unlock progressively. 2. Amber: 10 spins with 5x multiplier. 3. Troy: 15 spins with vampire bat feature. 4. Michael: 20 spins with rolling reels. 5. Sarah: 25 spins with wild vine.",
      PayoutStructure: "243 ways to win. Maximum payout 12,150x. Each chamber offers different volatility and win potential."
    }
  },
  {
    GameTitle: "Fire Joker Respin",
    GameID: "fire-joker-respin",
    Provider: "Classic Gaming",
    RTP: "96.2%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "3x3 classic slot with respin-until-win feature and wheel of multipliers",
    UI_RulesModal: {
      Mechanics: "1. Two matching symbols trigger respin of third reel. 2. Fill screen with same symbol for Wheel of Multipliers. 3. Wheel awards 2x to 10x multiplier on win. 4. Simple, fast-paced gameplay.",
      PayoutStructure: "5 paylines on 3x3 grid. Maximum win 800x base, up to 8,000x with wheel multiplier."
    }
  },
  {
    GameTitle: "Reactoonz Quantum Leap",
    GameID: "reactoonz-quantum-leap",
    Provider: "Alien Gaming",
    RTP: "96.5%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "7x7 alien cluster slot with quantum features and fluctuation patterns",
    UI_RulesModal: {
      Mechanics: "1. 5+ matching symbols in cluster wins. 2. Quantum features activate randomly: Implosion, Incision, Demolition. 3. Fill charge meter to summon Gargantoon wild. 4. Gargantoon splits into smaller wilds.",
      PayoutStructure: "Cluster pays on 7x7 grid. Maximum win 4,570x. Multiple quantum features can trigger per spin."
    }
  },
  {
    GameTitle: "Street Racer Nitro",
    GameID: "street-racer-nitro",
    Provider: "Speed Gaming",
    RTP: "96.6%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Racing-themed 5x3 slot with nitro spins and mystery symbols",
    UI_RulesModal: {
      Mechanics: "1. Mystery symbols reveal matching symbols. 2. Nitro scatter triggers nitro spins (10 spins). 3. During nitro spins, collect fuel cans for multipliers. 4. Race feature awards instant cash prizes.",
      PayoutStructure: "25 paylines. Maximum win 2,000x stake. Nitro spin multipliers stack up to 10x."
    }
  },
  {
    GameTitle: "Tiki Fortune Totem",
    GameID: "tiki-fortune-totem",
    Provider: "Island Gaming",
    RTP: "96.3%",
    Volatility: "Low",
    GameType: "Slot",
    UI_ShortDescription: "Tropical 3x3 slot with nudging totems and frequent small wins",
    UI_RulesModal: {
      Mechanics: "1. Totem symbols nudge reels to create wins. 2. Matching 3 symbols horizontally or diagonally wins. 3. Coconut symbol awards instant prizes. 4. High hit frequency with small to medium payouts.",
      PayoutStructure: "5 paylines on 3x3 grid. Maximum win 1,000x. Designed for extended play with regular wins."
    }
  },
  {
    GameTitle: "Tomb Raider Expedition",
    GameID: "tomb-raider-expedition",
    Provider: "Adventure Gaming",
    RTP: "96.7%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Adventure slot with free spins, rolling reels, and global adventure bonus",
    UI_RulesModal: {
      Mechanics: "1. Rolling reels with multipliers up to 5x. 2. Idol scatter triggers 10 free spins. 3. Global adventure bonus awards instant prizes and multipliers. 4. Super mode randomly activates with guaranteed wins.",
      PayoutStructure: "15 paylines on 5x3 grid. Maximum win 7,500x. Rolling reels continue until no new wins."
    }
  },
  {
    GameTitle: "Space Invaders Arcade",
    GameID: "space-invaders-arcade",
    Provider: "Retro Gaming",
    RTP: "96.1%",
    Volatility: "Low",
    GameType: "Slot",
    UI_ShortDescription: "Arcade-style 5x3 slot with UFO feature and cannon wild respins",
    UI_RulesModal: {
      Mechanics: "1. Cannon wild shoots to create additional wilds. 2. UFO feature awards random multipliers. 3. Free spins with enhanced cannon feature. 4. Classic arcade sounds and visuals.",
      PayoutStructure: "10 paylines. Maximum win 3,750x. UFO multipliers range from 2x to 50x."
    }
  },
  {
    GameTitle: "Rainbow Riches Megaways",
    GameID: "rainbow-riches-megaways",
    Provider: "Lucky Gaming",
    RTP: "96.5%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Irish luck theme with cascading reels and multiple bonus features",
    UI_RulesModal: {
      Mechanics: "1. Megaways up to 117,649 ways. 2. Cascading reels remove winning symbols. 3. Three bonus features: Road to Riches, Wishing Well, Pots of Gold. 4. Random modifiers in base game.",
      PayoutStructure: "Variable Megaways. Maximum win 10,000x. Each bonus feature offers different rewards."
    }
  },
  {
    GameTitle: "Wolf Gold Moon Spin",
    GameID: "wolf-gold-moon-spin",
    Provider: "Wildlife Gaming",
    RTP: "96.0%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "5x3 wildlife slot with money respin feature and three fixed jackpots",
    UI_RulesModal: {
      Mechanics: "1. Land 6+ moon symbols for money respin. 2. Respins reset when new moon lands. 3. Fill screen for Mega jackpot. 4. Free spins with giant 3x3 symbols.",
      PayoutStructure: "25 paylines. Jackpots: Mini (30x), Major (100x), Mega (1,000x). Maximum base win 5,000x."
    }
  },
  {
    GameTitle: "Poker Face Texas Hold'em",
    GameID: "poker-face-texas-holdem",
    Provider: "Elite Table Games",
    RTP: "99.0%",
    Volatility: "Medium",
    GameType: "Table",
    UI_ShortDescription: "Classic Texas Hold'em poker with side bets and tournament mode",
    UI_RulesModal: {
      Mechanics: "1. Standard Texas Hold'em rules. 2. Trips Plus side bet available. 3. Bad beat bonus on qualifying hands. 4. Multi-table tournament option.",
      PayoutStructure: "Ante pays 1:1 on qualifying hands. Trips Plus pays up to 40:1 for trips or better. Bad beat bonus pays up to 100:1."
    }
  },
  {
    GameTitle: "Jungle Adventure Expedition",
    GameID: "jungle-adventure-expedition",
    Provider: "Exploration Gaming",
    RTP: "96.4%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "6-reel jungle trek with mystery masks and expanding free spins",
    UI_RulesModal: {
      Mechanics: "1. Mystery masks reveal matching symbols. 2. 4+ idol scatters trigger expedition spins. 3. Reels expand during expedition: 4 scatters=6x4, 5 scatters=6x5, 6 scatters=6x6. 4. Wild multipliers active during free spins.",
      PayoutStructure: "4096 ways base game, up to 46,656 ways during expedition. Maximum win 50,000x."
    }
  },
  {
    GameTitle: "Mega Ball Live",
    GameID: "mega-ball-live",
    Provider: "Live Studio Games",
    RTP: "95.4%",
    Volatility: "Medium",
    GameType: "Live",
    UI_ShortDescription: "Live bingo-style game with mega ball multiplier and up to 1,000,000x win",
    UI_RulesModal: {
      Mechanics: "1. Purchase 1-200 cards before draw begins. 2. 20 balls drawn first for line and card wins. 3. Mega Ball drawn last with multiplier (5x-100x). 4. Multiple winning patterns available.",
      PayoutStructure: "Lines pay up to 50:1, full cards up to 10,000:1. Mega Ball multiplier applies to final ball wins. Maximum payout 1,000,000x."
    }
  },
  {
    GameTitle: "Gladiator Arena Champion",
    GameID: "gladiator-arena-champion",
    Provider: "Epic Gaming",
    RTP: "96.8%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Roman colosseum slot with battle feature and champion multipliers",
    UI_RulesModal: {
      Mechanics: "1. Battle feature randomly awards multipliers or extra wilds. 2. 3+ scatters trigger arena free spins. 3. Collect helmets to upgrade gladiator level (increases multipliers). 4. Champion level unlocks maximum volatility mode.",
      PayoutStructure: "40 paylines on 5x4 grid. Maximum win 10,000x. Multipliers stack during free spins (up to 20x)."
    }
  },
  {
    GameTitle: "Fortune Tiger Prosperity",
    GameID: "fortune-tiger-prosperity",
    Provider: "Eastern Legends",
    RTP: "96.7%",
    Volatility: "Medium",
    GameType: "Slot",
    UI_ShortDescription: "Asian 3x3 slot with multiplier reveal feature and respins",
    UI_RulesModal: {
      Mechanics: "1. Match 3 symbols horizontally for win. 2. Gold tiger reveals multipliers (2x-10x). 3. Two matching reels trigger respin of third reel. 4. Fortune coin scatter awards instant prizes.",
      PayoutStructure: "5 paylines on 3x3 grid. Maximum win 2,500x. Multipliers apply to all wins on that spin."
    }
  },
  {
    GameTitle: "Fishing Frenzy Megaways",
    GameID: "fishing-frenzy-megaways",
    Provider: "Aquatic Gaming",
    RTP: "96.1%",
    Volatility: "High",
    GameType: "Slot",
    UI_ShortDescription: "Underwater fishing theme with free spins and prize fish collection",
    UI_RulesModal: {
      Mechanics: "1. Megaways up to 15,625 ways. 2. Scatter triggers 10 free spins. 3. Fisherman collects all prize fish values during free spins. 4. Additional spins awarded for 3+ scatters in bonus.",
      PayoutStructure: "Variable Megaways on 5-reel layout. Maximum win 10,000x. Prize fish values range from 2x to 1,000x."
    }
  }
];

export const paymentMethods = [
  {
    id: "VISA/MC",
    name: "Credit/Debit Card",
    description: "Instant deposit. Secure 3D authentication required. Withdrawal unavailable via this method.",
    icon: "CreditCard"
  },
  {
    id: "E-Wallet",
    name: "Skrill/NETELLER",
    description: "Fastest withdrawals (typically under 2 hours). Deposits are instant.",
    icon: "Wallet"
  },
  {
    id: "BankTransfer",
    name: "Local Bank Transfer (PayID/Poli)",
    description: "Secure, direct transfer. Deposits take 1-3 minutes. Withdrawals require 1-3 business days.",
    icon: "Building2"
  },
  {
    id: "Crypto",
    name: "Cryptocurrency (BTC/ETH/USDT)",
    description: "Decentralized and rapid transactions. Near-instant deposits. Withdrawals processed within 15 minutes.",
    icon: "Bitcoin"
  }
];
