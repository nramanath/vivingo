import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import confetti from 'canvas-confetti';
import { WhatsMissing } from './WhatsMissing';
import * as data from './whatsMissingData';
import type { Round, StageLevel } from './whatsMissingData';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('./whatsMissingData', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./whatsMissingData')>()),
  generateRound: vi.fn(),
}));

const { sceneThemes, STAGE_CONFIG } = data;

/**
 * Deterministic round: the tray is the first N items of the first theme, the second tray item
 * vanishes, and the correct answer is always choice number 2.
 */
function fixedRound(stage: StageLevel): Round {
  const theme = sceneThemes[0];
  const { trayCount, choiceCount, shuffle } = STAGE_CONFIG[stage];
  const tray = theme.items.slice(0, trayCount);
  const missingItem = tray[1];
  const others = tray.filter((item) => item !== missingItem);
  const guessTray = shuffle
    ? [others[2], null, others[0], others[3], others[1]]
    : tray.map((item) => (item === missingItem ? null : item));
  const distractors = theme.items.slice(trayCount, trayCount + choiceCount - 1);
  return {
    theme,
    tray,
    missingItem,
    guessTray,
    choices: [distractors[0], missingItem, ...distractors.slice(1)],
  };
}

const WRONG_KEY = '1';
const CORRECT_KEY = '2';
const stageOneMemorizeMs = STAGE_CONFIG[1].memorizeMs;

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });
const press = (key: string) => fireEvent.keyDown(window, { key, code: key });
const choiceButtons = () => screen.queryAllByRole('button', { name: /^Choice \d/ });
const startGame = () => {
  const view = render(<WhatsMissing />);
  fireEvent.click(screen.getByRole('button', { name: /start/i }));
  return view;
};
const hideTray = () => {
  fireEvent.click(screen.getByRole('button', { name: /ready now/i }));
  advance(800);
};
const solveRound = () => {
  hideTray();
  press(CORRECT_KEY);
  advance(2000);
};

