// Complete 78-Card Tarot Deck (Major + Minor Arcana)
// Based on traditional Rider-Waite-Smith system with mystical interpretations

export interface TarotCard {
  id: number;
  name: string;
  meaning: string;
  reversed?: string;
  symbol: string;
  color: string;
  category: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
}

// Major Arcana (22 cards) - The Fool's Journey
export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, name: 'The Fool', meaning: 'New beginnings, innocence, spontaneity, free spirit', reversed: 'Recklessness, risk-taking, poor judgment', symbol: '🎭', color: 'from-yellow-400 to-amber-500', category: 'major' },
  { id: 1, name: 'The Magician', meaning: 'Manifestation, resourcefulness, power, creation', reversed: 'Manipulation, poor planning, untapped talents', symbol: '⚡', color: 'from-purple-600 to-indigo-800', category: 'major' },
  { id: 2, name: 'The High Priestess', meaning: 'Intuition, unconscious knowledge, inner voice', reversed: 'Secrets, disconnected from intuition, withdrawal', symbol: '🌙', color: 'from-blue-600 to-purple-800', category: 'major' },
  { id: 3, name: 'The Empress', meaning: 'Femininity, beauty, nature, nurturing, abundance', reversed: 'Creative block, dependence on others, emptiness', symbol: '👑', color: 'from-green-500 to-emerald-600', category: 'major' },
  { id: 4, name: 'The Emperor', meaning: 'Authority, structure, control, fatherhood', reversed: 'Domination, excessive control, rigidity', symbol: '🏛️', color: 'from-amber-600 to-orange-700', category: 'major' },
  { id: 5, name: 'The Hierophant', meaning: 'Tradition, conformity, morality, ethics', reversed: 'Rebellion, subversiveness, new approaches', symbol: '📿', color: 'from-blue-600 to-indigo-700', category: 'major' },
  { id: 6, name: 'The Lovers', meaning: 'Love, harmony, relationships, values alignment', reversed: 'Self-love, disharmony, imbalance, misalignment', symbol: '💑', color: 'from-pink-500 to-rose-600', category: 'major' },
  { id: 7, name: 'The Chariot', meaning: 'Control, willpower, success, action, determination', reversed: 'Lack of control, aggression, no direction', symbol: '🏛️', color: 'from-blue-500 to-cyan-600', category: 'major' },
  { id: 8, name: 'Strength', meaning: 'Strength, courage, persuasion, influence, compassion', reversed: 'Weakness, self-doubt, inner strength', symbol: '🦁', color: 'from-orange-500 to-red-600', category: 'major' },
  { id: 9, name: 'The Hermit', meaning: 'Soul searching, introspection, inner guidance', reversed: 'Isolation, withdrawal, rejection', symbol: '🕯️', color: 'from-gray-600 to-slate-700', category: 'major' },
  { id: 10, name: 'Wheel of Fortune', meaning: 'Good luck, karma, life cycles, destiny', reversed: 'Bad luck, resistance to change, breaking cycles', symbol: '🎡', color: 'from-purple-500 to-pink-600', category: 'major' },
  { id: 11, name: 'Justice', meaning: 'Justice, fairness, truth, cause and effect', reversed: 'Unfairness, lack of accountability, dishonesty', symbol: '⚖️', color: 'from-yellow-600 to-amber-700', category: 'major' },
  { id: 12, name: 'The Hanged Man', meaning: 'Pause, surrender, letting go, new perspectives', reversed: 'Delays, resistance, stalling, needless sacrifice', symbol: '🙏', color: 'from-indigo-600 to-purple-700', category: 'major' },
  { id: 13, name: 'Death', meaning: 'Endings, change, transformation, transition', reversed: 'Resistance to change, inability to move on', symbol: '💀', color: 'from-gray-700 to-black', category: 'major' },
  { id: 14, name: 'Temperance', meaning: 'Balance, moderation, patience, purpose', reversed: 'Imbalance, excess, lack of long-term vision', symbol: '⚖️', color: 'from-teal-500 to-cyan-600', category: 'major' },
  { id: 15, name: 'The Devil', meaning: 'Shadow self, attachment, addiction, restriction', reversed: 'Reclaiming power, freedom, release', symbol: '😈', color: 'from-red-700 to-black', category: 'major' },
  { id: 16, name: 'The Tower', meaning: 'Sudden change, upheaval, chaos, revelation', reversed: 'Personal transformation, fear of change, disaster avoidance', symbol: '⚡', color: 'from-red-600 to-orange-700', category: 'major' },
  { id: 17, name: 'The Star', meaning: 'Hope, faith, purpose, renewal, spirituality', reversed: 'Lack of faith, despair, self-trust issues', symbol: '⭐', color: 'from-cyan-500 to-blue-600', category: 'major' },
  { id: 18, name: 'The Moon', meaning: 'Illusion, fear, anxiety, subconscious, intuition', reversed: 'Release of fear, repressed emotion, inner confusion', symbol: '🌙', color: 'from-slate-600 to-blue-800', category: 'major' },
  { id: 19, name: 'The Sun', meaning: 'Positivity, fun, warmth, success, vitality', reversed: 'Inner child, feeling down, overly optimistic', symbol: '☀️', color: 'from-yellow-500 to-orange-600', category: 'major' },
  { id: 20, name: 'Judgment', meaning: 'Reflection, evaluation, awakening, renewal', reversed: 'Lack of self-awareness, doubt, self-loathing', symbol: '📯', color: 'from-purple-600 to-indigo-700', category: 'major' },
  { id: 21, name: 'The World', meaning: 'Completion, accomplishment, travel, fulfillment', reversed: 'Incompletion, lack of closure, stagnation', symbol: '🌍', color: 'from-emerald-600 to-teal-700', category: 'major' },
];

