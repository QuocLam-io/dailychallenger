import { create } from "zustand";
import type { Challenge } from "@/types";

interface ChallengeDetailsPageProps {
  challengeDetailsPageChallenge: Challenge | null;
  setChallengeDetailsPageChallenge: (challenge: Challenge | null) => void;
}

export const useChallengeDetailsPageStore = create<ChallengeDetailsPageProps>(
  (set) => ({
    challengeDetailsPageChallenge: null,
    setChallengeDetailsPageChallenge: (challenge: Challenge | null) => {
      set({ challengeDetailsPageChallenge: challenge });
    },
  })
);
