//Styling
import "./DeleteChallengeModal.scss";
//Components
import Overlay from "../Overlay";
//Zustand
import { useModalsStore } from "@/stores/modalsStore";
import useChallengesStore from "@/stores/challengesStore";
import { useUserStore } from "@/stores/userStore";
//Util
import { handleDeleteChallenge } from "@/utils/deleteChallenge";

const DeleteChallengeModal = () => {
  const {
    deleteChallengeId,
    setDeleteChallengeId,
    toggleDeleteChallengeModalOpen,
  } = useModalsStore();
  const { fetchChallenges } = useChallengesStore();
  const { userId } = useUserStore();

  /* -------------------------- Handle Confirm Delete ------------------------- */

  const handleConfirmDelete = () => {
    if (!deleteChallengeId) return;

    handleDeleteChallenge(
      deleteChallengeId,
      userId,
      fetchChallenges,
      handleCloseDeleteChallengeModal
    );
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
          <button onClick={handleConfirmDelete}>Yes, Delete</button>
        </div>
      </div>
    </Overlay>
  );
};

export default DeleteChallengeModal;
