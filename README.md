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
[![Gemini Code Assist](https://img.shields.io/badge/Gemini_Code_Assist-Automated_PR_Review-4285F4?style=flat-square&logo=googlegemini&logoColor=white)](https://github.com/marketplace/gemini-code-assist)

Building the ultimate toddler learning universe. Interactive, safe, and wildly fun educational games designed entirely for curious tiny minds.

## 🚀 Quickstart

Built for speed and simplicity. We use **Mise** for task management and **Bun** as our ultra-fast runtime.

```bash
# 1. Clone the repository
>_ git clone https://github.com/nramanath/vivingo.git
>_ cd vivingo

# 2. Install & Start (Managed via Mise)
>_ mise run init
>_ mise run dev

[Vite] Server running at http://localhost:5173
```

## 🎮 Games

Vivingo's game library is built on a **Unified Game Architecture**, ensuring a consistent look and feel while keeping game-specific logic completely decoupled.

<details open>
<summary><strong style="font-size: 1.2em; color: #f9d876;">View All Available Games</strong></summary>

<br>

| Game                    | Age | Core Mechanic     | Educational Focus            |
| :---------------------- | :-: | :---------------- | :--------------------------- |
| **🔤 ABC Hunt**         | 3+  | Keyboard matching | Typing, Alphabet Sequence    |
| **🔢 Number Hunt**      | 3+  | Keyboard matching | Number Sequence (1-100)      |
| **🛤️ Number Sequencer** | 4+  | Fill-in-the-blank | Advanced Counting & Patterns |
| **🕵️‍♂️ Mystery Messages** | 3+  | Symbol Decoding   | Reading, Problem Solving     |
| **↔️ Left-Right Match** | 2+  | Arrow Key Choice  | Directional Awareness        |
| **🦁 The Big Parade**   | 2+  | Action timing     | Cause-and-Effect, Vocabulary |
| **🎁 Surprise Box**     | 2+  | Button Mashing    | Discovery, Motor Skills      |
| **🌍 World Explorer**   | 3+  | Number Mapping    | Geography                    |
| **🏐 Ball Maze**        | 4+  | 3D Physics Roll   | Spatial Navigation           |

</details>

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
</details>

## Design System

- Styled with **Tailwind CSS**.
- UI components built with **shadcn/ui**.
- Custom Brand Theme: **Zesty Macaroons** (Neon Green, Kelly Green, Freesia, Yellow).

## 🚢 Continuous Deployment

Fully integrated with **Vercel**. Every push to `main` immediately updates `vivingo.vercel.app`. Every PR gets a unique dynamic preview string sent straight to GitHub for sandbox testing.
