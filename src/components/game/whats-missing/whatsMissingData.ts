import {
  sceneThemes,
  type SceneItem,
  type SceneTheme,
  type StageLevel,
} from './whatsMissingThemes';

export { sceneThemes } from './whatsMissingThemes';
export type { SceneItem, SceneTheme, StageLevel } from './whatsMissingThemes';

/** Difficulty settings for each stage. */
export interface StageSettings {
  trayCount: number;
  choiceCount: number;
  memorizeMs: number;
  /** Whether the remaining items are rearranged when the cover lifts. */
  shuffle: boolean;
}

export const STAGE_CONFIG: Record<StageLevel, StageSettings> = {
  1: { trayCount: 3, choiceCount: 3, memorizeMs: 10000, shuffle: false },
  2: { trayCount: 4, choiceCount: 3, memorizeMs: 15000, shuffle: false },
  3: { trayCount: 5, choiceCount: 4, memorizeMs: 20000, shuffle: true },
};

export const ROUNDS_PER_STAGE = 3;

/** Number of most recent themes that are excluded when picking the next theme. */
const THEME_MEMORY = 1;

/** Returns where the game goes after a solved round, or `null` when the game is won. */
export function getNextProgress(
  stage: StageLevel,
  roundIndex: number
): { stage: StageLevel; roundIndex: number } | null {
  if (roundIndex + 1 < ROUNDS_PER_STAGE) return { stage, roundIndex: roundIndex + 1 };
  if (stage === 3) return null;
  return { stage: (stage + 1) as StageLevel, roundIndex: 0 };
}

export interface Round {
  theme: SceneTheme;
  /** Tray as shown during the memorize phase (includes the missing item). */
  tray: SceneItem[];
  missingItem: SceneItem;
  /** Tray as shown after the cover lifts; `null` marks the vanished item's slot. */
  guessTray: (SceneItem | null)[];
  /** Answer options, always containing `missingItem`. */
  choices: SceneItem[];
}

/** Returns a shuffled copy of `array` using a Fisher-Yates shuffle. */
export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickTheme(recentThemeIds: string[]): SceneTheme {
  const excluded = recentThemeIds.slice(-THEME_MEMORY);
  const candidates = sceneThemes.filter((theme) => !excluded.includes(theme.id));
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function buildGuessTray(
  tray: SceneItem[],
  missingIndex: number,
  shouldShuffle: boolean
): (SceneItem | null)[] {
  if (!shouldShuffle) return tray.map((entry, i) => (i === missingIndex ? null : entry));

  const remaining = shuffle(tray.filter((_, i) => i !== missingIndex));
  const gapPosition = Math.floor(Math.random() * (remaining.length + 1));
  return [...remaining.slice(0, gapPosition), null, ...remaining.slice(gapPosition)];
}

/**
 * Generates one round: picks a theme (never the previous one), draws the tray items from it,
 * chooses the item that will vanish, and builds answer choices from the same theme so that
 * every option is a plausible answer.
 */
export function generateRound(stage: StageLevel, recentThemeIds: string[] = []): Round {
  const settings = STAGE_CONFIG[stage];
  const theme = pickTheme(recentThemeIds);

  const pool = shuffle(theme.items);
  const tray = pool.slice(0, settings.trayCount);
  const distractors = pool.slice(settings.trayCount, settings.trayCount + settings.choiceCount - 1);
  const missingIndex = Math.floor(Math.random() * tray.length);
  const missingItem = tray[missingIndex];

  return {
    theme,
    tray,
    missingItem,
    guessTray: buildGuessTray(tray, missingIndex, settings.shuffle),
    choices: shuffle([missingItem, ...distractors]),
  };
}
