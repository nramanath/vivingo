import { useEffect, useState } from 'react';

const TICK_MS = 50;

interface MemorizeCountdownOptions {
  /** Counting only runs while true. */
  isActive: boolean;
  durationMs: number;
  /** Changing this value restarts the countdown (for example a new round object). */
  resetKey: unknown;
  onExpire: () => void;
}

/** Returns the remaining memorize time as a percentage (100 down to 0) and calls `onExpire` at 0. */
export function useMemorizeCountdown({
  isActive,
  durationMs,
  resetKey,
  onExpire,
}: MemorizeCountdownOptions): number {
  const [progress, setProgress] = useState(100);
  const [previousResetKey, setPreviousResetKey] = useState(resetKey);

  if (previousResetKey !== resetKey) {
    setPreviousResetKey(resetKey);
    setProgress(100);
  }

  useEffect(() => {
    if (!isActive) return;
    const startedAt = Date.now();
    const intervalId = setInterval(() => {
      const remaining = Math.max(0, 100 - ((Date.now() - startedAt) / durationMs) * 100);
      setProgress(remaining);
      if (remaining > 0) return;
      clearInterval(intervalId);
      onExpire();
    }, TICK_MS);
    return () => clearInterval(intervalId);
  }, [isActive, durationMs, resetKey, onExpire]);

  return progress;
}
