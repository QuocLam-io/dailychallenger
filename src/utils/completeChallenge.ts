//Supabase
import { supabase } from "@/supabase-client";

//Zustand
import useChallengesStore from "@/stores/challengesStore";

export const completeChallengeHandler = async (
  supabaseId: string,
  challengeLogId: string
) => {
  const { fetchChallenges } = useChallengesStore.getState();

  if (!supabaseId || !challengeLogId) return;

  // Update challenge_log to mark as completed
  const { error: updateError } = await supabase
    .from("challenge_logs")
    .update({
      completed_at: new Date().toISOString(),
      is_completed: true,
    })
    .eq("id", challengeLogId);

  if (updateError) {
    console.error("Error completing challenge:", updateError.message);
    return false;
  } else {
    // Refresh the challenges data
    fetchChallenges(supabaseId);
    return true;
  }
};