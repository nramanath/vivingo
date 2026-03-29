---
description: Specific architectural and styling constraints for creating "Games" in Vivingo
---

# Game Architecture Rules

Building upon the base `.agent/rules/coding-conventions.md`, this file specifically dictates the expected structure and design patterns when an AI agent is tasked with generating, restructuring, or augmenting a "Game" component inside the Vivingo repository.

## 1. Directory Architecture & Scope

- **Modularity**: Games must utilize a strictly modular directory structure under the specific route: `src/components/game/[game-name]/`.
- **Encapsulation**:
  - The game module folder must encapsulate its core logic (`[GameName].tsx`), any private sub-components necessary for its UI rendering, an `index.ts` forwarder file, and a strictly co-located `[GameName].test.tsx` file to protect against fragmentation.
  - _Never_ write a single massive React component. Core gameplay logic, puzzle generation, scoring state management, and side effects should be extracted away from the main UI renderer into a `use[GameName]Logic()` custom hook mapping. The standard React component mapping should just call the hook and render the returned variables.

## 2. Design & Aesthetics

- **Color Palettes**: Never use standard basic colors or basic box-shadows. The web application is driven by dynamic gradients, blurs, and animations meant for children.
  - **Shared 3D Theme**: To maintain visual consistency across all 3D or R3F games (like Ball Maze, Word Roller, etc.), strictly use the following color palette unless overridden:
    - Canvas Background / Path Color: `#FFF8E7` (warm cream)
    - Wall Colors: `#6E9445` (base) and `#98b66e` (top cap)
    - Default Text / Highlight Colors: `var(--color-kelly-green)` or `var(--color-freesia)`
- **CSS Theme Tokens**: Use these CSS variables consistently. Never hardcode the hex values inline.
  - `var(--color-kelly-green)` — primary brand green (HUD titles, labels)
  - `var(--color-freesia)` — primary yellow-gold (Back button, active tiles, interactive highlights)
  - `var(--color-yellow)` — lighter yellow (GradientGameCard background fill)
  - **Difficulty-coded dot colors** (for multi-stage progress indicators):
    - Stage 1 — easy: `#6bae3e`
    - Stage 2 — medium: `#f9d876`
    - Stage 3 — hard: `#e05c3a`
- **Theming Hooks**:
  - Core interaction buttons (like "Start Playing" or "Restart") must utilize the `gradient-brand-button` stylistic formatting. This enforces dynamic kelly green/yellow laser border animations. Make it look alive, vibrant, and engaging.
- **Feedback Proximity**: Real-time feedback should be clearly positioned near active interaction points, not pinned far away or covering the user's primary vision.
- **Nuanced Animations**: Wobbly or shaking micro-animations should be utilized to intuitively show "wrong" selections.

## 3. Platform Infrastructure (Do Not Rebuild)

The following platform-level components are shared singletons. **Never** rebuild them inside a game module — they are fully owned by the layout layer.

### Game Registry — `src/lib/games.ts`

Every new game **must** be registered in the `games` array. Required fields:

```ts
{
  id: string;          // Matches the selectedGame string key in GameCanvas
  title: string;       // Display name
  icon: string;        // Single emoji — the game's primary visual identity
  description: string; // Short one-liner for the card and sidebar header
  minAge: number;      // Minimum recommended age
  maxAge: number;      // Maximum recommended age
  teaches: { title: string; description: string }[];
  howToPlay: string;   // Plain text, may use \n\n for paragraph breaks
  parentNote?: string; // Optional note shown under "Note for Parents"
  parentProTip?: string; // Optional tip shown inside the parentNote section
  variantClass: string; // CSS class for the card gradient border (usually 'gradient-brand-button')
}
```

### Sidebar — `src/components/layout/Sidebar.tsx`

- Shows the game selection grid when no game is selected.
- Shows `GameDetails` and the **Back button** when a game is selected.
- The Back button uses `bg-[var(--color-freesia)]` and is built into the sidebar. **Never** add a back button or navigation control inside a game component.
- The `AgeSelector` is shown in the sidebar header to filter the game grid by age range — it is not a game concern.

### GameCanvas — `src/components/layout/GameCanvas.tsx`

- Routes the `selectedGame` string → the correct game component.
- When adding a new game, add a single ternary entry: `) : selectedGame === 'My Game' ? (<MyGame />`
- Games can always assume they are mounted centered inside a `h-full w-full` flex container.

### GradientGameCard — `src/components/game/GradientGameCard.tsx`

- Renders each game tile in the sidebar grid.
- Requires `variantClass` from `games.ts` for the animated border effect.
- Never customize or re-implement this card inside a game module.

### GameDetails — `src/components/game/GameDetails.tsx`

- Automatically rendered in the sidebar when a game is selected.
- Parses `GameMetadata` to display: GameHeader (icon + title + description), How to Play, Note for Parents (optional), What it Teaches.
- Never rebuild this panel inside a game component.

