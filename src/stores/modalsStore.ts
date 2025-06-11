import { create } from "zustand";

interface ModalsProps {
  deleteChallengeModalOpen: boolean;
  toggleDeleteChallengeModalOpen: () => void;
}

export const useModalsStore = create<ModalsProps>((set, get) => ({
  deleteChallengeModalOpen: false,
  toggleDeleteChallengeModalOpen: () => {
    set({ deleteChallengeModalOpen: !get().deleteChallengeModalOpen });
  },
}));
