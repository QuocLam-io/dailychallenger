import React from "react";
//Styling
import "./DeleteChallengeModal.scss";
//Components
import Overlay from "../Overlay";

interface DeleteChallengeModalProps {}

const DeleteChallengeModal = () => {
  return (
    <Overlay>
      <div className="delete-challenge-modal">
        <h2>Delete this challenge?</h2>
        <p>
          Are you sure you want to delete this challenge?
        </p>
        <div className="delete-challenge-modal_action-btns">
          <button>Cancel</button>
          <button>Yes, Delete</button>
        </div>
      </div>
    </Overlay>
  );
};

export default DeleteChallengeModal;