## 4. Standard In-Game Shell Components

All of the following come from `src/components/game/shared/`. **Always** import from there. **Never** rebuild them inside a game module.

### `GameStartScreen` — Always Required

Every game must show a start screen before gameplay begins.

```tsx
<GameStartScreen
  icon="🎲" // Same emoji as games.ts icon
  title="Word Roller"
  description="Short description of what the child will do."
  onStart={startGame}
/>
```

**State pattern**: Hold an `isPlaying` boolean in the game's logic hook.

- `isPlaying = false` → render `<GameStartScreen />`
- `isPlaying = true` → render the game
- `gameCompleted = true` → render `<GameOverScreen />`
- `resetGame()` must set `isPlaying = false` so the user returns to the start screen, not an instant replay.

### `GameOverScreen` — Always Required

Shown when all stages are complete or lives are exhausted.

```tsx
<GameOverScreen score={stageCount} onRestart={resetGame} />
```

`resetGame()` must reset all game state **and** set `isPlaying = false`.

### `GameInstructionPill` — Required for any keyboard/gesture game

Persistent hint at the bottom of the canvas. **Never** place it inside a HUD bar or at the top of the screen.

```tsx
// Placement: absolute overlay inside the canvas container
<GameInstructionPill text="Use Arrow Keys or WASD to Roll" />
```

### `GameProgressDots` — Required for multi-stage games (3+ stages)

Shown inside the HUD bar, absolutely centered.

```tsx
<GameProgressDots current={stageIndex} total={STAGES.length} />
```

Use difficulty-coded colors (green → yellow → red-orange) rather than a single active/inactive scheme. The active dot should be slightly larger and have a soft glow ring.

### `GameFeedbackBanner` — Only when text feedback is appropriate

Use this only when a floating text banner ("Correct!", "Wrong!") meaningfully adds to the UX. If confetti or a color change on the tile/board is sufficient feedback, **do not** add a banner on top.

```tsx
<GameFeedbackBanner feedback={feedback} />
```

### `GameActionButton` — For custom game-over or celebration screens

Used inside custom screens that don't use `GameOverScreen`.

```tsx
<GameActionButton onClick={resetGame} text="Play Again!" icon={Play} />
```

## 5. Interaction & Feedback

- **Arrow key scroll prevention**: Any game using keyboard input (arrow keys, WASD, spacebar) **must** call `e.preventDefault()` on those specific keys inside the `keydown` handler. Without this, the sidebar scrolls during play.

```ts
const GAME_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
]);
const handleKeyDown = (e: KeyboardEvent) => {
  if (GAME_KEYS.has(e.code)) e.preventDefault();
  pressedKeys.current.add(e.code);
};
```

- **Standard Buttons**: Use `GameStartScreen` and `GameActionButton` (which internally use `gradient-brand-button`) for core play/restart actions.
- **Emoji-First Design**: Leverage emojis within Start and Game Over screens for visual cues children understand without reading.

## 6. R3F / Rapier Physics Games

Additional constraints apply when a game uses `@react-three/fiber` and `@react-three/rapier`:

- **Physics world reset between stages**: The physics scene component **must** receive `key={stageIndex}` so Rapier fully destroys and recreates the physics world on every stage transition. Without this, wall positions update but the ball's physics state persists from the previous stage.

```tsx
<BoardScene key={stageIndex} ... />
```

- **Wall containment**: Use `ccd={true}` on any fast-moving `RigidBody` (ball, projectile) to enable Continuous Collision Detection and prevent tunneling through thin walls at high velocity.
- **Floor collider**: Use a `<boxGeometry>` (solid box) for floor colliders rather than `<planeGeometry>`. Plane geometries create single-sided colliders that can be penetrated from below.
- **3D Font**: When using `<Text>` from `@react-three/drei`, do NOT inject custom `.ttf` or `.woff` fonts via the `font` prop during development. Always rely on the default built-in font (Roboto) because local Vite dev server caches and CORS policies can block async font fetching, causing invisible letters or fatal Suspense crashes. For production-ready custom fonts, load them from the `public/fonts/` directory using standard `FontLoader`.
- **Camera for grid-based games**: Use an orthographic camera (`<OrthographicCamera>`) with a fixed zoom anchored to a reference grid size, not the actual grid size. This ensures every cell always appears the same physical size on screen regardless of stage — larger grids extend further across the canvas rather than shrinking to fit.

## 7. Advanced Game Testing Constraints

- **Strict Mocks**: AI-generated tests must not just verify that a component "renders without crashing". They must verify specific, deterministic logic endpoints (i.e. if the user guesses letter X, the game correctly triggers the Wrong feedback).
- **Cleanup and Timers**: Games naturally rely on asynchronous side effects like `setTimeout()` for stage advancement and visual delays. These **must** be securely tracked (often via `useRef`) and cleared in their `useEffect` destructor scope to prevent flaky tests and runtime component-unmount memory leaks.
