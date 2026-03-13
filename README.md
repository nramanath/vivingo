# Vivingo

[![CI Status](https://github.com/nramanath/vivingo/actions/workflows/ci.yml/badge.svg)](https://github.com/nramanath/vivingo/actions/workflows/ci.yml)
[![Vercel Deployment](https://therealsujitk-vercel-badge.vercel.app/?app=vivingo)](https://vivingo.vercel.app/)
![Last Commit](https://img.shields.io/github/last-commit/nramanath/vivingo?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Dependencies](https://img.shields.io/badge/dependencies-up--to--date-brightgreen?style=flat-square)

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%3E%3D1.0.0-black?style=flat-square&logo=bun&logoColor=FDF0D5)
![Node](https://img.shields.io/badge/Node-%3E%3D20.0.0-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Mise](https://img.shields.io/badge/Mise-Managed-blue?style=flat-square&logo=task&logoColor=white)
![Antigravity](https://img.shields.io/badge/AI_Agent-Antigravity-6e5494?style=flat-square&logo=deepmind&logoColor=white)
![Gemini CLI](https://img.shields.io/badge/Gemini--CLI-4285F4?style=flat-square&logo=googlegemini&logoColor=white)

Building the ultimate toddler learning universe. Interactive, safe, and wildly fun educational games designed entirely for curious tiny minds.

## Getting Started

This project uses [Mise](https://mise.jdx.dev/) for managing tools and tasks, and [Bun](https://bun.sh/) as the JavaScript runtime and package manager.

### Prerequisites

- [Mise](https://mise.jdx.dev/getting-started.html) installed on your machine.

### Installation & Setup

1. Clone the repository and navigate into it:

   ```bash
   git clone https://github.com/nramanath/vivingo.git
   cd vivingo
   ```

2. Install dependencies via `mise`:
   ```bash
   mise run init
   ```

### Development Commands

All common commands are managed via our `mise.toml` task configuration:

- **`mise run dev`**: Start the Vite development server.
- **`mise run build`**: Build the project for production.
- **`mise run preview`**: Preview the production build locally.
- **`mise run lint`**: Run ESLint to check for code quality issues.
- **`mise run format`**: Format code using Prettier.
- **`mise run test`**: Run the test suite via Vitest.
- **`mise run pr`**: Run all strict CI checks (format, lint, build, test) locally before opening a pull request.

## Deployment

The application (`vivingo.vercel.app`) is deployed on Vercel and fully integrated with the GitHub repository. Future deployments are handled automatically:

- **Production Deployments:** Any commits pushed or merged into the `main` branch trigger an automatic build and deployment that updates the live site securely and quickly.
- **Preview Deployments:** Whenever you push a working branch or open a Pull Request, Vercel automatically generates a temporary, unique URL for that specific build. This allows you to visually verify your changes in a real cloud environment before modifying production.

No manual deployment steps or custom GitHub Actions workflows are required for the deployment process itself. Our `ci.yml` GitHub workflow handles rigorous code quality checks, while Vercel's native integration automatically watches the repository for updates to build and serve the application.

## 🎮 Games

Vivingo's game library is built on a **Unified Game Architecture**, ensuring a consistent look and feel while keeping game-specific logic completely decoupled.

<details>
<summary><strong>Explore the Game Library</strong></summary>

### 🔤 ABC Hunt (Age 2+)

A letter-recognition game where kids complete the alphabet by typing missing letters.

- **Goal**: Find the '?' tiles and press the matching keyboard key.
- **Progression**: 3 stages with increasing difficulty (1 missing letter → 2 → 3).
- **Teaches**: Visual letter recognition, keyboard familiarity.

### 🕵️‍♂️ Mystery Messages (Age 3+)

A word-decoding game where a jumbled grid hides a secret phrase.

- **Goal**: Type the underlined target letters left-to-right to reveal the message.
- **Progression**: Increases word length and "noise" density across 3 stages.
- **Teaches**: Spelling, focus, and sequential processing.

> [!NOTE]
> **Technical Deep Dive: Mystery Messages Architecture**
>
> <details>
> <summary>Click to see Word System & Combinations</summary>
>
> #### Phrase Generation
>
> Phrases are composed from categorized JSON word banks located in `src/components/game/mystery-messages/utils/words/`.
>
> | File              | Contents              |
> | ----------------- | --------------------- |
> | `animals.json`    | 80+ animals           |
> | `nature.json`     | 80+ nature words      |
> | `food.json`       | 80+ food words        |
> | `things.json`     | 100+ everyday objects |
> | `adjectives.json` | 150+ adjectives       |
> | `verbs.json`      | 100+ action verbs     |
>
> #### Stage Progression
>
> | Stage | Template        | Example          |
> | ----- | --------------- | ---------------- |
> | 1     | Single noun     | `CAT`            |
> | 2     | ADJ + NOUN      | `WET FOX`        |
> | 3     | Complex phrases | `FAST DEER LEAP` |
>
> #### Unique Puzzle Combinations
>
> With over **24.8 million** possible combinations, a child playing twice daily would encounter less than **0.025%** of the content in a year.
>
> </details>

### ↔️ Left-Right Match (Age 2+)

A directional awareness game that teaches kids to distinguish between left and right.

- **Goal**: Identify which side (Left/Right) contains the target object (e.g., "Where is the Elephant?").
- **Interaction**: Click/Tap or use Arrow Keys.
- **Teaches**: Lateral awareness, object identification.

### 🦁 The Big Parade (Age 2+)

An interactive discovery game featuring a vibrant animal parade.

- **Goal**: Help the animals move across the screen by pressing the Spacebar.
- **Feedback**: Each animal blast triggers a sound effect and name display.
- **Teaches**: Cause and effect, animal names/sounds.

### 🎁 Surprise Box (Age 2+)

A game of persistence and delightful rewards.

- **Goal**: Tap the box repeatedly to build up energy until it "pops".
- **Reward**: A random high-value emoji reward with a confetti celebration.
- **Teaches**: Persistence, fine motor timing.

</details>

## 🏗️ Technical Architecture

<details>
<summary><strong>Unified Game Framework</strong></summary>

All games are built using a standardized framework that separates UI from Logic:

1.  **Shared Components**: Reusable UI elements (`GameActionButton`, `GameInstructionPill`, `GameFeedbackBanner`, `GameProgressDots`) ensure a premium, consistent experience.
2.  **Custom Hooks**: Business logic is encapsulated in game-specific hooks (e.g., `useAlphabetHuntLogic`), making the visual components lightweight and purely representational.
3.  **Strict Testing**: Every game is backed by an automated test suite ensuring reliability across all stages and interactions.
</details>

<details>
<summary><strong>Development Standards & Workflows</strong></summary>

- **Agentic Workflows**: Located in `.agent/workflows`, our custom agentic commands (`/pr-creator`, `/code-reviewer`) enforce production-grade standards autonomously.
- **Code Style**: Strictly enforced via Prettier and comprehensive ESLint rules.
- **Conventional Commits**: Enforced via Husky and Commitlint (`.commitlintrc.cjs`).

## Design System

- Styled with **Tailwind CSS**.
- UI components built with **shadcn/ui**.
- Custom Brand Theme: **Zesty Macaroons** (Neon Green, Kelly Green, Freesia, Yellow).
