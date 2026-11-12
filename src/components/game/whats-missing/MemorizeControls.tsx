interface MemorizeControlsProps {
  /** Remaining memorize time, 0 to 100. */
  progress: number;
  onReady: () => void;
}

/** Countdown bar plus a button that lets the child hide the tray early. */
export function MemorizeControls({ progress, onReady }: MemorizeControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md">
      <div
        role="progressbar"
        aria-label="Memorize time remaining"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="w-full h-3 rounded-full bg-white/70 overflow-hidden"
      >
        <div className="h-full bg-[var(--color-kelly-green)]" style={{ width: `${progress}%` }} />
      </div>
      <button
        onClick={onReady}
        className="gradient-brand-button px-6 py-3 rounded-xl font-fredoka text-xl font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        Ready Now! (Space)
      </button>
    </div>
  );
}
