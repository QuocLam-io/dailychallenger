import { create } from "zustand";
import { supabase } from "@/supabase-client";

export type Challenge = {
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
  is_dismissed: boolean;
};

interface ChallengesProps {
  challenges: Challenge[];
  currentChallenges: Challenge[];
  pastChallenges: Challenge[];
  needsUserAction: Challenge[];
  fetchChallenges: (supabaseUserId: string) => Promise<void>;
}

const useChallengesStore = create<ChallengesProps>((set) => ({
  challenges: [],
  currentChallenges: [],
  pastChallenges: [],
  needsUserAction: [],
  fetchChallenges: async (supabaseUserId: string) => {
    try {
      const { data: logs, error: logError } = await supabase
        .from("challenge_logs")
        .select("*")
        .eq("user_id", supabaseUserId);

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

      const now = new Date();

      const enriched = logs.map((log) => {
        const match = challengeData.find((c) => c.id === log.challenge_id);
        return {
          ...log,
          title: match?.title ?? "Untitled",
        };
      });

      const past = enriched.filter((c) => {
        const deadlinePassed = new Date(c.deadline) < now;
        return deadlinePassed;
      });

      const current = enriched.filter((c) => {
        const deadlinePassed = new Date(c.deadline) < now;
        return !deadlinePassed;
      });

      const needsUserAction = enriched.filter((c) => {
        const deadlinePassed = new Date(c.deadline) < now;
        return (
          !c.completed_at && !c.failed_at && !c.is_dismissed && deadlinePassed
        );
      });

      set({
        challenges: enriched,
        currentChallenges: current,
        pastChallenges: past,
        needsUserAction: needsUserAction,
      });
    } catch (err) {
      console.error("Unexpected error in fetchChallenges:", err);
    }
  },
}));

export default useChallengesStore;
