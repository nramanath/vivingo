---
description: Scaffold a new modular game in Vivingo (generating hooks, UI component, tests, and registration)
---

# Game Scaffolder Workflow

This workflow guides the agent through scaffolding a new modular educational game inside Vivingo. Adhering to this process ensures compatibility with the game shell, correct test co-location, and strict logic-UI separation.

## Pre-requisites & Input Collection

Before generating code, obtain the following metadata about the game from the user or prompt context:

1. **Title/Name** (e.g., `Color Matcher`)
2. **Icon** (Single high-quality emoji, e.g., `🎨`)
3. **Description** (1-2 sentences summarizing the game)
4. **Age Range** (e.g., Min: 2, Max: 3)
5. **Teaches points** (Array of 3-4 target skills, e.g., "Color recognition", "Fine motor skills")
6. **How to Play** (Instructions for parents and children)

Determine the code names:

- **Kebab Case**: `[kebab-name]` (e.g., `color-matcher`)
- **Pascal Case**: `[PascalName]` (e.g., `ColorMatcher`)
- **Hook Name**: `use[PascalName]Logic` (e.g., `useColorMatcherLogic`)

---

## Step 1: Scaffold Folder & Files

Create the directory `src/components/game/[kebab-name]/` and write the following files:

### 1. `index.ts`

Export the main game component:

```typescript
export { [PascalName] } from './[PascalName]';
```

### 2. `use[PascalName]Logic.ts`

Create a custom hook that manages game state, progression, stages, scoring, and confetti rewards. Use `canvas-confetti`.
Ensure it returns:

- `phase`: `'START' | 'PLAYING' | 'WON'`
- `startGame`: function
- `restartGame`: function
- Game-specific states and handlers.

### 3. `[PascalName].tsx`

Create a functional React component that handles ONLY the rendering:

- Use `use[PascalName]Logic` to pull state.
- Render `<GameStartScreen>` (from `../shared`) if phase is `START`.
- Render `<GameOverScreen>` (from `../shared`) if phase is `WON`.
- Use brand tokens like `font-fredoka` and `gradient-brand-button` for consistent styling.

### 4. `[PascalName].test.tsx`

Create unit tests matching the Vivingo testing paradigm:

- Test that start screen renders.
- Mock necessary elements or handle user interactions to verify state transitions.
- Ensure all timers/confetti are cleaned up properly.

---

## Step 2: Register Game in the System

### 1. Register in `src/lib/games.ts`

Add the game metadata to the `games` array in [games.ts](file:///Users/ramanathan/Documents/code/vivingo/src/lib/games.ts):

```typescript
{
  id: '[Title]',
  title: '[Title]',
  icon: '[Emoji]',
  description: '[Description]',
  minAge: [MinAge],
  maxAge: [MaxAge],
  teaches: [
    { title: '[Skill 1]', description: '[Description 1]' },
    // ...
  ],
  howToPlay: '[HowToPlay]',
  parentNote: '[Parent Note]',
  parentProTip: '[Pro Tip]',
  variantClass: 'gradient-brand-button'
}
```

### 2. Register in `src/components/layout/GameCanvas.tsx`

Open [GameCanvas.tsx](file:///Users/ramanathan/Documents/code/vivingo/src/components/layout/GameCanvas.tsx):

- Import the new component:
  ```typescript
  import { [PascalName] } from '../game/[kebab-name]';
  ```
- Add a conditional check in the game render mapping:
  ```tsx
  selectedGame === '[Title]' ? (
    <[PascalName] />
  ) : ...
  ```

---

## Step 3: Local Verification

Run automated tests to ensure everything is integrated successfully:

```bash
npx vitest run src/components/game/[kebab-name]
```

Ensure all tests compile and pass without memory leaks or lint warnings.
