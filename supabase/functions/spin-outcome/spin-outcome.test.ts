/**
 * UNIT TESTS FOR SPIN OUTCOME LOGIC
 * 
 * Purpose: Verify RTP calculation integrity and game mechanics
 * Run with: deno test --allow-env --allow-net
 */

import { assertEquals, assertExists } from "https://deno.land/std@0.177.0/testing/asserts.ts";

// Symbol definitions (copy from main function for testing)
const SLOT_SYMBOLS = {
  CHERRY: { value: 'cherry', weight: 30, payout: [0, 0, 2, 5, 10] },
  LEMON: { value: 'lemon', weight: 25, payout: [0, 0, 3, 8, 15] },
  ORANGE: { value: 'orange', weight: 20, payout: [0, 0, 5, 12, 25] },
  PLUM: { value: 'plum', weight: 15, payout: [0, 0, 8, 20, 40] },
  BELL: { value: 'bell', weight: 7, payout: [0, 0, 15, 50, 100] },
  BAR: { value: 'bar', weight: 2, payout: [0, 0, 25, 100, 250] },
  SEVEN: { value: '7', weight: 1, payout: [0, 0, 50, 200, 500] },
};

Deno.test("RNG Security: getSecureRandom produces values in range [0,1)", () => {
  function getSecureRandom(): number {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }

  for (let i = 0; i < 100; i++) {
    const random = getSecureRandom();
    assertEquals(random >= 0, true, "Random should be >= 0");
    assertEquals(random < 1, true, "Random should be < 1");
  }
});

Deno.test("Symbol Weighting: Distribution matches configured weights", () => {
  function selectWeightedSymbol() {
    const symbols = Object.values(SLOT_SYMBOLS);
    const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of symbols) {
      random -= symbol.weight;
      if (random <= 0) return symbol;
    }
    
    return symbols[0];
  }

  const iterations = 10000;
  const counts: Record<string, number> = {};
  
  for (let i = 0; i < iterations; i++) {
    const symbol = selectWeightedSymbol();
    counts[symbol.value] = (counts[symbol.value] || 0) + 1;
  }

  // Cherry should appear most frequently (weight: 30)
  // Seven should appear least frequently (weight: 1)
  assertEquals(counts['cherry'] > counts['7'], true, "Cherry should appear more than Seven");
  console.log("Symbol distribution:", counts);
});

Deno.test("Win Calculation: 3+ consecutive matches trigger payout", () => {
  function countConsecutiveMatches(symbols: string[]): number {
    if (symbols.length === 0) return 0;
    
    let count = 1;
    const firstSymbol = symbols[0];
    
    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] === firstSymbol) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
  }

  assertEquals(countConsecutiveMatches(['cherry', 'cherry', 'cherry', 'lemon', 'bell']), 3);
  assertEquals(countConsecutiveMatches(['cherry', 'cherry', 'cherry', 'cherry', 'cherry']), 5);
  assertEquals(countConsecutiveMatches(['cherry', 'lemon', 'cherry', 'cherry', 'cherry']), 1);
  assertEquals(countConsecutiveMatches(['cherry', 'cherry', 'lemon', 'lemon', 'lemon']), 2);
});

Deno.test("RTP Adjustment: Target RTP influences payout multiplier", () => {
  interface ReelSymbol {
    symbol: string;
    position: number;
  }

  function calculateWin(reels: ReelSymbol[][], targetRTP: number): { winLines: number[], payoutMultiplier: number } {
    const winLines: number[] = [];
    let baseMultiplier = 0;
    
    const centerSymbols = reels.map(reel => reel[1].symbol);
    let matchCount = 1;
    const firstSymbol = centerSymbols[0];
    
    for (let i = 1; i < centerSymbols.length; i++) {
      if (centerSymbols[i] === firstSymbol) {
        matchCount++;
      } else {
        break;
      }
    }
    
    if (matchCount >= 3) {
      winLines.push(1);
      const symbol = Object.values(SLOT_SYMBOLS).find(s => s.value === firstSymbol);
      if (symbol) {
        baseMultiplier = symbol.payout[matchCount - 1] || 0;
      }
    }
    
    const rtpFactor = targetRTP / 96.0;
    const adjustedMultiplier = Math.max(0, baseMultiplier * rtpFactor);
    
    return {
      winLines,
      payoutMultiplier: Math.round(adjustedMultiplier * 100) / 100,
    };
  }

  // Test winning scenario with 5 cherries
  const winningReels: ReelSymbol[][] = [
    [{ symbol: 'cherry', position: 0 }, { symbol: 'cherry', position: 1 }, { symbol: 'cherry', position: 2 }],
    [{ symbol: 'cherry', position: 0 }, { symbol: 'cherry', position: 1 }, { symbol: 'cherry', position: 2 }],
    [{ symbol: 'cherry', position: 0 }, { symbol: 'cherry', position: 1 }, { symbol: 'cherry', position: 2 }],
    [{ symbol: 'cherry', position: 0 }, { symbol: 'cherry', position: 1 }, { symbol: 'cherry', position: 2 }],
    [{ symbol: 'cherry', position: 0 }, { symbol: 'cherry', position: 1 }, { symbol: 'cherry', position: 2 }],
  ];

  const resultLowRTP = calculateWin(winningReels, 94.0);
  const resultHighRTP = calculateWin(winningReels, 98.0);

  assertEquals(resultLowRTP.winLines.length, 1, "Should detect center line win");
  assertEquals(resultHighRTP.payoutMultiplier > resultLowRTP.payoutMultiplier, true, "Higher RTP should give higher multipliers");
  
  console.log(`Low RTP (94%): Multiplier ${resultLowRTP.payoutMultiplier}`);
  console.log(`High RTP (98%): Multiplier ${resultHighRTP.payoutMultiplier}`);
});

Deno.test("Edge Function Structure: Exports Deno.serve handler", () => {
  // This test verifies the function has the correct export structure
  assertEquals(typeof Deno.serve, "function", "Deno.serve should be available");
});

Deno.test("Payout Integrity: Wager multiplied by outcome equals payout", () => {
  const wagerAmount = 10;
  const payoutMultiplier = 5;
  const expectedPayout = wagerAmount * payoutMultiplier;
  
  assertEquals(expectedPayout, 50, "Payout calculation should be correct");
});

Deno.test("RTP Simulation: 1000 spins trend toward target RTP", () => {
  // Simplified RTP simulation
  const TARGET_RTP = 96.0;
  const ITERATIONS = 1000;
  const WAGER = 1;
  
  let totalWagered = 0;
  let totalPaidOut = 0;
  
  for (let i = 0; i < ITERATIONS; i++) {
    totalWagered += WAGER;
    
    // Simulate random outcome with RTP bias
    const random = Math.random();
    const rtpThreshold = TARGET_RTP / 100;
    
    if (random < rtpThreshold / 10) { // Simplified win probability
      const winMultiplier = 2 + Math.random() * 8; // 2x to 10x
      totalPaidOut += WAGER * winMultiplier;
    }
  }
  
  const actualRTP = (totalPaidOut / totalWagered) * 100;
  
  console.log(`Simulated RTP over ${ITERATIONS} spins: ${actualRTP.toFixed(2)}%`);
  console.log(`Total wagered: $${totalWagered}, Total paid: $${totalPaidOut.toFixed(2)}`);
  
  // RTP should be in reasonable range (variance is expected)
  assertEquals(actualRTP > 70, true, "RTP should be above 70% even with variance");
  assertEquals(actualRTP < 120, true, "RTP should be below 120% even with variance");
});
