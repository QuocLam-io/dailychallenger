# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Vite dev server)
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Linting**: `npm run lint` (ESLint with TypeScript support)
- **Testing**: `npm test` or `npm run test` (Vitest unit tests)
- **Test UI**: `npm run test:ui` (Vitest UI interface)
- **Preview**: `npm run preview` (preview production build)

### Test Structure
- **Unit tests**: Vitest (`.test.ts`, `.test.jsx` files in `/src/tests/`)
- **E2E tests**: Playwright (files in `/src/e2e/`)
- **Test exclusions**: E2E tests excluded from Vitest, spec files excluded

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: SCSS + Tailwind CSS
- **State Management**: Zustand stores
- **Authentication**: Clerk (3rd party auth service)
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Testing**: Vitest (unit) + Playwright (E2E)

### Key Architecture Patterns

**State Management**: Zustand stores in `/src/stores/` handle different aspects:
- `challengesStore.ts`: Core challenge data and CRUD operations
- `userStore.ts`: User authentication state
- `dashboardStore.ts`: Dashboard-specific state
- `modalsStore.ts`: Modal visibility state
- `usePublicStore.ts`: Public section state (non-authenticated features)

**Authentication Flow**:
- Clerk handles authentication with `PrivateRoutesWrapper.tsx` protecting routes
- Supabase integration creates/manages user records automatically
- Public section allows unauthenticated usage

**Database Integration**:
- Supabase client configured in `supabase-client.ts`
- Main tables: `users`, `challenges`, `challenge_logs`
- Edge functions handle automated tasks (cron job for marking failed challenges)

**Component Structure**:
- Components use SCSS modules alongside Tailwind
- Modals organized in `/src/components/modals/`
- Shared components in `/src/components/shared/`
- UI components from Radix UI in `/src/components/ui/`

**Path Aliases**:
- `@/` resolves to `./src/` (configured in both Vite and tsconfig)

### Key Features
- **Public Section**: Unauthenticated users can create and manage challenges
- **Private Dashboard**: Full challenge management with Clerk authentication
- **Automated Scheduling**: Supabase Edge Function marks overdue challenges as failed
- **Real-time Updates**: Supabase integration with optimistic UI updates

### Environment Variables
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_KEY`: Supabase anon/public key
- Clerk environment variables for authentication