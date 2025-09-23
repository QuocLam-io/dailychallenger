import { create } from "zustand";

type UserStore = {
  clerkId: string | null;
  supabaseId: string | null;
  longestStreak: number;
  setClerkId: (id: string) => void;
  setSupabaseId: (id: string) => void;
  setLongestStreak: (streak: number) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  clerkId: null,
  supabaseId: null,
  longestStreak: 0,
  setClerkId: (id) => set({ clerkId: id }),
  setSupabaseId: (id) => set({ supabaseId: id }),
  setLongestStreak: (streak) => set({ longestStreak: streak }),
}));