import { create } from "zustand";
interface ModalsProps {
  // -- Delete Modal Types
  deleteChallengeModalOpen: boolean;
  deleteChallengeId: string | null;
  toggleDeleteChallengeModalOpen: () => void;
  setDeleteChallengeId: (challengeId: string | null) => void;
  // -- Edit Modal Types
  editChallengeModalOpen: boolean;
  editChallengeId: string | null;
  toggleEditChallengeModalOpen: () => void;
  setEditChallengeId: (challengeId: string | null) => void;
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
  // TODO: probably needs more than just id
  editChallengeModalOpen: false,
  editChallengeId: null,
  toggleEditChallengeModalOpen: () => {
    set({ editChallengeModalOpen: !get().editChallengeModalOpen });
  },
  setEditChallengeId: (challengeId: string | null) => {
    set({ editChallengeId: challengeId });
  },
}));