// Minor Arcana - Wands (Fire, Action, Creativity)
const WANDS: TarotCard[] = Array.from({ length: 14 }, (_, i) => ({
  id: 22 + i,
  name: i === 0 ? 'Ace of Wands' : i < 11 ? `${i} of Wands` : i === 11 ? 'Page of Wands' : i === 12 ? 'Knight of Wands' : i === 13 ? 'Queen of Wands' : 'King of Wands',
  meaning: i === 0 ? 'Inspiration, new opportunities, growth, potential' : 
           i < 11 ? `Action, movement, progress, creativity (${i})` :
           i === 11 ? 'Exploration, excitement, free spirit' :
           i === 12 ? 'Energy, passion, adventure, impulsiveness' :
           i === 13 ? 'Courage, determination, confidence' :
           'Natural-born leader, vision, entrepreneurship',
  symbol: '🔥',
  color: 'from-orange-500 to-red-600',
  category: 'wands',
  number: i === 0 ? undefined : i < 11 ? i : undefined,
}));

// Minor Arcana - Cups (Water, Emotions, Relationships)
const CUPS: TarotCard[] = Array.from({ length: 14 }, (_, i) => ({
  id: 36 + i,
  name: i === 0 ? 'Ace of Cups' : i < 11 ? `${i} of Cups` : i === 11 ? 'Page of Cups' : i === 12 ? 'Knight of Cups' : i === 13 ? 'Queen of Cups' : 'King of Cups',
  meaning: i === 0 ? 'New feelings, spirituality, intuition' :
           i < 11 ? `Emotions, relationships, creativity (${i})` :
           i === 11 ? 'Creative opportunities, intuitive messages' :
           i === 12 ? 'Following the heart, idealistic, romantic' :
           i === 13 ? 'Compassion, calm, comfort' :
           'Emotional balance, diplomacy, control',
  symbol: '💧',
  color: 'from-blue-400 to-cyan-600',
  category: 'cups',
  number: i === 0 ? undefined : i < 11 ? i : undefined,
}));

