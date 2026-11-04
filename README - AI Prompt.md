# CreativePortfolio — Janica Centino

> **AI CONTEXT & SYSTEM INSTRUCTIONS:**  
> This document serves as the single source of truth for all AI coding assistants (GitHub Copilot, Cursor, Claude, Gemini, ChatGPT) working on this repository. Read this file completely before generating, refactoring, or suggesting any code.

---

## 1. Strict Rules for AI Assistants

1. **Always Provide 100% Complete Code:**
   * When creating or updating any file, **always output the complete file from top to bottom**.
   * **NEVER** use placeholders like `// ... existing code ...`, `// rest of component`, or partial snippets. Every code block must be immediately copy-pasteable.
2. **Strictly Follow the File Directory:**
   * Never invent new folder structures or rename existing files without explicit permission.
   * Always verify relative import paths against the official directory tree in Section 4.
3. **Tailwind CSS v4 Compliance:**
   * This project uses **Tailwind CSS v4** via the `@tailwindcss/vite` plugin.
   * **DO NOT** suggest running `npx tailwindcss init -p`, creating `tailwind.config.js`, or adding `@tailwind base; @tailwind components; @tailwind utilities;`.
   * Global styles and custom utilities live inside `src/index.css` using `@import "tailwindcss";` and `@layer utilities`.

---

## 2. Project Overview & Core Goal

* **Owner:** Janica Centino (UI/UX Designer, Researcher, & Graphic Designer)
* **Concept:** *"DISMANTLED GRID. PROGRAMMED VISCERAL."*
* **Primary Goal:** Build a high-contrast, interactive dark-mode portfolio that showcases UI/UX case studies and graphic design works with zero layout lag and fast asset loading.
* **Key Problem Solved:** Previous portfolio suffered from slow image and video loading. This build enforces strict asset optimization (`.webp` / `.avif`), code-splitting (`React.lazy`), and `Suspense` preloading boundaries.

---

## 3. Tech Stack & Configuration

* **Framework & Bundler:** React (Vite `create-vite`)
* **Linter:** ESLint
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
* **2D Animations & Micro-interactions:** Framer Motion (`framer-motion`) & GSAP (`gsap`)
* **3D & WebGL Rendering:** Three.js (`three`), React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`)
* **Routing:** React Router DOM (`react-router-dom`)

### `vite.config.js` Reference
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})