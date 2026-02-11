import { create } from "zustand";
import { supabase } from "@/supabase-client";
import type { Challenge, RecurringChallenge } from "@/types";

// Re-export types and utilities for backwards compatibility
export type { Challenge, RecurringChallenge, RepeatFrequency } from "@/types";
export { durationDaysToFrequency, frequencyToDurationDays } from "@/types";

interface ChallengesProps {
  challenges: Challenge[];
  currentChallenges: Challenge[];
  pastChallenges: Challenge[];
  needsUserAction: Challenge[];
  recurringChallenges: RecurringChallenge[];
  fetchChallenges: (supabaseUserId: string) => Promise<void>;
}

const useChallengesStore = create<ChallengesProps>((set) => ({
  challenges: [],
  currentChallenges: [],
  pastChallenges: [],
  needsUserAction: [],
  recurringChallenges: [],
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

      console.log("Fetched challenge logs from DB:", logs);

      const challengeIds = logs.map((log) => log.challenge_id);
      const recurringIds = logs
        .map((log) => log.recurring_challenge_id)
        .filter(Boolean);

      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select("id, title")
        .in("id", challengeIds);

      if (challengeError || !challengeData) {
        console.error("Failed to fetch challenge titles", challengeError);
        return;
      }

      let recurringData: RecurringChallenge[] = [];
      if (recurringIds.length > 0) {
        const { data, error: recurringError } = await supabase
          .from("recurring_challenges")
          .select("*")
          .in("id", recurringIds);

        if (recurringError) {
          console.error("Failed to fetch recurring challenges", recurringError);
        } else {
          recurringData = data ?? [];
        }
      }

      const now = new Date();

      const enriched = logs.map((log) => {
        const match = challengeData.find((c) => c.id === log.challenge_id);
        return {
          ...log,
          title: match?.title ?? "Untitled",
        };
      });

      const past = enriched
        .filter((c) => {
          const deadlinePassed = new Date(c.deadline) < now;
          return deadlinePassed;
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const current = enriched
        .filter((c) => {
          const deadlinePassed = new Date(c.deadline) < now;
          return !deadlinePassed;
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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
        recurringChallenges: recurringData,
      });
    } catch (err) {
      console.error("Unexpected error in fetchChallenges:", err);
    }
  },
}));

export default useChallengesStore;
