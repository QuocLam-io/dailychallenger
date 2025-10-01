//Supabase
import { supabase } from "@/supabase-client";

//Zustand
import useChallengesStore from "@/stores/challengesStore";
import { useUserStore } from "@/stores/userStore";
//Utils
import { calculateLongestStreak } from "@/utils/calculateStreak";

const updateLongestStreak = async (supabaseId: string) => {
  const { challenges } = useChallengesStore.getState();
  const { setLongestStreak } = useUserStore.getState();

  // Calculate the new longest streak
  const longestStreak = calculateLongestStreak(challenges);

  // Update in Supabase users table
  const { error } = await supabase
    .from("users")
    .update({ longest_streak: longestStreak })
    .eq("id", supabaseId);

  if (error) {
    console.error("Error updating longest streak:", error.message);
  } else {
    // Update local store
    setLongestStreak(longestStreak);
  }
};

export const toggleChallengeCompletion = async (
  supabaseId: string,
  challengeLogId: string,
  isCurrentlyCompleted: boolean
) => {
  const { fetchChallenges } = useChallengesStore.getState();

  if (!supabaseId || !challengeLogId) return;

  // Toggle completion status
  // Use local date at start of day in UTC to match streak calculation
  const now = new Date();
  const localDateInUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  const updateData = isCurrentlyCompleted
    ? {
        completed_at: null,
        is_completed: false,
      }
    : {
        completed_at: localDateInUTC.toISOString(),
        is_completed: true,
      };

  const { error: updateError } = await supabase
    .from("challenge_logs")
    .update(updateData)
    .eq("id", challengeLogId);

  if (updateError) {
    console.error("Error toggling challenge completion:", updateError.message);
    return false;
  } else {
    // Refresh the challenges data
    await fetchChallenges(supabaseId);

    // Update longest streak after challenges are refreshed
    await updateLongestStreak(supabaseId);

    return true;
  }
};