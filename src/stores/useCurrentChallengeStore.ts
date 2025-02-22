import { create } from "zustand";

interface CurrentChallengeProps {
  currentChallenge: string;
  setCurrentChallenge: (challenge: string) => void;
}

const useCurrentChallengeStore = create<CurrentChallengeProps>((set) => ({
  currentChallenge: "",
  setCurrentChallenge: (challenge) => {
    set({ currentChallenge: challenge });
  },
}));

export default useCurrentChallengeStore;
