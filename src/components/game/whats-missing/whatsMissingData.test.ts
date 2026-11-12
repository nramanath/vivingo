import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  generateRound,
  getNextProgress,
  shuffle,
  sceneThemes,
  STAGE_CONFIG,
  ROUNDS_PER_STAGE,
  type StageLevel,
} from './whatsMissingData';

const STAGES: StageLevel[] = [1, 2, 3];

/** Deterministic pseudo random generator (linear congruential) so every run is identical. */
function seedRandom(seed: number) {
  let value = seed;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  });
}

describe('scene inventory', () => {
  it('has at least 8 themes with enough items for the hardest stage', () => {
    const hardest = STAGE_CONFIG[3];
    expect(sceneThemes.length).toBeGreaterThanOrEqual(8);
    sceneThemes.forEach((theme) => {
      expect(theme.items.length).toBeGreaterThanOrEqual(
        hardest.trayCount + hardest.choiceCount - 1
      );
    });
  });

  it('has unique theme ids, item ids and emojis within each theme', () => {
    expect(new Set(sceneThemes.map((t) => t.id)).size).toBe(sceneThemes.length);
    sceneThemes.forEach((theme) => {
      expect(new Set(theme.items.map((i) => i.id)).size).toBe(theme.items.length);
      expect(new Set(theme.items.map((i) => i.emoji)).size).toBe(theme.items.length);
      theme.items.forEach((i) => {
        expect(i.name.length).toBeGreaterThan(0);
        expect(i.emoji.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('generateRound', () => {
  afterEach(() => vi.restoreAllMocks());

  it.each(STAGES)('builds a consistent round for stage %i across many seeds', (stage) => {
    const settings = STAGE_CONFIG[stage];
    for (let seed = 1; seed <= 200; seed++) {
      seedRandom(seed);
      const round = generateRound(stage);
      const themeItemIds = new Set(round.theme.items.map((i) => i.id));
      const trayIds = round.tray.map((i) => i.id);
      const distractors = round.choices.filter((c) => c.id !== round.missingItem.id);

      expect(round.tray).toHaveLength(settings.trayCount);
      expect(new Set(trayIds).size).toBe(settings.trayCount);
      expect(trayIds).toContain(round.missingItem.id);
      expect(round.choices).toHaveLength(settings.choiceCount);
      expect(new Set(round.choices.map((c) => c.id)).size).toBe(settings.choiceCount);
      expect(distractors).toHaveLength(settings.choiceCount - 1);
      round.choices.forEach((c) => expect(themeItemIds.has(c.id)).toBe(true));
      distractors.forEach((c) => expect(trayIds).not.toContain(c.id));
      vi.restoreAllMocks();
    }
  });

  it.each(STAGES)('leaves exactly one gap and keeps the other items for stage %i', (stage) => {
    for (let seed = 1; seed <= 100; seed++) {
      seedRandom(seed);
      const round = generateRound(stage);
      const visible = round.guessTray.filter((slot) => slot !== null).map((slot) => slot!.id);
      const expected = round.tray.filter((i) => i.id !== round.missingItem.id).map((i) => i.id);

      expect(round.guessTray).toHaveLength(STAGE_CONFIG[stage].trayCount);
      expect(round.guessTray.filter((slot) => slot === null)).toHaveLength(1);
      expect([...visible].sort()).toEqual([...expected].sort());
      vi.restoreAllMocks();
    }
  });

  it('keeps positions fixed in stages 1 and 2 so the gap marks the missing slot', () => {
    for (const stage of [1, 2] as StageLevel[]) {
      for (let seed = 1; seed <= 100; seed++) {
        seedRandom(seed);
        const round = generateRound(stage);
        const gapIndex = round.guessTray.indexOf(null);
        expect(round.tray[gapIndex].id).toBe(round.missingItem.id);
        round.guessTray.forEach((slot, i) => {
          if (slot) expect(slot.id).toBe(round.tray[i].id);
        });
        vi.restoreAllMocks();
      }
    }
  });

  it('shuffles positions in stage 3 for at least some seeds', () => {
    const moved = Array.from({ length: 100 }, (_, i) => {
      seedRandom(i + 1);
      const round = generateRound(3);
      vi.restoreAllMocks();
      return round.guessTray.some((slot, idx) => slot !== null && slot.id !== round.tray[idx].id);
    });
    expect(moved.some(Boolean)).toBe(true);
  });

  it('never reuses the most recent theme', () => {
    for (const theme of sceneThemes) {
      for (let seed = 1; seed <= 50; seed++) {
        seedRandom(seed);
        expect(generateRound(1, ['other', theme.id]).theme.id).not.toBe(theme.id);
        vi.restoreAllMocks();
      }
    }
  });

  it('produces varied rounds so the game does not repeat', () => {
    const signatures = new Set<string>();
    for (let seed = 1; seed <= 100; seed++) {
      seedRandom(seed);
      const round = generateRound(2);
      signatures.add(`${round.theme.id}:${round.tray.map((i) => i.id).join(',')}`);
      vi.restoreAllMocks();
    }
    expect(signatures.size).toBeGreaterThan(90);
  });

  it('uses the first theme, first items and first choice when random always returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const round = generateRound(1);
    expect(round.theme.id).toBe(sceneThemes[0].id);
    expect(round.tray).toHaveLength(3);
    expect(round.missingItem.id).toBe(round.tray[0].id);
  });
});

describe('shuffle', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns a new array containing the same elements without mutating the input', () => {
    seedRandom(7);
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(result).not.toBe(input);
  });

  it('handles empty and single element arrays', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(['a'])).toEqual(['a']);
  });
});

describe('getNextProgress', () => {
  it('moves to the next round inside a stage', () => {
    expect(getNextProgress(1, 0)).toEqual({ stage: 1, roundIndex: 1 });
    expect(getNextProgress(2, ROUNDS_PER_STAGE - 2)).toEqual({
      stage: 2,
      roundIndex: ROUNDS_PER_STAGE - 1,
    });
  });

  it('moves to the next stage after the last round of a stage', () => {
    expect(getNextProgress(1, ROUNDS_PER_STAGE - 1)).toEqual({ stage: 2, roundIndex: 0 });
    expect(getNextProgress(2, ROUNDS_PER_STAGE - 1)).toEqual({ stage: 3, roundIndex: 0 });
  });

  it('returns null once the final round of the final stage is solved', () => {
    expect(getNextProgress(3, ROUNDS_PER_STAGE - 1)).toBeNull();
  });
});
