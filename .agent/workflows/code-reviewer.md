---
description: Review uncommitted code against strict production-grade standards.
---

# Code Reviewer Workflow

This workflow enforces explicit, production-grade logic and architectural standards on the user's local, uncommitted code. Run this _before_ creating a PR.

## Code Quality Pillars

When the user triggers this workflow, analyze all unstaged and staged changes (`git diff` and `git diff --staged`) against the following strict pillars:

1. **Method/Function Size**: No single method or function should exceed 50 lines of code. Forces single-responsibility.
   - If a function is longer, you MUST instruct the user to extract parts into helper functions, or proactively refactor it yourself.
2. **File Length**: No single file should exceed 250 lines. Forces component extraction and modularity.
   - If a file is longer, you MUST instruct the user to extract components or logic into separate modules.
3. **Documentation**: Ensure essential JSDocs or TSDocs are present for:
   - Complex logic/algorithms.
   - Shared utility functions.
   - React Component `Props` interfaces.
4. **React Best Practices**:
   - Strict adherence to Rules of Hooks.
   - Pure render functions without side effects.
   - Memoization (`useMemo`, `useCallback`, `React.memo`) used _only_ where computationally necessary.
5. **TypeScript Strictness**:
   - Absolutely NO use of the `any` type.
   - Precise interface definitions over inline types where shared.
   - Effective reliance on type inference where explicit typing adds no value.

## Workflow Steps

1. **Analyze Code**: Read the uncommitted changes.
2. **Generate Report**: Present a structured markdown report to the user summarizing:
   - **Critical Violations**: E.g., a function is 80 lines long, `any` is used, a file is 300 lines.
   - **Improvements**: React Hook suggestions, missing JSDocs.
3. **Action**: Offer to autonomously fix the violations (e.g., extracting functions, adding types/docs) or let the user fix them manually.
