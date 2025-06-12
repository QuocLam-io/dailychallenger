import React from "react";
//Styling
import "./DeleteChallengeModal.scss";
//Components
import Overlay from "../Overlay";
//Zustand
import { useModalsStore } from "@/stores/modalsStore";
import { useUserStore } from "@/stores/userStore";
import useChallengesStore from "@/stores/challengesStore";

//Supabase
import { supabase } from "@/supabase-client";

const DeleteChallengeModal = () => {
  const { userId } = useUserStore();
  const { fetchChallenges } = useChallengesStore();
  const {
    deleteChallengeId,
    setDeleteChallengeId,
    toggleDeleteChallengeModalOpen,
  } = useModalsStore();

  /* ------------------------ Delete Challenge Handler ------------------------ */
  const handleDeleteChallenge = async () => {
    //TODO: make a unit test after
    if (!deleteChallengeId) return;


    const { error: deleteError } = await supabase
      .from("challenge_logs")
      .delete()
      .eq("id", deleteChallengeId);

    if (deleteError) {
      console.error("CHALLENGE DELETION ERROR:", deleteError.message);
      return;
    } else {
      handleCloseDeleteChallengeModal();
      fetchChallenges(userId);
    }
  };

  /* ---------------------- Close Delete Challenge Modal ---------------------- */

  const handleCloseDeleteChallengeModal = () => {
    toggleDeleteChallengeModalOpen();
    setDeleteChallengeId(null);
  };

  return (
    <Overlay>
      <div className="delete-challenge-modal">
        <h2>Delete this challenge?</h2>
        <p>Are you sure you want to delete this challenge?</p>
        <div className="delete-challenge-modal_action-btns">
          <button onClick={() => handleCloseDeleteChallengeModal()}>
            Cancel
          </button>
          <button onClick={() => handleDeleteChallenge()}>Yes, Delete</button>
        </div>
      </div>
    </Overlay>
  );
};

export default DeleteChallengeModal;
