import { generate } from 'random-words';

/**
 * Generates an array of simple, kid-friendly words based on the current Stage difficulty.
 */
export function generateMysteryPhrase(stage: number): string[] {
  let wordCount = 1;
  let maxLength = 3;

  if (stage === 2) {
    wordCount = 2;
    maxLength = 4;
  } else if (stage === 3) {
    // For stage 3, we alternate between 2 or 3 words randomly to keep it fresh
    wordCount = Math.random() > 0.5 ? 3 : 2;
    maxLength = 5;
  }

  // generate strictly offline using the local NPM package
  const result = generate({ exactly: wordCount, minLength: 2, maxLength });

  // random-words can return string or string[] depending on exactly param, but with exactly > 1 it returns string[]
  // Normalize to string[] and uppercase for the UI
  const words = Array.isArray(result) ? result : [result];

  return words.map((word) => word.toUpperCase());
}
