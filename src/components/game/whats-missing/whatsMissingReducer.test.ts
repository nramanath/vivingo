import { describe, it, expect } from 'vitest';
import { gameReducer, initialGameState, type GameState } from './whatsMissingReducer';
import { sceneThemes, type Round } from './whatsMissingData';

const items = sceneThemes[0].items;
const round: Round = {
  theme: sceneThemes[0],
  tray: items.slice(0, 3),
  missingItem: items[0],
  guessTray: [null, items[1], items[2]],
  choices: [items[0], items[3], items[4]],
};

const playing: GameState = gameReducer(initialGameState, { type: 'START', round });

describe('gameReducer', () => {
  it('starts in the START phase with a zero score', () => {
    expect(initialGameState.phase).toBe('START');
    expect(initialGameState.score).toBe(0);
    expect(initialGameState.round).toBeNull();
  });

  it('START begins a fresh game in the memorize phase', () => {
    const dirty: GameState = { ...initialGameState, score: 5, stage: 3, disabledChoices: ['x'] };
    const state = gameReducer(dirty, { type: 'START', round });
    expect(state).toMatchObject({
      phase: 'PLAYING',
      roundPhase: 'MEMORIZE',
      stage: 1,
      roundIndex: 0,
      score: 0,
      disabledChoices: [],
      feedback: null,
    });
    expect(state.round).toBe(round);
  });

  it('COVER only applies while memorizing', () => {
    const covering = gameReducer(playing, { type: 'COVER' });
    expect(covering.roundPhase).toBe('COVERING');
    const guessing = gameReducer(covering, { type: 'OPEN_COVER' });
    expect(gameReducer(guessing, { type: 'COVER' })).toBe(guessing);
  });

  it('OPEN_COVER only applies while covering', () => {
    expect(gameReducer(playing, { type: 'OPEN_COVER' })).toBe(playing);
    const covering = gameReducer(playing, { type: 'COVER' });
    expect(gameReducer(covering, { type: 'OPEN_COVER' }).roundPhase).toBe('GUESSING');
  });

  it('WRONG_CHOICE disables the choice, shows wrong feedback and keeps the score', () => {
    const state = gameReducer(playing, { type: 'WRONG_CHOICE', choiceId: 'abc' });
    expect(state.disabledChoices).toEqual(['abc']);
    expect(state.feedback).toBe('wrong');
    expect(state.score).toBe(0);
    const second = gameReducer(state, { type: 'WRONG_CHOICE', choiceId: 'def' });
    expect(second.disabledChoices).toEqual(['abc', 'def']);
  });

  it('CLEAR_FEEDBACK removes feedback', () => {
    const wrong = gameReducer(playing, { type: 'WRONG_CHOICE', choiceId: 'abc' });
    expect(gameReducer(wrong, { type: 'CLEAR_FEEDBACK' }).feedback).toBeNull();
  });

  it('CORRECT_CHOICE reveals the answer and adds one point', () => {
    const state = gameReducer(playing, { type: 'CORRECT_CHOICE' });
    expect(state).toMatchObject({ feedback: 'correct', roundPhase: 'REVEALED', score: 1 });
  });

  it('NEXT_ROUND resets round state but keeps the score', () => {
    const solved = gameReducer(playing, { type: 'CORRECT_CHOICE' });
    const state = gameReducer(solved, { type: 'NEXT_ROUND', round, stage: 2, roundIndex: 0 });
    expect(state).toMatchObject({
      roundPhase: 'MEMORIZE',
      stage: 2,
      roundIndex: 0,
      score: 1,
      disabledChoices: [],
      feedback: null,
    });
  });

  it('WIN moves to the WON phase and clears feedback', () => {
    const solved = gameReducer(playing, { type: 'CORRECT_CHOICE' });
    expect(gameReducer(solved, { type: 'WIN' })).toMatchObject({ phase: 'WON', feedback: null });
  });

  it('RESET returns to the initial state', () => {
    const solved = gameReducer(playing, { type: 'CORRECT_CHOICE' });
    expect(gameReducer(solved, { type: 'RESET' })).toEqual(initialGameState);
  });

  it('does not mutate previous state', () => {
    const snapshot = JSON.stringify(playing);
    gameReducer(playing, { type: 'WRONG_CHOICE', choiceId: 'abc' });
    expect(JSON.stringify(playing)).toBe(snapshot);
  });
});
