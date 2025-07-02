import { create } from "zustand";

type UserStore = {
  clerkId: string | null;
  supabaseId: string | null;
  setClerkId: (id: string) => void;
  setSupabaseId: (id: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  clerkId: null,
  supabaseId: null,
  setClerkId: (id) => set({ clerkId: id }),
  setSupabaseId: (id) => set({ supabaseId: id }),
}));