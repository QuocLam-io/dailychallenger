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
