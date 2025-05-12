import { create } from "zustand";
import { supabase } from "@/supabase-client";

type Challenge = {
  challenge_id: string;
  completed_at: string;
  created_at: string;
  deadline: string;
  emoji: string;
  failed_at: string;
  id: string;
  is_completed: boolean;
  is_failed: boolean;
  is_public: boolean;
  title: string;
  user_id: string;
};

interface ChallengesProps {
  challenges: Challenge[];
  fetchChallenges: (userId: string) => Promise<void>;
}

const useChallengesStore = create<ChallengesProps>((set) => ({
  challenges: [],
  fetchChallenges: async (userId: string) => {
    try {
      const { data: logs, error: logError } = await supabase
        .from("challenge_logs")
        .select("*")
        .eq("user_id", userId);

      if (logError || !logs) {
        console.error("Failed to fetch challenge logs", logError);
        return;
      }

      const challengeIds = logs.map((log) => log.challenge_id);

      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select("id, title")
        .in("id", challengeIds);

      if (challengeError || !challengeData) {
        console.error("Failed to fetch challenge titles", challengeError);
        return;
      }

      const enriched = logs.map((log) => {
        const match = challengeData.find((c) => c.id === log.challenge_id);
        return {
          ...log,
          title: match?.title ?? "Untitled",
        };
      });

      set({ challenges: enriched });
    } catch (err) {
      console.error("Unexpected error in fetchChallenges:", err);
    }
  },
}));

export default useChallengesStore;
