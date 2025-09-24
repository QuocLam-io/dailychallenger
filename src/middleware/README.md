# Middleware

This folder contains database interaction functions and middleware utilities.

## Structure

- `challenges/` - Challenge-related database operations
  - `completeChallenge.ts` - Mark challenges as completed
  - `createChallenge.ts` - Create new challenges
  - `updateChallenge.ts` - Update existing challenges
  - `deleteChallenge.ts` - Delete challenges

## Usage

These functions handle direct database interactions with Supabase and should be used instead of inline database calls in components.

## TODO

- [ ] Implement completeChallenge function
- [ ] Move existing challenge operations to middleware
- [ ] Add error handling and logging
- [ ] Add TypeScript types for all functions