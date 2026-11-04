<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Instructions

## Commands
- **Dev**: `npm run dev` (Turbopack)
- **Build**: `npm run build`
- **Typecheck**: `npx tsc --noEmit`
- **Lint**: `npm run lint` (`eslint` flat config)
- **Add UI Component**: `npx shadcn add <component>`

## Architecture & Conventions
- **Framework & Runtime**: Next.js 16 (App Router) on React 19.
- **Next Config Flags (`next.config.ts`)**: `reactCompiler: true`, `cacheComponents: true`, and `partialPrefetching: true` (PPR) are active.
- **Styling**: Tailwind CSS v4 using `@tailwindcss/turbopack`. There is no `tailwind.config.js`; themes and CSS variables reside in `src/app/globals.css`.
- **UI Components**: shadcn with `base-nova` style built on `@base-ui/react` primitives (not Radix UI). Components live in `src/components/ui/`.
- **Class Utilities**: `cn` is re-exported from the `cn` package via `src/lib/utils.ts` (`import { cn } from "@/lib/utils"`), not `clsx` + `tailwind-merge`.
- **Path Aliases** (`tsconfig.json`): `@/*` maps to `./src/*` (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`).

## Operational Gotchas
- **Preserve Next.js Block**: Keep the `<!-- BEGIN:nextjs-agent-rules -->` block intact in `AGENTS.md`; `next dev` automatically regenerates it if altered.
- **React 19 Linting**: ESLint enforces `react-hooks/set-state-in-effect`. Synchronous `setState` calls inside `useEffect` bodies trigger lint failures.

