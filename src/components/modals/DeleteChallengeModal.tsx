//Styling
import "./DeleteChallengeModal.scss";
//Components
import { Overlay } from "@/components/shared";
//Zustand
import { useModalsStore, useChallengesStore, useUserStore } from "@/stores";
//Util
import { handleDeleteChallenge } from "@/utils/deleteChallenge";
//Routing
import { useNavigate, useLocation } from "react-router-dom";

const DeleteChallengeModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    deleteChallengeId,
    setDeleteChallengeId,
    toggleDeleteChallengeModalOpen,
  } = useModalsStore();
  const { fetchChallenges } = useChallengesStore();
  const supabaseId = useUserStore((s) => s.supabaseId);

  /* -------------------------- Handle Confirm Delete ------------------------- */

  const handleConfirmDelete = () => {
    if (deleteChallengeId && supabaseId) {
      const isOnDetailsPage = location.pathname.includes("challenge-details");

      handleDeleteChallenge(
        deleteChallengeId,
        supabaseId,
        fetchChallenges,
        () => {
          handleCloseDeleteChallengeModal();
          if (isOnDetailsPage) {
            navigate("/home");
          }
        }
      );
    }
  };

  /* ---------------------- Close Delete Challenge Modal ---------------------- */

  const handleCloseDeleteChallengeModal = () => {
    toggleDeleteChallengeModalOpen();
    setDeleteChallengeId(null);
  };

  return (
    <Overlay onOverlayClick={handleCloseDeleteChallengeModal}>
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
