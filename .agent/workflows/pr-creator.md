---
description: Wrap up user-written code, run verification, commit, and open a PR.
---

# PR Creator Workflow

This workflow automates the process of wrapping up local changes, running strict verifications, and creating a Pull Request.

## Workflow Steps

// turbo-all

1. **Verify State**: Look at `git status`. Ensure there are uncommitted changes or untracked files. If the working tree is clean, inform the user there's nothing to PR.
2. **Current Branch**: Run `git branch --show-current`. If the user is on `main`, you MUST abort and tell the user to create a feature branch first. NEVER commit directly to `main`.
3. **Stage Changes**:
   ```bash
   git add .
   ```
4. **Local Verification**:
   ```bash
   mise run pr
   ```
   **CRITICAL**: If any formatting, linting, or testing checks fail during this step, STOP. Explain the failure to the user and fix the code autonomously before proceeding.
5. **Draft Commit**: Analyze the staged changes. Draft a commit message that _strictly_ adheres to the project's `.commitlintrc.cjs` rules (e.g., `feat:`, `fix:`, `docs:`, `chore:`).
6. **Commit Changes**:
   ```bash
   git commit -m "type(scope): succinct description"
   ```
7. **Push Branch**:
   ```bash
   git push -u origin HEAD
   ```
8. **Create PR**: Use the `gh` CLI to create the PR.
   - Read `.github/PULL_REQUEST_TEMPLATE.md`.
   - Ensure the PR title _also_ strictly follows the `.commitlintrc.cjs` rules.
   - Write the description to a temporary file (`/tmp/pr-body.md`).
   ```bash
   gh pr create --title "type(scope): succinct description" --body-file /tmp/pr-body.md
   rm /tmp/pr-body.md
   ```
