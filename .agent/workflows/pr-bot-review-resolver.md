---
description: Review automated bot PR comments, apply valid fixes, and mark as resolved.
---

# PR Reviewer & Resolver Workflow

This workflow automates the cycle of analyzing PR comments left by AI reviews (like gemini-code-assist), fixing the true-positive alerts locally, commenting on false-positive alerts, and marking the threads as resolved before pushing.

## Workflow Steps

// turbo-all

1. **Verify PR Context**: Ensure the user has a PR open for their current branch by running:

   ```bash
   gh pr view --json url,number
   ```

   If no PR exists, exit the workflow.

2. **Retrieve Reviews**: Fetch the specific comments left inside the PR reviews by bots.

   ```bash
   gh pr view --json reviews,comments
   gh api repos/{owner}/{repo}/pulls/{number}/comments
   ```

   _Note: Extract the bodies of these reviews carefully to parse the exact files and lines the bot is complaining about._

3. **Validate Feedback**: Autonomously read through the review items:
   - Determine which items are **valid** (e.g. true memory leaks, overlap bugs, redundant test statements).
   - Determine which items are **false-positives** or safe to deprioritize.

4. **Apply Fixes**:
   - For every **valid** comment, use the `replace_file_content` tool locally within the IDE to implement the correct patch.
   - Wait to ensure the codebase still compiles and passes `bun run test`.

5. **Draft Responses**:
   - For any **invalid/false-positive** comment, prepare a response argument indicating exactly why it will be deprioritized or isn't applicable.
6. **Commit & Push**:
   - Run `git add .`
   - Run a strict commit according to `.commitlintrc.cjs` standards (e.g., `fix(game): resolve automated review feedback`).
   - `git push origin HEAD`

7. **Resolve the Threads & Comment**:
   - Use the `gh` CLI to acknowledge the review and consider it resolved. Use:
   ```bash
   gh pr comment --body "Automated fixes applied for: [list valid issues]. Ignoring [list invalid issues] due to [reason]. These conversations are now resolved."
   ```
