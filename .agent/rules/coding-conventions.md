---
description: Global coding standards and architectural rules for Vivingo
---

# Global Coding Conventions

This rule file establishes the global baseline for all agents operating within the Vivingo repository. When generating new code, modifying features, or refactoring, you MUST adhere to the following standards:

## 1. React & TypeScript Standards

- **Functional Components**: Write clean, functional React components utilizing Hooks (`useState`, `useEffect`, `useCallback`, etc). Do not use class components.
- **Composition**: Actively prefer smaller, composable functional components. If a component exceeds ~150 lines or manages multiple complex state domains, extract sub-components into the same file or a localized directory.
- **Strict Typing**: Ensure explicit TypeScript typing for all props, API interfaces, and state variables. Avoid `any` at all costs.

## 2. Commit & PR Workflows

- **Conventional Commits**: Agents must adhere to the Conventional Commits specification (e.g., `feat:`, `fix:`, `docs:`, `chore:`, `ai:`).
- **Automation Reliance**: Agents should prefer predefined `.agent/workflows/` (such as `pr-creator.md` or `pr-bot-review-resolver.md`) when formatting, validating, and pushing Pull Requests, rather than writing ad-hoc validation bash scripts from scratch.
- **Branching Rule**: Agents MUST NEVER push code directly to the `main` branch. All changes must be pushed to a feature or fix branch, and integrated only via Pull Requests.
- **No Proactive PR Creation**: Agents must NEVER proactively commit, push feature branches, or create Pull Requests autonomously. Always stop, notify the user when the code is verified, and wait for explicit permission before invoking any Pull Request workflows or git push commands.
- **Validation**: Never push a PR without ensuring `vitest` unit tests and `commitlint` title validation pass successfully locally.

## 3. Testing Paradigm

- **Test Co-location**: Every new functional component or significant logic module must be accompanied by a `[Component].test.tsx` file in the exact same directory.
- **Library Reliance**: Utilize Vitest alongside React Testing Library (`@testing-library/react`).
- **Deterministic Assertions**: Aim for strictly deterministic tests. Randomization engines (like `Math.random()`) must be spied on and mocked to ensure CI/CD consistency. Asynchronous boundaries and side-effects should use `vi.useFakeTimers()` when necessary.

## 4. Code Complexity & Maintainability Constraints

To keep the codebase sustainable and readable in the long run, agents must abide by strict structural limits when generating or extending logic:

- **Function Scale (Soft/Hard Limits)**:
  - **Soft Limit**: A single function or React component should not exceed **50 lines**.
  - **Hard Limit**: A single function MUST never exceed **100 lines**. If it does, automatically pause your generation to refactor and split the method horizontally into helper functions or vertically into custom hooks.
- **File Scale (Hard Limit)**:
  - A single file must not exceed **250 lines**.
  - If feature implementations require stretching past this bound, the agent must scaffold a localized folder (e.g. `feature-name/`) with an `index.ts` forwarder and break the implementations into smaller modules.
- **Cognitive Complexity**:
  - Avoid deep nesting (more than 3 levels of `if/else` or nested loops).
  - Adopt early-return paradigms consistently (guard clauses) to keep the primary logic unindented and readable.
- **Self-Documenting Standard**:
  - Rely on descriptive, explicit variable and property names mapping exactly to their business context instead of inline documentation whenever possible.
  - Write inline or block comments only for specifically _complex_ or _unintuitive_ algorithmic choices, never to describe obvious syntax.
