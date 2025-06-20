import { create } from "zustand";
import type { Challenge } from "./challengesStore";

interface ModalsProps {
  // -------------------- Challenge Page Modal State --------------------
  challengePageModalOpen: boolean;
  challengePageChallenge: Challenge | null;
  toggleChallengePageModalOpen: () => void;
  setChallengePageChallenge: (challenge: Challenge | null) => void;

  // -------------------- Delete Challenge Modal State --------------------
  deleteChallengeModalOpen: boolean;
  deleteChallengeId: string | null;
  toggleDeleteChallengeModalOpen: () => void;
  setDeleteChallengeId: (challengeId: string | null) => void;
}

export const useModalsStore = create<ModalsProps>((set, get) => ({
  // -------------------- Challenge Page Modal State --------------------
  challengePageModalOpen: false,
  challengePageChallenge: null,
  toggleChallengePageModalOpen: () => {
    set({ challengePageModalOpen: !get().challengePageModalOpen });
  },
  setChallengePageChallenge: (challenge: Challenge | null) => {
    set({ challengePageChallenge: challenge });
  },

  // -------------------- Delete Challenge Modal State --------------------
  deleteChallengeModalOpen: false,
  deleteChallengeId: null,
  toggleDeleteChallengeModalOpen: () => {
    set({ deleteChallengeModalOpen: !get().deleteChallengeModalOpen });
  },
  setDeleteChallengeId: (challengeId: string | null) => {
    set({ deleteChallengeId: challengeId });
  },
}));
