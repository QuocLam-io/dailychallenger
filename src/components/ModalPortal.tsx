import React from "react";
import ReactDOM from "react-dom";
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
    <>
      {deleteChallengeModalOpen && <DeleteChallengeModal />}
      {editChallengeModalOpen && <EditChallengeModal />}
    </>,
    portalContainer
  );
};

export default ModalPortal;