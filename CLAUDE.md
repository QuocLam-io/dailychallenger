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
- use Context7 to check up-to-date docs when needed for implementing new libraries or frameworks, or adding features using them.

---

## Planned Feature: Cheers

View friends' current challenges and cheer them on. Cheers show as avatars in the dashboard header.

### Files to Create

1. **`/src/types/social.ts`** - Types for FriendUser, Friendship, Cheer, FriendChallenge, ReceivedCheer

2. **`/src/stores/socialStore.ts`** - Zustand store with:
   - State: `friends`, `friendsChallenges`, `receivedCheers`
   - Actions: `fetchFriends`, `fetchFriendsChallenges`, `fetchReceivedCheers`, `addCheer`, `removeCheer`

3. **`/src/components/CheerButton.tsx`** - One-click cheer button with confetti animation (uses `partycles` like ChallengeCard)

4. **`/src/components/FriendChallengeCard.tsx`** - Displays friend's challenge with CheerButton (simpler than ChallengeCard, no done/dropdown)

5. **`/src/components/CheersAvatarGroup.tsx`** - Shows avatars of friends who cheered (replaces "No cheers yet" placeholder)

### Files to Modify

- **`/src/pages/Home.tsx`**:
  - Replace lines 195-199 (placeholder) with `<CheersAvatarGroup />`
  - Add friends' challenges section after line 248 (below user's current challenges)

- **`/src/pages/Home.scss`** - Add `.dashboard_friends-challenges` styles

### Implementation Order
1. Types → 2. Store → 3. Components (CheerButton, FriendChallengeCard, CheersAvatarGroup) → 4. Update Home.tsx/scss

### DB Tables (already exist)
- `friendships` - user_id, friend_id, status (pending/accepted)
- `cheers` - challenge_log_id, user_id