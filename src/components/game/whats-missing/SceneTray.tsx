import type { SceneItem, SceneTheme } from './whatsMissingData';

interface SceneTrayProps {
  theme: SceneTheme;
  slots: (SceneItem | null)[];
  /** When set, the empty slot shows this item (used to reveal the answer). */
  revealedItem?: SceneItem;
  showCurtain: boolean;
}

function TraySlot({ item, isRevealed }: { item: SceneItem | null; isRevealed: boolean }) {
  return (
    <div
      data-testid="tray-slot"
      aria-label={item ? item.name : 'Missing item'}
      className={`flex flex-col items-center justify-center w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-white shadow-md border-2 ${
        isRevealed ? 'animate-bounce border-[var(--color-kelly-green)]' : 'border-white/80'
      }`}
    >
      {item ? (
        <>
          <span className="text-5xl sm:text-6xl">{item.emoji}</span>
          <span className="mt-1 font-fredoka text-sm sm:text-base font-bold text-black/70">
            {item.name}
          </span>
        </>
      ) : (
        <span className="font-fredoka text-5xl font-black text-gray-400">?</span>
      )}
    </div>
  );
}

/** Themed tray of items, optionally hidden behind the magic curtain. */
export function SceneTray({ theme, slots, revealedItem, showCurtain }: SceneTrayProps) {
  return (
    <div
      className={`relative w-full rounded-3xl border-4 p-4 sm:p-6 shadow-inner ${theme.trayBgClass} ${theme.trayBorderClass}`}
    >
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {slots.map((slot, index) => (
          <TraySlot
            key={`${index}-${slot?.id ?? 'gap'}`}
            item={slot ?? revealedItem ?? null}
            isRevealed={slot === null && revealedItem !== undefined}
          />
        ))}
      </div>
      {showCurtain && (
        <div
          data-testid="curtain"
          className="absolute inset-0 flex items-center justify-center rounded-3xl bg-[var(--color-kelly-green)] text-6xl animate-in fade-in zoom-in duration-500"
        >
          🎩✨
        </div>
      )}
    </div>
  );
}
