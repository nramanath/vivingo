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

### ABC Hunt

A letter-recognition game where kids complete the alphabet by typing the missing letters. The full A–Z grid is shown with some letters hidden as `?` tiles — press the right key and the tile fills in green. Difficulty increases across 3 stages: 1 missing letter at a time → 2 consecutive → 3 consecutive.

### Mystery Messages

A word-decoding game where a jumbled grid hides a secret phrase. Kids type the underlined target letters left-to-right to reveal it. Progresses across 3 stages with increasing word length and noise density.

<details>
<summary><strong>Mystery Messages — Word System Architecture</strong></summary>

#### Phrase Generation

Phrases are composed from **categorized JSON word banks** located in `src/components/game/mystery-messages/utils/words/`:

| File              | Contents                                       |
| ----------------- | ---------------------------------------------- |
| `animals.json`    | 80+ animals (ant, fox, crane, zebra…)          |
| `nature.json`     | 80+ nature words (dew, frost, marsh, thorn…)   |
| `food.json`       | 80+ food words (egg, plum, cake, curry…)       |
| `things.json`     | 100+ everyday objects (bat, kite, helm, rope…) |
| `adjectives.json` | 150+ adjectives (tiny, zesty, coral, fluffy…)  |
| `verbs.json`      | 100+ action verbs (hop, roar, stomp, yelp…)    |

[`random-word-slugs`](https://www.npmjs.com/package/random-word-slugs) auto-supplements the animal and color adjective pools. [`compromise`](https://www.npmjs.com/package/compromise) validates that each composed phrase contains a recognizable noun.

#### Stage Progression

| Stage | Template                                | Word length     | Example          |
| ----- | --------------------------------------- | --------------- | ---------------- |
| 1     | Single noun                             | exactly 3 chars | `CAT`            |
| 2     | ADJ + NOUN                              | 3–4 chars each  | `WET FOX`        |
| 3     | ADJ + NOUN + VERB _or_ ADJ + ADJ + NOUN | 3–5 chars each  | `FAST DEER LEAP` |

#### Unique Puzzle Combinations

| Stage                   | Pool sizes         | Combinations      |
| ----------------------- | ------------------ | ----------------- |
| Stage 1                 | 81 nouns           | **81**            |
| Stage 2                 | 84 adj × 257 nouns | **21,588**        |
| Stage 3 (ADJ+NOUN+VERB) | 184 × 377 × 174    | **12,070,032**    |
| Stage 3 (ADJ+ADJ+NOUN)  | 184 × 183 × 377    | **12,694,344**    |
| **Grand total**         |                    | **~24.8 million** |

A child playing twice daily for an entire year would encounter less than **0.025%** of available combinations.

</details>

## Architecture & Quality Standards

- **Agentic Workflows**: See the `.agent/workflows` directory for our custom agentic workflows (`/pr-creator`, `/code-reviewer`) which enforce production-grade standards autonomously.
- **Code Style**: Strictly enforced via Prettier and comprehensive ESLint rules.
- **Conventional Commits**: Enforced via Husky and Commitlint (`.commitlintrc.cjs`).

## Design System

- Styled with **Tailwind CSS**.
- UI components built with **shadcn/ui**.
- Custom Brand Theme: **Zesty Macaroons** (Neon Green, Kelly Green, Freesia, Yellow).
