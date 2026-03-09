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

## 3. Advanced Game Testing Constraints

- **Strict Mocks**: AI-generated tests must not just verify that a component "renders without crashing". They must verify specific, deterministic logic endpoints (i.e. if the user guesses letter X, the game correctly triggers the Wrong feedback).
- **Cleanup and Timers**: Games naturally rely on asynchronous side effects like `setTimeout()` for stage advancement and visual delays. These **must** be securely tracked (often via `useRef`) and cleared in their `useEffect` destructor scope to prevent flaky tests and runtime component-unmount memory leaks.