describe('WhatsMissing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(data.generateRound).mockImplementation((stage) => fixedRound(stage));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('start and memorize phase', () => {
    it('shows the start screen before any gameplay', () => {
      render(<WhatsMissing />);
      expect(screen.getByText("What's Missing?")).toBeDefined();
      expect(screen.getByRole('button', { name: /start/i })).toBeDefined();
      expect(data.generateRound).not.toHaveBeenCalled();
    });

    it('shows the full stage 1 tray with names and the countdown at 100%', () => {
      startGame();
      const slots = screen.getAllByTestId('tray-slot');
      expect(slots).toHaveLength(3);
      fixedRound(1).tray.forEach((item) => expect(screen.getByText(item.name)).toBeDefined());
      expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
      expect(choiceButtons()).toHaveLength(0);
    });

    it('counts down while memorizing', () => {
      startGame();
      advance(stageOneMemorizeMs / 2);
      const remaining = Number(screen.getByRole('progressbar').getAttribute('aria-valuenow'));
      expect(remaining).toBeGreaterThanOrEqual(45);
      expect(remaining).toBeLessThanOrEqual(55);
    });

    it('covers the tray and shows choices when the timer expires', () => {
      startGame();
      advance(stageOneMemorizeMs + 100);
      expect(screen.getByTestId('curtain')).toBeDefined();
      advance(800);
      expect(screen.queryByTestId('curtain')).toBeNull();
      expect(choiceButtons()).toHaveLength(3);
    });

    it('hides early with the Ready Now button', () => {
      startGame();
      fireEvent.click(screen.getByRole('button', { name: /ready now/i }));
      expect(screen.getByTestId('curtain')).toBeDefined();
      advance(800);
      expect(choiceButtons()).toHaveLength(3);
    });

    it('hides early with Space and prevents page scrolling', () => {
      startGame();
      const notPrevented = fireEvent.keyDown(window, { key: ' ', code: 'Space' });
      expect(notPrevented).toBe(false);
      expect(screen.getByTestId('curtain')).toBeDefined();
      advance(800);
      expect(choiceButtons()).toHaveLength(3);
    });

    it('ignores held-down Space repeats and number keys while memorizing', () => {
      startGame();
      press(CORRECT_KEY);
      fireEvent.keyDown(window, { key: ' ', code: 'Space', repeat: true });
      expect(screen.queryByTestId('curtain')).toBeNull();
      expect(screen.getByRole('button', { name: /ready now/i })).toBeDefined();
      expect(screen.queryByText('Correct!')).toBeNull();
    });

    it('does not restart the countdown or cover twice when hidden repeatedly', () => {
      startGame();
      fireEvent.click(screen.getByRole('button', { name: /ready now/i }));
      fireEvent.keyDown(window, { key: ' ', code: 'Space' });
      advance(800);
      expect(choiceButtons()).toHaveLength(3);
      advance(stageOneMemorizeMs);
      expect(choiceButtons()).toHaveLength(3);
    });
  });

  describe('guessing', () => {
    it('shows a gap where the item vanished and the remaining items', () => {
      startGame();
      hideTray();
      const slots = screen.getAllByTestId('tray-slot');
      const { tray, missingItem } = fixedRound(1);
      expect(slots[1].textContent).toBe('?');
      expect(within(slots[0]).getByText(tray[0].name)).toBeDefined();
      expect(within(slots[2]).getByText(tray[2].name)).toBeDefined();
      expect(screen.queryAllByText(missingItem.name).length).toBe(1);
    });

    it('labels choices with their number and name', () => {
      startGame();
      hideTray();
      const choices = fixedRound(1).choices;
      choices.forEach((choice, i) => {
        expect(
          screen.getByRole('button', { name: `Choice ${i + 1}: ${choice.name}` })
        ).toBeDefined();
      });
    });

    it('shows wrong feedback, disables only that choice, and awards no point', () => {
      startGame();
      hideTray();
      press(WRONG_KEY);
      expect(screen.getByText('Wrong!')).toBeDefined();
      const buttons = choiceButtons();
      expect(buttons[0].hasAttribute('disabled')).toBe(true);
      expect(buttons[1].hasAttribute('disabled')).toBe(false);
      expect(buttons[2].hasAttribute('disabled')).toBe(false);
      expect(confetti).not.toHaveBeenCalled();
      expect(screen.getByTestId('score').textContent).toBe('0');
    });

    it('clears the wrong banner after a short delay', () => {
      startGame();
      hideTray();
      press(WRONG_KEY);
      advance(1300);
      expect(screen.queryByText('Wrong!')).toBeNull();
    });

    it('lets a child try again after a wrong answer', () => {
      startGame();
      hideTray();
      press(WRONG_KEY);
      fireEvent.click(choiceButtons()[0]);
      expect(screen.getByText('Wrong!')).toBeDefined();
      press(CORRECT_KEY);
      expect(screen.getByText('Correct!')).toBeDefined();
      expect(screen.queryByText('Wrong!')).toBeNull();
    });

    it('ignores number keys without a matching choice', () => {
      startGame();
      hideTray();
      press('9');
      press('0');
      press('a');
      expect(screen.queryByText('Wrong!')).toBeNull();
      expect(screen.queryByText('Correct!')).toBeNull();
    });

    it('prevents default on handled number keys and Space while guessing', () => {
      startGame();
      hideTray();
      expect(fireEvent.keyDown(window, { key: ' ', code: 'Space' })).toBe(false);
      expect(fireEvent.keyDown(window, { key: WRONG_KEY })).toBe(false);
      expect(screen.queryByTestId('curtain')).toBeNull();
    });

    it('accepts mouse clicks on a choice', () => {
      startGame();
      hideTray();
      fireEvent.click(choiceButtons()[1]);
      expect(screen.getByText('Correct!')).toBeDefined();
    });
  });

  describe('correct answer', () => {
    it('celebrates, scores a point, reveals the answer and locks the choices', () => {
      startGame();
      hideTray();
      press(CORRECT_KEY);
      const { missingItem } = fixedRound(1);
      expect(screen.getByText('Correct!')).toBeDefined();
      expect(confetti).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('score').textContent).toBe('1');
      expect(
        within(screen.getAllByTestId('tray-slot')[1]).getByText(missingItem.name)
      ).toBeDefined();
      choiceButtons().forEach((button) => expect(button.hasAttribute('disabled')).toBe(true));
    });

    it('cannot be scored twice by pressing the answer again', () => {
      startGame();
      hideTray();
      press(CORRECT_KEY);
      press(CORRECT_KEY);
      fireEvent.click(choiceButtons()[1]);
      expect(confetti).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('score').textContent).toBe('1');
    });

    it('starts the next round with a fresh memorize phase', () => {
      startGame();
      solveRound();
      expect(screen.getByRole('button', { name: /ready now/i })).toBeDefined();
      expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
      expect(choiceButtons()).toHaveLength(0);
      expect(screen.queryByText('Correct!')).toBeNull();
      expect(screen.getByTestId('score').textContent).toBe('1');
    });

    it('does not carry disabled choices into the next round', () => {
      startGame();
      hideTray();
      press(WRONG_KEY);
      press(CORRECT_KEY);
      advance(2000);
      hideTray();
      choiceButtons().forEach((button) => expect(button.hasAttribute('disabled')).toBe(false));
    });

    it('asks the generator for varied themes by passing recent theme ids', () => {
      startGame();
      solveRound();
      const calls = vi.mocked(data.generateRound).mock.calls;
      expect(calls[0]).toEqual([1, []]);
      expect(calls[1]).toEqual([1, [sceneThemes[0].id]]);
    });
  });

  describe('stage progression', () => {
    const dotStates = () =>
      screen.getAllByTestId('stage-dot').map((dot) => dot.getAttribute('data-state'));

    it('moves to stage 2 after three solved rounds with a 4 item tray', () => {
      startGame();
      expect(dotStates()).toEqual(['active', 'upcoming', 'upcoming']);
      for (let i = 0; i < 3; i++) solveRound();
      expect(dotStates()).toEqual(['done', 'active', 'upcoming']);
      expect(screen.getAllByTestId('tray-slot')).toHaveLength(4);
      expect(vi.mocked(data.generateRound).mock.calls.at(-1)?.[0]).toBe(2);
    });

    it('moves to stage 3 with a shuffled 5 item tray and 4 choices', () => {
      startGame();
      for (let i = 0; i < 6; i++) solveRound();
      expect(dotStates()).toEqual(['done', 'done', 'active']);
      expect(screen.getAllByTestId('tray-slot')).toHaveLength(5);
      hideTray();
      expect(choiceButtons()).toHaveLength(4);
      const slots = screen.getAllByTestId('tray-slot');
      expect(slots[1].textContent).toBe('?');
      expect(slots.filter((slot) => slot.textContent === '?')).toHaveLength(1);
    });

    it('uses the longer memorize timers on later stages', () => {
      startGame();
      for (let i = 0; i < 3; i++) solveRound();
      advance(STAGE_CONFIG[1].memorizeMs + 500);
      expect(screen.queryByTestId('curtain')).toBeNull();
      expect(screen.getByRole('button', { name: /ready now/i })).toBeDefined();
      advance(STAGE_CONFIG[2].memorizeMs);
      expect(choiceButtons()).toHaveLength(3);
    });
  });

  describe('finishing the game', () => {
    const playToTheEnd = () => {
      startGame();
      for (let i = 0; i < 9; i++) solveRound();
    };

    it('shows the game over screen with a perfect score after nine rounds', () => {
      playToTheEnd();
      expect(screen.getByText(/You did it/i)).toBeDefined();
      expect(screen.getByText(/score of 9/i)).toBeDefined();
    });

    it('returns to the start screen on Play Again instead of replaying instantly', () => {
      playToTheEnd();
      fireEvent.click(screen.getByRole('button', { name: /play again/i }));
      expect(screen.getByRole('button', { name: /start/i })).toBeDefined();
      expect(screen.queryByTestId('tray-slot')).toBeNull();
    });

    it('resets score, stage and theme memory when a new game starts', () => {
      playToTheEnd();
      fireEvent.click(screen.getByRole('button', { name: /play again/i }));
      vi.mocked(data.generateRound).mockClear();
      fireEvent.click(screen.getByRole('button', { name: /start/i }));
      expect(vi.mocked(data.generateRound).mock.calls[0]).toEqual([1, []]);
      expect(screen.getByTestId('score').textContent).toBe('0');
      expect(screen.getAllByTestId('stage-dot').map((d) => d.getAttribute('data-state'))).toEqual([
        'active',
        'upcoming',
        'upcoming',
      ]);
    });

    it('counts only solved rounds as points even after wrong guesses', () => {
      startGame();
      hideTray();
      press(WRONG_KEY);
      press(CORRECT_KEY);
      advance(2000);
      expect(screen.getByTestId('score').textContent).toBe('1');
    });
  });

  describe('cleanup', () => {
    const expectNoTimersAfterUnmount = (unmount: () => void) => {
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    };

    it('leaves no timers behind when unmounted during the countdown', () => {
      const { unmount } = startGame();
      advance(1000);
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      expectNoTimersAfterUnmount(unmount);
    });

    it('leaves no timers behind when unmounted during the cover animation', () => {
      const { unmount } = startGame();
      fireEvent.click(screen.getByRole('button', { name: /ready now/i }));
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      expectNoTimersAfterUnmount(unmount);
    });

    it('leaves no timers behind when unmounted during the success delay', () => {
      const { unmount } = startGame();
      hideTray();
      press(CORRECT_KEY);
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      expectNoTimersAfterUnmount(unmount);
    });

    it('leaves no timers behind when unmounted during wrong feedback', () => {
      const { unmount } = startGame();
      hideTray();
      press(WRONG_KEY);
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      expectNoTimersAfterUnmount(unmount);
    });

    it('stops listening to the keyboard after unmount', () => {
      const { unmount } = startGame();
      unmount();
      expect(fireEvent.keyDown(window, { key: ' ', code: 'Space' })).toBe(true);
    });
  });
});
