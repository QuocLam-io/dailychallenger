import React, { useState, useEffect, useRef } from "react";
//Styling
import "./FilledLanding.scss";
import { AnimatePresence } from "framer-motion";
import OldTimeyLamp from "@/assets/images/old-timey-lamp.png";
import CheckmarkBW from "@/assets/images/checkmark-bw-circle.png";
import VerticalEllipsis from "@/assets/images/vertical-ellipsis-grey.png";
import EditPencil from "@/assets/images/edit-pencil-grey.png";
import DeleteTrashcan from "@/assets/images/delete-trashcan-grey.png";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
// Zustand
import { usePublicStore } from "@/stores";
//Components
import { Overlay } from "@/components/shared";
import { PublicChallengeTypes } from "@/pages/LandingPage";
import { PublicChallengerForm } from "./EmptyLanding";
//Utils
import { formatCountdownTime } from "@/utils/countdownTimer";

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
  const [createPCModalOpen, setCreatePCModalOpen] = useState(false);
  const [expiredModalOpen, setExpiredModalOpen] = useState(false);

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

    //Wipes the ID from the setInterval, freezing the countdown
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    localStorage.setItem(
      "publicChallenge",
      JSON.stringify({
        challenge: publicChallenge.challenge,
        expiresAt: publicChallenge.expiresAt,
        expired: publicChallenge.expired,
        isCompleted: true,
        timeInABottle: timeLeftDisplay,
      })
    );
  };

  /* ----------------------------- CountDown Timer ---------------------------- */

  const [timeLeft, setTimeLeft] = useState(publicChallenge.timeLeft);
  const [timeLeftDisplay, setTimeLeftDisplay] = useState("Loading...");
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const countdownTimerHandler = () => {
    if (timeLeft > 0) {
      setTimeLeftDisplay(formatCountdownTime(timeLeft));
      setTimeLeft((prevTime) => prevTime - 1000);
    } else {
      setTimeLeftDisplay("Expired");
      setExpiredModalOpen(true);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    }
  };

  useEffect(() => {
    //If challenge is completed and user returns to the page, the timer will be frozen
    if (publicChallenge.timeInABottle) {
      setTimeLeftDisplay(publicChallenge.timeInABottle);
      return;
    }

    intervalIdRef.current = setInterval(() => {
      countdownTimerHandler();
    }, 1000);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [timeLeft]);

  return (
    <div className="public-filled-container">
      {rippleTrigger && <Fireworks autorun={{ speed: 1 }} />}
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
      <div
        className={`public-filled-footer ${rippleTrigger && "flex-column"} `}
      >
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
        {/* Dropdown menu uses visibility instead of display none because of screen readers and accessibility */}
        {/* wrapper is so the menu is relative to the parent */}
        {!rippleTrigger ? (
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
        ) : (
          <button
            onClick={() => {
              setCreatePCModalOpen(true);
            }}
            className="public-challenge-create-challenge-btn-mobile"
          >
            Create a new challenge
          </button>
        )}
        <div className="public-challenge-action-btns">
          <button
            onClick={() => {
              if (!rippleTrigger) {
                setEditPCModalOpen(true);
              } else {
                setCreatePCModalOpen(true);
              }
            }}
          >
            {!rippleTrigger ? (
              <>
                <img src={EditPencil} alt="Pencil icon" />
                <p>Edit</p>
              </>
            ) : (
              <p>Create a new challenge</p>
            )}
          </button>
          {!rippleTrigger && (
            <button
              onClick={() => {
                setDeletePCModalOpen(true);
              }}
            >
              <img src={DeleteTrashcan} alt="Trashcan icon" />
              <p>Delete</p>
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {(editPCModalOpen || createPCModalOpen) && (
          <Overlay customClassName={`flex-align-start portrait-align-center`}>
            <PublicChallengerForm
              editPCModalOpen={editPCModalOpen}
              onClose={() => {
                if (editPCModalOpen) {
                  setEditPCModalOpen(false);
                } else {
                  setCreatePCModalOpen(false);
                }
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
        {expiredModalOpen && (
          <Overlay>
            <ExpiredPublicChallengerModal
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
          <a href="https://closing-turkey-58.accounts.dev/sign-up?redirect_url=https://dailychallenger.netlify.app/">
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

/* --------------------- Expired Modal --------------------- */

interface ExpiredPublicChallengerModalProps {
  deletePublicChallenge: () => void;
}

const ExpiredPublicChallengerModal: React.FC<
  ExpiredPublicChallengerModalProps
> = ({ deletePublicChallenge }) => {
  const { setPublicChallengerModalOpen } =
    usePublicStore((state) => state);

  const newChallengeHandler = () => {
    deletePublicChallenge();
    setPublicChallengerModalOpen(true);
    //test
  };


  return (
    <div className="expired-pc-modal">
      <div className="expired-pc-modal-text">
        <p>Pity...</p>
        <h2>Your time has run out</h2>
        <p>Give it another go, why don’t you?</p>
      </div>
      <div className="expired-pc-modal-footer">
        <button onClick={newChallengeHandler}>Create a new challenge</button>
      </div>
    </div>
  );
};
