import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useModalsStore } from "@/stores";
import { DeleteChallengeModal, EditChallengeModal } from "@/components/modals";

const ModalPortal: React.FC = () => {
  const location = useLocation();
  const {
    deleteChallengeModalOpen,
    editChallengeModalOpen,
    toggleDeleteChallengeModalOpen,
    toggleEditChallengeModalOpen,
    setDeleteChallengeId
  } = useModalsStore();

  useEffect(() => {
    // Reset modal states when route changes
    if (deleteChallengeModalOpen) {
      toggleDeleteChallengeModalOpen();
      setDeleteChallengeId(null);
    }
    if (editChallengeModalOpen) {
      toggleEditChallengeModalOpen();
    }
  }, [location.pathname]);

  // Get or create the portal container
  const getPortalContainer = () => {
    let container = document.getElementById("modal-portal");
    if (!container) {
      container = document.createElement("div");
      container.id = "modal-portal";
      document.body.appendChild(container);
    }
    return container;
  };

  const portalContainer = getPortalContainer();

  return ReactDOM.createPortal(
    <AnimatePresence>
      {deleteChallengeModalOpen && <DeleteChallengeModal key="delete-modal" />}
      {editChallengeModalOpen && <EditChallengeModal key="edit-modal" />}
    </AnimatePresence>,
    portalContainer
  );
};

export default ModalPortal;