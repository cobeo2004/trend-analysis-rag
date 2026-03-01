# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server (http://localhost:3000)
bun run build        # Production build
bun run lint         # Lint with Biome (biome check)
bun run format       # Auto-format with Biome (biome format --write)
```

## Architecture

Next.js 16 App Router project using a **Page → Screen → View** layering:

- **Page** (`src/app/page.tsx`) — minimal async server component, renders a Screen
- **Screen** (`src/screens/`) — async server component that prefetches data via React Query's `getQueryClient()`, then renders a View
- **View** (`src/views/`) — presentation component, renders UI and wraps client components in `<HydrationBoundary>`

Data fetching flow:
```
Page → Screen (prefetch with getQueryClient)
         → View (dehydrate + HydrationBoundary)
            → Client Components (useQuery via hooks)
               → Services (queryOptions + fetch)
                  → API Routes (workflow execution)
```

### Key layers

- `src/services/` — static classes returning `queryOptions()` objects (e.g. `HelloService.getHello(name)`)
- `src/hooks/` — thin wrappers calling `useQuery(ServiceName.method())`
- `src/components/` — `"use client"` interactive components consuming hooks
- `src/providers/` — React context providers (QueryProvider wraps the app in layout.tsx)
- `src/lib/query.tsx` — QueryClient factory: new client per server request, singleton on client
- `src/server/workflows/` — durable server-side workflows using the `workflow` library (`"use workflow"` / `"use step"` directives)

## Conventions

- **Package manager:** Bun
- **Linter/formatter:** Biome (not ESLint/Prettier) — recommended rules for React and Next.js domains
- **Styling:** Tailwind CSS v4 with dark mode via `dark:` prefix and CSS variables
- **React Compiler** is enabled in next.config.ts
- **Path alias:** `@/*` maps to `src/*`
- **TypeScript strict mode** is on