// Minor Arcana - Swords (Air, Intellect, Challenges)
const SWORDS: TarotCard[] = Array.from({ length: 14 }, (_, i) => ({
  id: 50 + i,
  name: i === 0 ? 'Ace of Swords' : i < 11 ? `${i} of Swords` : i === 11 ? 'Page of Swords' : i === 12 ? 'Knight of Swords' : i === 13 ? 'Queen of Swords' : 'King of Swords',
  meaning: i === 0 ? 'Breakthrough, clarity, sharp mind' :
           i < 11 ? `Challenges, conflict, mental clarity (${i})` :
           i === 11 ? 'New ideas, curiosity, thirst for knowledge' :
           i === 12 ? 'Action, impulsiveness, defending beliefs' :
           i === 13 ? 'Clear boundaries, direct communication' :
           'Mental clarity, intellectual power, truth',
  symbol: '⚔️',
  color: 'from-gray-400 to-slate-600',
  category: 'swords',
  number: i === 0 ? undefined : i < 11 ? i : undefined,
}));

// Minor Arcana - Pentacles (Earth, Material, Practical)
const PENTACLES: TarotCard[] = Array.from({ length: 14 }, (_, i) => ({
  id: 64 + i,
  name: i === 0 ? 'Ace of Pentacles' : i < 11 ? `${i} of Pentacles` : i === 11 ? 'Page of Pentacles' : i === 12 ? 'Knight of Pentacles' : i === 13 ? 'Queen of Pentacles' : 'King of Pentacles',
  meaning: i === 0 ? 'New opportunity, prosperity, security' :
           i < 11 ? `Material aspects, security, practicality (${i})` :
           i === 11 ? 'Desire for new venture, learning' :
           i === 12 ? 'Efficiency, hard work, routine' :
           i === 13 ? 'Practical, nurturing, financially independent' :
           'Security, control, discipline, abundance',
  symbol: '💰',
  color: 'from-amber-500 to-yellow-600',
  category: 'pentacles',
  number: i === 0 ? undefined : i < 11 ? i : undefined,
}));

export const FULL_TAROT_DECK: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...WANDS,
  ...CUPS,
  ...SWORDS,
  ...PENTACLES,
];

// Collective Reading Spreads
export interface TarotSpread {
  name: string;
  cards: number;
  positions: string[];
  description: string;
}

export const TAROT_SPREADS: TarotSpread[] = [
  {
    name: 'Daily Single Card',
    cards: 1,
    positions: ['Today\'s Energy'],
    description: 'A single card for daily guidance',
  },
  {
    name: 'Past, Present, Future',
    cards: 3,
    positions: ['Past', 'Present', 'Future'],
    description: 'Understanding your timeline',
  },
  {
    name: 'Celtic Cross',
    cards: 10,
    positions: ['Present', 'Challenge', 'Distant Past', 'Recent Past', 'Possible Future', 'Near Future', 'You', 'Environment', 'Hopes/Fears', 'Outcome'],
    description: 'Comprehensive life reading',
  },
  {
    name: 'Shadow Work',
    cards: 3,
    positions: ['Light Self', 'Shadow Self', 'Integration'],
    description: 'Jungian shadow integration',
  },
];

// Get collective daily reading (same for everyone, updates every 10 hours)
export const getCollectiveDailyReading = (): { card: TarotCard; reversed: boolean; message: string } => {
  // Calculate 10-hour periods since epoch
  const tenHourPeriods = Math.floor(Date.now() / (10 * 60 * 60 * 1000));
  
  // Use period to select card (deterministic)
  const cardIndex = tenHourPeriods % FULL_TAROT_DECK.length;
  const card = FULL_TAROT_DECK[cardIndex];
  
  // Determine if reversed (based on period)
  const reversed = tenHourPeriods % 2 === 0;
  
  // Generate collective message
  const message = reversed 
    ? `The Collective reveals: ${card.reversed || card.meaning}. This reversed card suggests a need for reflection.`
    : `The Collective reveals: ${card.meaning}. This card guides the community today.`;
  
  return { card, reversed, message };
};

