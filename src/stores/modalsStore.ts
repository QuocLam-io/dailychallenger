import { create } from "zustand";
import type { Challenge } from "./challengesStore";

interface ModalsProps {
  // -- Challenge Page Types
  challengePageModalOpen: boolean;
  challengePageChallenge: Challenge | null;
  toggleChallengePageModalOpen: () => void;
  setChallengePageChallenge: (challenge: Challenge | null) => void;
  // -- Delete Modal Types
  deleteChallengeModalOpen: boolean;
  deleteChallengeId: string | null;
  toggleDeleteChallengeModalOpen: () => void;
  setDeleteChallengeId: (challengeId: string | null) => void;
}

export const useModalsStore = create<ModalsProps>((set, get) => ({
  // -- Challenge Page States & Setters & Getters
  challengePageModalOpen: false,
  challengePageChallenge: null,
  toggleChallengePageModalOpen: () => {
    set({ challengePageModalOpen: !get().challengePageModalOpen });
  },
  setChallengePageChallenge: (challenge: Challenge | null) => {
    set({ challengePageChallenge: challenge });
  },

  // -- Delete Modal States & Setters & Getters
  deleteChallengeModalOpen: false,
  deleteChallengeId: null,
  toggleDeleteChallengeModalOpen: () => {
    set({ deleteChallengeModalOpen: !get().deleteChallengeModalOpen });
  },
  setDeleteChallengeId: (challengeId: string | null) => {
    set({ deleteChallengeId: challengeId });
  },
}));
