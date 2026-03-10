import nlp from 'compromise';

// --- Static categorized word banks (JSON files) ---
// Each file is a flat array of words organized by theme.
// Length filtering is applied at runtime per stage requirements.
import animalsBank from './words/animals.json';
import natureBank from './words/nature.json';
import foodBank from './words/food.json';
import thingsBank from './words/things.json';
import adjectivesBank from './words/adjectives.json';
import verbsBank from './words/verbs.json';

// --- Merged, deduplicated pools ---
// Note: random-word-slugs was considered as a supplement but its internal
// dist/words path is not a public API and breaks in Vercel/CI environments.
// The words it would have contributed are already covered by our JSON banks.
const ALL_NOUNS: string[] = [
  ...new Set([...animalsBank, ...natureBank, ...foodBank, ...thingsBank]),
];

const ALL_ADJECTIVES: string[] = [...new Set([...adjectivesBank])];

const ALL_VERBS: string[] = [...new Set([...verbsBank])];

// --- Helpers ---

/** Pick a random element from an array */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Filter words to those within [minLen, maxLen] character range */
function byLength(arr: string[], minLen: number, maxLen: number): string[] {
  return arr.filter((w) => w.length >= minLen && w.length <= maxLen);
}

/**
 * Validate a composed phrase using compromise — ensures at least one noun
 * is recognized, giving us confidence it's a real word combination.
 */
function validatePhrase(phrase: string): boolean {
  const doc = nlp(phrase);
  return doc.nouns().length > 0;
}

// --- Phrase composers per stage ---

/**
 * Stage 1 — single short noun (3 letters exactly).
 * e.g. "ANT", "BEE", "CAT", "EGG"
 */
function stage1Phrase(): string[] {
  const pool = byLength(ALL_NOUNS, 3, 3);
  return [pick(pool).toUpperCase()];
}

/**
 * Stage 2 — ADJ + NOUN phrase (each word 3–4 chars).
 * e.g. "BIG CAT", "WET FOX", "COLD EGG"
 */
function stage2Phrase(): string[] {
  const nouns = byLength(ALL_NOUNS, 3, 4);
  const adjs = byLength(ALL_ADJECTIVES, 3, 4);

  for (let i = 0; i < 30; i++) {
    const adj = pick(adjs);
    const noun = pick(nouns);
    if (validatePhrase(`${adj} ${noun}`)) {
      return [adj.toUpperCase(), noun.toUpperCase()];
    }
  }
  return ['BIG', 'ANT']; // safe fallback
}

/**
 * Stage 3 — three-word phrase (each word 3–5 chars).
 * Alternates between two templates:
 *   - ADJ + NOUN + VERB  (e.g. "FAST DEER LEAP")
 *   - ADJ + ADJ + NOUN   (e.g. "TINY BLUE FISH")
 */
function stage3Phrase(): string[] {
  const nouns = byLength(ALL_NOUNS, 3, 5);
  const adjs = byLength(ALL_ADJECTIVES, 3, 5);
  const verbs = byLength(ALL_VERBS, 3, 5);

  const useVerbTemplate = Math.random() > 0.5;

  for (let i = 0; i < 30; i++) {
    if (useVerbTemplate) {
      const adj = pick(adjs);
      const noun = pick(nouns);
      const verb = pick(verbs);
      if (validatePhrase(`${adj} ${noun} ${verb}`)) {
        return [adj.toUpperCase(), noun.toUpperCase(), verb.toUpperCase()];
      }
    } else {
      const adj1 = pick(adjs);
      const adj2 = pick(adjs);
      const noun = pick(nouns);
      if (adj1 !== adj2 && validatePhrase(`${adj1} ${adj2} ${noun}`)) {
        return [adj1.toUpperCase(), adj2.toUpperCase(), noun.toUpperCase()];
      }
    }
  }
  return ['TINY', 'BLUE', 'FISH']; // safe fallback
}

/**
 * Main entry — generates a kid-friendly phrase for the given stage.
 * Stage 1: single 3-letter noun       e.g. ["CAT"]
 * Stage 2: ADJ + NOUN (3–4 char each) e.g. ["WET", "FOX"]
 * Stage 3: 3-word phrase (3–5 chars)  e.g. ["FAST", "DEER", "LEAP"]
 */
export function generateMysteryPhrase(stage: number): string[] {
  if (stage === 2) return stage2Phrase();
  if (stage === 3) return stage3Phrase();
  return stage1Phrase();
}
