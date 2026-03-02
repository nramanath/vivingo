# Vivingo 🎮

Building the ultimate toddler learning universe. Interactive, safe, and wildly fun educational games designed entirely for curious tiny minds.

## 🚀 Getting Started

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

## 🏗️ Architecture & Quality Standards

- **Agentic Workflows**: See the `.agent/workflows` directory for our custom agentic workflows (`/pr-creator`, `/code-reviewer`) which enforce production-grade standards autonomously.
- **Code Style**: Strictly enforced via Prettier and comprehensive ESLint rules.
- **Conventional Commits**: Enforced via Husky and Commitlint (`.commitlintrc.cjs`).

## 🎨 Design System

- Styled with **Tailwind CSS**.
- UI components built with **shadcn/ui**.
- Custom Brand Theme: **Zesty Macaroons** (Neon Green, Kelly Green, Freesia, Yellow).
