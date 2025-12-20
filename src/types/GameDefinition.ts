import { z } from "zod";

/**
 * Zod schema for game_definitions.json validation
 * Ensures type safety at runtime
 */
export const GameDefinitionSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  rtp: z.union([z.number(), z.string()]).transform((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num) || num < 0 || num > 100) {
      throw new Error(`Invalid RTP: ${val}`);
    }
    return num;
  }),
  vol: z.enum(['High', 'Med', 'Medium', 'Low', 'Extreme']).transform((val) => {
    // Normalize Med to Medium
    return val === 'Med' ? 'Medium' : val;
  }),
  type: z.enum([
    'Tumble',
    'Scatter',
    'HoldAndWin',
    'Megaways',
    'Cluster',
    'Collect',
    'Classic',
    'Crash',
    'Jackpot',
    'Table'
  ]),
});

export type GameDefinition = z.infer<typeof GameDefinitionSchema>;

/**
 * Validate game definitions array
 */
export function validateGameDefinitions(games: unknown): GameDefinition[] {
  const schema = z.array(GameDefinitionSchema);
  return schema.parse(games);
}

