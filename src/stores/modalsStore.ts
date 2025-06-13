import { create } from "zustand";

interface ModalsProps {
  deleteChallengeId: string | null;
  deleteChallengeModalOpen: boolean;
  toggleDeleteChallengeModalOpen: () => void;
  setDeleteChallengeId: (challengeId: string | null) => void;
}

export const useModalsStore = create<ModalsProps>((set, get) => ({
  deleteChallengeId: null,
  deleteChallengeModalOpen: false,
  toggleDeleteChallengeModalOpen: () => {
    set({ deleteChallengeModalOpen: !get().deleteChallengeModalOpen });
  },
  setDeleteChallengeId: (challengeId: string) => {
    set({ deleteChallengeId: challengeId });
  },
}));
