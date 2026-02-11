//Styling
import "./DeleteChallengeModal.scss";
//Components
import { Overlay } from "@/components/shared";
//Zustand
import { useModalsStore, useChallengesStore, useUserStore } from "@/stores";
//Util
import { handleDeleteChallenge, handleDeleteRecurringChallenge } from "@/utils/deleteChallenge";
//Routing
import { useNavigate, useLocation } from "react-router-dom";

const DeleteChallengeModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    deleteChallengeId,
    deleteRecurringChallengeId,
    setDeleteChallengeId,
    setDeleteRecurringChallengeId,
    toggleDeleteChallengeModalOpen,
  } = useModalsStore();
  const { fetchChallenges } = useChallengesStore();
  const supabaseId = useUserStore((s) => s.supabaseId);

  const isRecurringDelete = !!deleteRecurringChallengeId;

  /* -------------------------- Handle Confirm Delete ------------------------- */

  const handleConfirmDelete = () => {
    const isOnDetailsPage = location.pathname.includes("challenge-details");

    if (isRecurringDelete && deleteRecurringChallengeId && supabaseId) {
      handleDeleteRecurringChallenge(
        deleteRecurringChallengeId,
        supabaseId,
        fetchChallenges,
        () => {
          handleCloseDeleteChallengeModal();
          if (isOnDetailsPage) {
            navigate("/home");
          }
        }
      );
    } else if (deleteChallengeId && supabaseId) {
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
    setDeleteRecurringChallengeId(null);
  };

  return (
    <Overlay onOverlayClick={handleCloseDeleteChallengeModal}>
      <div className="delete-challenge-modal">
        <h2>
          {isRecurringDelete
            ? "Delete entire recurring challenge?"
            : "Delete this challenge?"}
        </h2>
        <p>
          {isRecurringDelete
            ? "This will delete all instances of this recurring challenge. This action cannot be undone."
            : "Are you sure you want to delete this challenge?"}
        </p>
        <div className="delete-challenge-modal_action-btns">
          <button onClick={() => handleCloseDeleteChallengeModal()}>
            Cancel
          </button>
          <button onClick={handleConfirmDelete}>
            {isRecurringDelete ? "Yes, Delete All" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default DeleteChallengeModal;
