import React, { useState } from "react";
//Styling
import "./FilledLanding.scss";
import { AnimatePresence } from "framer-motion";
import OldTimeyLamp from "../assets/old-timey-lamp.png";
import CheckmarkBW from "../assets/checkmark-bw-circle.png";
import VerticalEllipsis from "../assets/vertical-ellipsis-grey.png";
import EditPencil from "../assets/edit-pencil-grey.png";
import DeleteTrashcan from "../assets/delete-trashcan-grey.png";
//Components
import Overlay from "./Overlay";
import { PublicChallengeTypes } from "../pages/LandingPage";
import { PublicChallengerForm } from "./EmptyLanding";

interface FilledLandingProps {
  publicChallenge: PublicChallengeTypes;
  setPublicChallenge: React.Dispatch<
    React.SetStateAction<PublicChallengeTypes | null>
  >;
}

const FilledLanding: React.FC<FilledLandingProps> = ({
  publicChallenge,
  setPublicChallenge,
}) => {
  const [challengeActionMenuToggle, setChallengeActionMenuToggle] =
    useState(false);
  const [deletePCModalOpen, setDeletePCModalOpen] = useState(false);
  const [editPCModalOpen, setEditPCModalOpen] = useState(false);

  //Delete Public Challenge Handler
  const deletePublicChallenge = () => {
    localStorage.removeItem("publicChallenge");
    setPublicChallenge(null);
  };

  //Trigger Complete Challenge Animation
  const [rippleTrigger, setRippleTrigger] = useState(
    publicChallenge.isCompleted ? true : false
  );

  //Complete Challenge Handler
  const completeChallengeHandler = () => {
    setRippleTrigger(true);
    localStorage.setItem(
      "publicChallenge",
      JSON.stringify({
        challenge: publicChallenge.challenge,
        expiresAt: publicChallenge.expiresAtMs,
        expired: publicChallenge.expired,
        isCompleted: true,
      })
    );
  };

  /* ----------------------- Temporary Time Left Display ---------------------- */
  // const temporaryTimeLeftDisplay =
  //   publicChallenge.expiresAt && !publicChallenge.expired
  //     ? `${publicChallenge.expiresAt.hours}:${String(
  //         publicChallenge.expiresAt.minutes
  //       ).padStart(2, "0")}:${String(
  //         publicChallenge.expiresAt.seconds
  //       ).padStart(2, "0")}`
  //     : "Expired";
  /* -------------------------------------------------------------------------- */

  /* ----------------------------- CountDown Timer ---------------------------- */

  const [timeLeftDisplay, setTimeLeftDisplay] = useState("Loading...");
  let timeLeft = publicChallenge.timeLeft;

  const countdownTimerHandler = () => {
    if (timeLeft > 0) {
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      setTimeLeftDisplay(
        `${hours}:${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`
      );

      timeLeft -= 1000;
    } else {
      setTimeLeftDisplay("Expired");
      clearInterval(intervalId); // Stop the interval when expired
    }
  };

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      countdownTimerHandler();
    }, 1000);

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  console.log(publicChallenge, "publicChallenge");

  return (
    <div className="public-filled-container">
      <div className="public-filled-hero">
        <img src={OldTimeyLamp} alt="old timey lamp" width={80} height={80} />
        <div className="public-filled-hero-text">
          <h2>I challenge myself to...</h2>
          <p>{publicChallenge.challenge}</p>
        </div>
      </div>
      <div className="public-filled-timer">
        <p>Challenge ends in:</p>
        <p>{timeLeftDisplay}</p>
      </div>
      <div className="public-filled-footer">
        <button
          disabled={rippleTrigger}
          onClick={completeChallengeHandler}
          className={`public-challenge-complete-btn ${
            rippleTrigger ? "ripple-active" : ""
          }`}
        >
          <img src={CheckmarkBW} alt="Check mark icon" />
          <p>{rippleTrigger ? "Good show!" : "Mark as done"}</p>
        </button>
        <div
          className="public-challenge-action-menu-wrapper"
          aria-haspopup="menu"
          aria-expanded={challengeActionMenuToggle}
        >
          <button
            className={challengeActionMenuToggle ? "bg-active-grey" : ""}
            onClick={() =>
              setChallengeActionMenuToggle(!challengeActionMenuToggle)
            }
          >
            <img src={VerticalEllipsis} alt="Vertical ellipsis icon" />
          </button>
          <div
            className="public-challenge-action-menu"
            role="menu"
            aria-label="Action menu"
          >
            <ul>
              <li
                onClick={() => {
                  setEditPCModalOpen(true);
                }}
                role="menuitem"
              >
                <img src={EditPencil} />
                <p>Edit</p>
              </li>
              <li
                onClick={() => {
                  setDeletePCModalOpen(true);
                }}
                role="menuitem"
              >
                <img src={DeleteTrashcan} />
                <p>Delete</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="public-challenge-action-btns">
          <button
            onClick={() => {
              setEditPCModalOpen(true);
            }}
          >
            <img src={EditPencil} alt="Pencil icon" />
            <p>Edit</p>
          </button>
          <button
            onClick={() => {
              setDeletePCModalOpen(true);
            }}
          >
            <img src={DeleteTrashcan} alt="Trashcan icon" />
            <p>Delete</p>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {editPCModalOpen && (
          <Overlay customClassName={`flex-align-start portrait-align-center`}>
            <PublicChallengerForm
              onClose={() => {
                setEditPCModalOpen(false);
              }}
            />
          </Overlay>
        )}
        {deletePCModalOpen && (
          <Overlay>
            <DeletePublicChallengerModal
              onClose={() => setDeletePCModalOpen(false)}
              deletePublicChallenge={deletePublicChallenge}
            />
          </Overlay>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilledLanding;

/* --------------------- Delete Public Challenger Modal --------------------- */

interface DeletePublicChallengerModalProps {
  onClose: () => void;
  deletePublicChallenge: () => void;
}

const DeletePublicChallengerModal: React.FC<
  DeletePublicChallengerModalProps
> = ({ onClose, deletePublicChallenge }) => {
  return (
    <div className="delete-pc-modal">
      <h1>Delete this challenge?</h1>
      <div className="delete-pc-modal-body">
        <p>
          Deleting this challenge will allow you to create a new challenge. As a
          guest user you can only have <span>1 active challenge</span> at a
          time.
        </p>
        <br />
        <p>
          To create multiple challenges, please{" "}
          <a
            // TODO: switch out after pro features are implemented
            href={`/under-construction`}
          >
            sign in or create an account
          </a>
        </p>
      </div>
      <div className="delete-pc-modal-footer">
        {/* TODO: make design system for this type of footer with 2 btns */}
        <button onClick={onClose}>Cancel</button>
        <button onClick={deletePublicChallenge}>Yes, Delete</button>
      </div>
    </div>
  );
};
