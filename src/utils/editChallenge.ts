//Supabase
import { supabase } from "@/supabase-client";

//Zustand
import { useChallengeDetailsPageStore, useModalsStore, useChallengesStore } from "@/stores";

export const editChallengeHandler = async (
  supabaseId: string,
  challenge: string,
  emoji: string,
  challengeDetailsPageChallenge: { id: string }
) => {
  const { toggleEditChallengeModalOpen } = useModalsStore.getState();
  const { setChallengeDetailsPageChallenge } =
    useChallengeDetailsPageStore.getState();
  const { fetchChallenges } = useChallengesStore.getState();

  if (!supabaseId || !challenge || !emoji || !challengeDetailsPageChallenge?.id)
    return;

  //Check if new challenge exists in Challenges table first
  const { data: existingChallenge } = await supabase
    .from("challenges")
    .select("id")
    .eq("title", challenge)
    .single();

  let challengeId = existingChallenge?.id;

  //If challenge doesn't exist in the Challenges Table, make one
  if (!challengeId) {
    const { data: newChallenge, error: insertError } = await supabase
      .from("challenges")
      .insert({
        title: challenge,
        created_by: supabaseId,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Edit Challenge creation error:", insertError.message);
      return;
    }

    challengeId = newChallenge?.id;

    //Update current challenge_log's id and emoji to new challenge
    const { error: updateError } = await supabase
      .from("challenge_logs")
      .update({
        challenge_id: challengeId,
        emoji: emoji,
      })
      .eq("id", challengeDetailsPageChallenge.id);

    if (updateError) {
      console.error("Error updating challenge log:", updateError.message);
    } else {
      // Fetch updated challenge data
      const { data: updatedChallenge } = await supabase
        .from("challenge_logs")
        .select(`
          *,
          challenges!inner(title)
        `)
        .eq("id", challengeDetailsPageChallenge.id)
        .single();

      if (updatedChallenge) {
        const formattedChallenge = {
          ...updatedChallenge,
          title: updatedChallenge.challenges.title,
        };
        setChallengeDetailsPageChallenge(formattedChallenge);
      }

      toggleEditChallengeModalOpen();
      await fetchChallenges(supabaseId);
    }

    return;
  }

  // If challenge does exist in Challenges Table, than just update the challenge_log's id and emoji
  if (challengeId) {
    const { error: updateError } = await supabase
      .from("challenge_logs")
      .update({
        challenge_id: challengeId,
        emoji: emoji,
      })
      .eq("id", challengeDetailsPageChallenge.id);

    if (updateError) {
      console.error("Error updating challenge log:", updateError.message);
    } else {
      // Fetch updated challenge data
      const { data: updatedChallenge } = await supabase
        .from("challenge_logs")
        .select(`
          *,
          challenges!inner(title)
        `)
        .eq("id", challengeDetailsPageChallenge.id)
        .single();

      if (updatedChallenge) {
        const formattedChallenge = {
          ...updatedChallenge,
          title: updatedChallenge.challenges.title,
        };
        setChallengeDetailsPageChallenge(formattedChallenge);
      }

      toggleEditChallengeModalOpen();
      await fetchChallenges(supabaseId);
    }
  }
};
