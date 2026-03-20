import { renderHook, act } from '@testing-library/react';
import { useWorldExplorerLogic } from './useWorldExplorerLogic';
import { CONTINENTS } from './continentData';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useWorldExplorerLogic', () => {
  beforeEach(() => {
    // Mock speechSynthesis
    vi.stubGlobal('speechSynthesis', {
      speak: vi.fn(),
      cancel: vi.fn(),
    });
    vi.stubGlobal('SpeechSynthesisUtterance', vi.fn());
  });

  it('has exactly 7 continents configured', () => {
    expect(CONTINENTS.length).toBe(7);
  });

  it('starts in LEARNING phase initially', () => {
    const { result } = renderHook(() => useWorldExplorerLogic());
    expect(result.current.phase).toBe('LEARNING');
  });

  it('transitions to CHALLENGE phase when startGame is called', () => {
    const { result } = renderHook(() => useWorldExplorerLogic());

    act(() => {
      result.current.startGame();
    });

    expect(result.current.phase).toBe('CHALLENGE');
    expect(result.current.currentMission).toBeDefined();
  });

  it('handles keyboard events to find continents in CHALLENGE phase', () => {
    const { result } = renderHook(() => useWorldExplorerLogic());

    act(() => {
      result.current.startGame();
    });

    const missionNumber = result.current.currentMission.numberKey;

    // Simulate incorrect number
    act(() => {
      const wrongNumber = missionNumber === '1' ? '2' : '1';
      window.dispatchEvent(new KeyboardEvent('keydown', { key: wrongNumber }));
    });

    expect(result.current.feedback?.type).toBe('hint');

    // Simulate correct number
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: missionNumber }));
    });

    expect(result.current.feedback?.type).toBe('success');
  });
});
