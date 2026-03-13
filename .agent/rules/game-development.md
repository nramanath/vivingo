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
- **Theming Hooks**:
  - Core interaction buttons (like "Start Playing" or "Restart") must utilize the `gradient-brand-button` stylistic formatting. This enforces dynamic kelly green/yellow laser border animations. Make it look alive, vibrant, and engaging.
- **Feedback Proximity**: Real-time feedback ("Correct!" or "Wrong!") should be clearly positioned near active interaction points (like just above the game board), not pinned far away or covering the user's primary vision (e.g., big center emojis blocking text).
- **Nuanced Animations**: Wobbly or shaking micro-animations should be utilized to intuitively show "wrong" selections.

## 4. Standard Game Shell & UI Components

Every game in Vivingo is part of a standardized "Shell" that handles navigation, metadata, and instructions.

- **Metadata Registration (`src/lib/games.ts`)**:
  - Every new game **must** be registered in the `games` array in `src/lib/games.ts`.
  - Required fields: `id`, `title`, `icon` (Emoji), `description`, `teaches`, `howToPlay`, and `variantClass`.
  - Optional but highly encouraged: `parentNote` and `parentProTip`.
- **The Sidebar Ecosystem (`src/components/layout/Sidebar.tsx`)**:
  - The sidebar handles both the game selection grid (using `GradientGameCard`) and the game instructions (using `GameDetails`).
  - **Never** rebuild instructions or back buttons manually inside the game logic; rely on the sidebar's `selectedGame` state.
- **Visual & Component Standards**:
  - **Emoji Icons**: Use a single, high-quality emoji as the primary identifier for the game.
  - **Typography**: Strictly use the `font-fredoka` (Fredoka) font for all text meant for children or parents to maintain the playful brand identity.
  - **GradientGameCard**: Used in the sidebar grid. Requires a `variantClass` (typically `gradient-brand-button`) for the animated border effects.
  - **GameDetails**: Automatically rendered in the sidebar when a game is selected. It parses the metadata to show "How to Play," "Note for Parents," and "What it Teaches."
  - **GameCanvas**: The root container in `src/components/layout/GameCanvas.tsx` where the game component itself (e.g., `<AlphabetHunt />`) is rendered. The game logic should assume it is centered within this canvas.

## 5. Interaction & Feedback

- **Standard Buttons**: Use the `StartGameButton` pattern (seen in `AlphabetHunt.tsx`) which utilizes `gradient-brand-button` for core "Play" or "Start" actions.
- **Consistent Feedback**: Use the `FeedbackBanner` pattern for "Correct," "Wrong," and "Stage Completed" messages to ensure UI consistency across different games.
- **Emoji-First Design**: Leverage emojis within the game screens (Start screen, Game Over screen) to provide visual cues that children can understand without reading.

## 6. Advanced Game Testing Constraints

- **Strict Mocks**: AI-generated tests must not just verify that a component "renders without crashing". They must verify specific, deterministic logic endpoints (i.e. if the user guesses letter X, the game correctly triggers the Wrong feedback).
- **Cleanup and Timers**: Games naturally rely on asynchronous side effects like `setTimeout()` for stage advancement and visual delays. These **must** be securely tracked (often via `useRef`) and cleared in their `useEffect` destructor scope to prevent flaky tests and runtime component-unmount memory leaks.
