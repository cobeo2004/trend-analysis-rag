# Google Search Trends Explorer

Explore 27K+ Google Search Trends across 84 countries (2001-2020) with AI-powered insights. Built with Next.js 16, Workflow DevKit, and the Vercel AI SDK.

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

```bash
bun run dev          # Start dev server
bun run build        # Production build
bun run lint         # Lint with Biome
bun run format       # Auto-format with Biome
```

## Architecture

Next.js 16 App Router with a **Page → Screen → View** layering pattern.

### Data Processing

A durable workflow (`src/server/workflows/process-trends/`) parses a CSV of search trends, stores them in Turso (libSQL) via Prisma, and generates vector embeddings via OpenRouter. Each step uses `RetryableError` for resilient retry handling.

### AI Insights

A `DurableAgent` workflow (`src/server/workflows/insights-agent/`) powers the insights panel. It uses tool-calling to search trends via vector similarity or Prisma filters, then streams an analysis back to the client via `WorkflowChatTransport`.

### Key Layers

| Layer      | Location                | Role                                        |
| ---------- | ----------------------- | ------------------------------------------- |
| Services   | `src/services/`         | `queryOptions()` objects for React Query    |
| Hooks      | `src/hooks/`            | Thin wrappers around `useQuery` / `useChat` |
| Components | `src/components/`       | `"use client"` interactive UI               |
| Workflows  | `src/server/workflows/` | Durable server-side workflows               |
| API Routes | `src/app/api/`          | Workflow entry points                       |

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Compiler)
- **Workflows:** Vercel Workflow DevKit
- **AI:** Vercel AI SDK + OpenRouter (Claude 3.5 Haiku, text-embedding-3-small)
- **Database:** Turso (libSQL) with Prisma ORM + vector search
- **Styling:** Tailwind CSS v4
- **Linter/Formatter:** Biome
- **Package Manager:** Bun
