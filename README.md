# Orbit

Orbit is a portfolio-grade project operations workspace inspired by the speed of Linear, the flexibility of Notion, and the planning depth of modern issue trackers—without cloning any of them.

## Product surface

- Responsive Kanban with real pointer drag-and-drop and optimistic feedback
- Dense issue list, filtering, roadmap timeline, projects and notification inbox
- Rich issue detail with properties, subtasks, activity and comments
- Global command palette (`Ctrl/Cmd + K`) and quick-create shortcut (`C`)
- Light/dark themes, mobile drawer, accessible focus states and reduced-motion support
- Professional Orbit Labs demo workspace with realistic projects and issues

## Stack

- React 19, TypeScript, Vinext/Next-compatible App Router
- Tailwind CSS 4 and shadcn primitives
- dnd-kit for accessible drag-and-drop
- Supabase SSR/client packages, PostgreSQL schema, RLS and Realtime publication
- Zod and React Hook Form available for production forms

## Architecture

The current portfolio experience is intentionally demo-ready without credentials: product interactions use client state so reviewers can explore immediately. The Supabase boundary lives in `lib/supabase`, while the production database contract is versioned under `supabase/migrations`. Supplying the two public environment variables activates the hosted client without exposing privileged keys.

## Database and security

The foundation migration models profiles, workspaces, role-based membership, teams, projects, cycles, issues, labels, comments, activities and notifications. Public tables have RLS enabled. Issue read/write policies require workspace membership, write policies restrict guests, and Realtime is enabled only for issues, comments and notifications.

## Setup

1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env.local`
3. Add the Supabase project URL and publishable key
4. Apply the migration through Supabase CLI or the connected Supabase tooling
5. Start development: `pnpm dev`

## Environment variables

| Name | Visibility | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | RLS-scoped browser key |

Never expose a Supabase secret or service-role key in a `NEXT_PUBLIC_` variable.

## Quality checks

- `pnpm lint` — static analysis and type-aware linting
- `pnpm build` — production/Cloudflare Worker build
- Browser QA covers responsive navigation, themes, issue creation, search, dialogs and console errors

## Deployment

The project is configured for OpenAI Sites through `.openai/hosting.json`. It emits Cloudflare Worker-compatible ESM output through the Sites Vite plugin.

## Roadmap

- Connect a dedicated Supabase project and apply the versioned schema
- Add authenticated onboarding and workspace invitations
- Persist issue mutations and uploads with optimistic rollback
- Add Playwright regression specs and visual snapshots
- Add project timeline editing, cycle planning and granular bulk actions
