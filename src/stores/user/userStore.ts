import { create } from "zustand";

type UserStore = {
  clerkId: string | null;
  supabaseId: string | null;
  longestStreak: number;
  role: string | null;
  firstName: string | null;
  lastName: string | null;
  setClerkId: (id: string) => void;
  setSupabaseId: (id: string) => void;
  setLongestStreak: (streak: number) => void;
  setRole: (role: string) => void;
  setFirstName: (firstName: string | null) => void;
  setLastName: (lastName: string | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  clerkId: null,
  supabaseId: null,
  longestStreak: 0,
  role: null,
  firstName: null,
  lastName: null,
  setClerkId: (id) => set({ clerkId: id }),
  setSupabaseId: (id) => set({ supabaseId: id }),
  setLongestStreak: (streak) => set({ longestStreak: streak }),
  setRole: (role) => set({ role }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
}));