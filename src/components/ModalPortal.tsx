import React from "react";
import ReactDOM from "react-dom";
import { AnimatePresence } from "framer-motion";
import { useModalsStore } from "@/stores/modalsStore";
import DeleteChallengeModal from "@/components/modals/DeleteChallengeModal";
import EditChallengeModal from "@/components/modals/EditChallengeModal";

const ModalPortal: React.FC = () => {
  const { deleteChallengeModalOpen, editChallengeModalOpen } = useModalsStore();

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