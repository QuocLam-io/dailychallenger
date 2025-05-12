import { create } from "zustand";

type Challenge = {
  id: string;
  user_id: string;
  challenge_id: string;
  is_public: boolean;
  is_completed: boolean;
  is_failed: boolean;
  failed_at: string;
  deadline: string;
  created_at: string;
  //
  title: string;
  emoji: string;
};

interface ChallengeProps {
  challenges: Challenge[];
  fetchChallenges: () => Promise<void>;
}

// const useChallengeStore = create<ChallengeProps>((set) => ({
//   Challenge: "",
//   setChallenge: (challenge) => {
//     set({ Challenge: challenge });
//   },
// }));

// export default useChallengeStore;
