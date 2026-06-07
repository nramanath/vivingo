---
description: Specific styling, theming, and layout constraints using Tailwind CSS v4 in Vivingo
---

# Tailwind CSS v4 & Styling Guidelines

This rule file defines styling practices for Vivingo using Tailwind CSS v4 and the custom design system. All styling edits must adhere to these standards.

## 1. CSS-First Theme Configuration (Tailwind v4)

Tailwind v4 deprecates `tailwind.config.js` in favor of a CSS-first configuration model.

- **Theme Definition**: All custom theme variables, fonts, colors, and keyframes must be registered inside [global.css](../../src/styles/global.css) under the `@theme` directive or within CSS layers (`@layer base`, `@layer utilities`, `@layer components`).
- **Do NOT Edit `tailwind.config.js`**: Do not attempt to add plugins or configuration options to `tailwind.config.js` or write standard Tailwind v3 configuration files.
- **CSS Import**: The file [global.css](../../src/styles/global.css) relies on the v4 compiler import `@import 'tailwindcss';` at the top of the file.

## 2. Color Palette & Theming (Zesty Macaroons)

To maintain a professional yet playful child-friendly aesthetic, avoid using generic Tailwind color utilities (e.g. `bg-red-500`, `text-blue-600`) for primary elements.
Instead, use the **Zesty Macaroons** brand variables defined in `:root`:

- **Neon Green**: `#c5e5a5` / CSS Var: `var(--color-neon-green)` / Tailwind: `bg-[var(--color-neon-green)]` or `text-[var(--color-neon-green)]`
- **Kelly Green**: `#98b66e` / CSS Var: `var(--color-kelly-green)` / Tailwind: `bg-[var(--color-kelly-green)]`
- **Freesia**: `#f9d876` / CSS Var: `var(--color-freesia)` / Tailwind: `bg-[var(--color-freesia)]`
- **Yellow**: `#fbe39d` / CSS Var: `var(--color-yellow)` / Tailwind: `bg-[var(--color-yellow)]`

## 3. Predefined Interactive Styling

Use the customized animated gradients and cards defined in [global.css](../../src/styles/global.css) to build interfaces that feel premium:

- **Game/Action Cards**: Use `gradient-card-base` class name which provides a custom radial gradient background, smooth layout transitions, and animated border effects on hover.
- **Buttons**:
  - Primary Game Buttons (Play, Restart): Use `gradient-brand-button` class name.
  - Secondary/Alternative Buttons: Use `gradient-button-variant` class name.

## 4. Micro-Animations

Inject visual polish using the built-in Tailwind animations:

- **Floating Items**: Add `animate-float` class to make items bob up and down gently. Perfect for start screens or success badges.
- **Shimmer Effects**: Add `animate-shimmer` class to introduce subtle light sweeps across loading cards or background panels.
- **Dynamic Backgrounds**: Add `animate-gradient-bg` to shift color gradients over time.

## 5. Typography

- **Playful Elements (For kids/parents)**: Apply `font-fredoka` class name to headers, labels, and instructional prompts.
- **System Labels & Data**: Apply `font-inter` for small UI labels, buttons, or technical controls.
