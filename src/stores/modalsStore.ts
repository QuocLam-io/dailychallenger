import { create } from "zustand";
interface ModalsProps {
  // -- Delete Modal Types
  deleteChallengeModalOpen: boolean;
  deleteChallengeId: string | null;
  toggleDeleteChallengeModalOpen: () => void;
  setDeleteChallengeId: (challengeId: string | null) => void;
  // -- Edit Modal Types
  editChallengeModalOpen: boolean;
  toggleEditChallengeModalOpen: () => void;
}

export const useModalsStore = create<ModalsProps>((set, get) => ({
  // -- Delete Modal States & Setters & Getters
  deleteChallengeModalOpen: false,
  deleteChallengeId: null,
  toggleDeleteChallengeModalOpen: () => {
    set({ deleteChallengeModalOpen: !get().deleteChallengeModalOpen });
  },
  setDeleteChallengeId: (challengeId: string | null) => {
    set({ deleteChallengeId: challengeId });
  },

  // -- Edit Modal States & Setters & Getters
  editChallengeModalOpen: false,
  toggleEditChallengeModalOpen: () => {
    set({ editChallengeModalOpen: !get().editChallengeModalOpen });
  },
}));
