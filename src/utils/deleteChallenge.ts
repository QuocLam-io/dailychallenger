//Supabase
import { supabase } from "@/supabase-client";

export const handleDeleteChallenge = async (
  deleteChallengeId: string,
  supabaseUserId: string,
  fetchChallenges: (supabaseUserId: string) => void,
  handleCloseDeleteChallengeModal: () => void
) => {
  if (!deleteChallengeId) return;

  const { error: deleteError } = await supabase
    .from("challenge_logs")
    .delete()
    .eq("id", deleteChallengeId);

  if (deleteError) {
    console.error("CHALLENGE DELETION ERROR:", deleteError.message);
    return;
  }

  handleCloseDeleteChallengeModal();
  fetchChallenges(supabaseUserId);
};

export const handleDeleteRecurringChallenge = async (
  recurringChallengeId: string,
  supabaseUserId: string,
  fetchChallenges: (supabaseUserId: string) => void,
  handleCloseDeleteChallengeModal: () => void
) => {
  if (!recurringChallengeId) return;

  // Delete all challenge_logs with this recurring_challenge_id
  const { error: logsDeleteError } = await supabase
    .from("challenge_logs")
    .delete()
    .eq("recurring_challenge_id", recurringChallengeId);

  if (logsDeleteError) {
    console.error("RECURRING CHALLENGE LOGS DELETION ERROR:", logsDeleteError.message);
    return;
  }

  // Delete the recurring_challenges record itself
  const { error: recurringDeleteError } = await supabase
    .from("recurring_challenges")
    .delete()
    .eq("id", recurringChallengeId);

  if (recurringDeleteError) {
    console.error("RECURRING CHALLENGE DELETION ERROR:", recurringDeleteError.message);
    return;
  }

  handleCloseDeleteChallengeModal();
  fetchChallenges(supabaseUserId);
};
