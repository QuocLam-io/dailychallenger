import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ChallengeDetailsPage.scss";
import CheckmarkBW from "@/assets/checkmark-bw-circle.png";
import VerticalEllipsis from "@/assets/vertical-ellipsis-grey.png";
import EditPencil from "@/assets/edit-pencil-grey.png";
import DeleteTrashcan from "@/assets/delete-trashcan-grey.png";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { useChallengeDetailsPageStore } from "@/stores/challengeDetailsPageStore";
import { useModalsStore } from "@/stores/modalsStore";
import { formatCountdownTime, getTimeLeft } from "@/utils/countdownTimer";

const ChallengeDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { challengeDetailsPageChallenge } = useChallengeDetailsPageStore();
  const {
    toggleDeleteChallengeModalOpen,
    toggleEditChallengeModalOpen,
    setDeleteChallengeId,
  } = useModalsStore();

  const [challengeActionMenuToggle, setChallengeActionMenuToggle] = useState(false);
  const [rippleTrigger, setRippleTrigger] = useState(false);
  const [timeLeftDisplay, setTimeLeftDisplay] = useState("Loading...");
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const challenge = challengeDetailsPageChallenge;

  useEffect(() => {
    if (!challenge) {
      navigate("/home");
      return;
    }

    if (challenge.is_completed) {
      setRippleTrigger(true);
      setTimeLeftDisplay("Completed!");
      return;
    }

    if (challenge.is_failed) {
      setTimeLeftDisplay("Failed");
      return;
    }

    // Set up countdown timer
    const updateTimer = () => {
      const timeLeft = getTimeLeft(challenge.deadline);
      const formattedTime = formatCountdownTime(timeLeft);

      setTimeLeftDisplay(formattedTime);

      if (timeLeft <= 0 && intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };

    updateTimer();
    intervalIdRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [challenge, navigate]);

  const completeChallengeHandler = () => {
    if (!challenge || challenge.is_completed) return;

    setRippleTrigger(true);
    setTimeLeftDisplay("Completed!");

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    // TODO: Implement actual completion logic via API
    console.log("Challenge completed:", challenge.id);
  };

  const handleEditChallenge = () => {
    if (challenge) {
      toggleEditChallengeModalOpen();
    }
  };

  const handleDeleteChallenge = () => {
    if (challenge) {
      setDeleteChallengeId(challenge.id);
      toggleDeleteChallengeModalOpen();
    }
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="challenge-details-container">
      {rippleTrigger && <Fireworks autorun={{ speed: 1 }} />}

      <div className="challenge-details-hero">
        <span className="challenge-emoji" role="img" aria-label="Challenge emoji">
          {challenge.emoji}
        </span>
        <div className="challenge-details-hero-text">
          <h2>I challenge myself to...</h2>
          <p>{challenge.title}</p>
        </div>
      </div>

      <div className="challenge-details-timer">
        <p>Challenge ends in:</p>
        <p>{timeLeftDisplay}</p>
      </div>

      <div className={`challenge-details-footer ${rippleTrigger ? "flex-column" : ""}`}>
        <button
          disabled={rippleTrigger || challenge.is_failed}
          onClick={completeChallengeHandler}
          className={`challenge-complete-btn ${rippleTrigger ? "ripple-active" : ""}`}
        >
          <img src={CheckmarkBW} alt="Check mark icon" />
          <p>{rippleTrigger ? "Good show!" : "Mark as done"}</p>
        </button>

        {!rippleTrigger && !challenge.is_failed && (
          <div
            className="challenge-action-menu-wrapper"
            aria-haspopup="menu"
            aria-expanded={challengeActionMenuToggle}
          >
            <button
              className={challengeActionMenuToggle ? "bg-active-grey" : ""}
              onClick={() => setChallengeActionMenuToggle(!challengeActionMenuToggle)}
            >
              <img src={VerticalEllipsis} alt="Vertical ellipsis icon" />
            </button>
            <div
              className="challenge-action-menu"
              role="menu"
              aria-label="Action menu"
            >
              <ul>
                <li
                  onClick={handleEditChallenge}
                  role="menuitem"
                >
                  <img src={EditPencil} alt="Edit icon" />
                  <p>Edit</p>
                </li>
                <li
                  onClick={handleDeleteChallenge}
                  role="menuitem"
                >
                  <img src={DeleteTrashcan} alt="Delete icon" />
                  <p>Delete</p>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="challenge-action-btns">
          <button onClick={handleEditChallenge}>
            <img src={EditPencil} alt="Pencil icon" />
            <p>Edit</p>
          </button>
          {!rippleTrigger && !challenge.is_failed && (
            <button onClick={handleDeleteChallenge}>
              <img src={DeleteTrashcan} alt="Trashcan icon" />
              <p>Delete</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailsPage;