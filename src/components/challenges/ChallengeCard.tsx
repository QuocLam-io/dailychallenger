//React
import { useEffect, useRef } from "react";
//Animations
import { useReward } from "partycles";
// Styles
import "./ChallengeCard.scss";
import greenCheckmark from "@/assets/icons/checkmark-green-circle.svg";
import greyCheckmark from "@/assets/icons/checkmark-grey-circle.svg";
import greyEllipsis from "@/assets/images/vertical-ellipsis-grey.png";
import EditPencil from "@/assets/images/edit-pencil-grey.png";
import DeleteTrashcan from "@/assets/images/delete-trashcan-grey.png";
// @ts-expect-error: This import is temporarily unused, but may be used in the future for the Invite button.
import addUser from "@/assets/icons/user-add.svg";
import addUserDisabled from "@/assets/icons/user-add-disabled.svg";
//Router
import { Link } from "react-router-dom";
//Utils
import {
  getDeadlineDisplay,
  getPastChallengeDisplay,
} from "@/utils/deadlineDisplay";
import { toggleChallengeCompletion } from "@/middleware/challenges";
//Types
import type { Challenge } from "@/types";
import { durationDaysToFrequency } from "@/types";
//Zustand
import {
  useChallengesStore,
  useChallengeDetailsPageStore,
  useDropdownStore,
  useModalsStore,
  useDashboardStore,
  useUserStore,
} from "@/stores";

type Props = {
  challenge: Challenge;
};

const ChallengeCard = ({ challenge }: Props) => {
  const { supabaseId } = useUserStore();
  const { recurringChallenges } = useChallengesStore();

  const recurringMatch = challenge.recurring_challenge_id
    ? recurringChallenges.find((r) => r.id === challenge.recurring_challenge_id)
    : null;
  const repeatLabel = recurringMatch
    ? durationDaysToFrequency(recurringMatch.duration_days)
    : null;
  const hasStarted = !challenge.start_date || new Date(challenge.start_date) <= new Date();
  const {
    setDeleteChallengeId,
    setDeleteRecurringChallengeId,
    toggleDeleteChallengeModalOpen,
    toggleEditChallengeModalOpen,
  } = useModalsStore();
  const { setChallengeDetailsPageChallenge } = useChallengeDetailsPageStore();
  const { openDropdownId, toggleDropdownId } = useDropdownStore();
  const isOpen = openDropdownId === challenge.id;
  const { activeTab } = useDashboardStore();

  // Calculate display info for past challenges
  const pastChallengeDisplay =
    activeTab === "past"
      ? getPastChallengeDisplay(
          challenge.completed_at,
          challenge.failed_at,
          challenge.deadline
        )
      : null;

  /* --------------- Toggle Challenge as Complete/Undo Complete --------------- */
  const completeChallengeHandler = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    if (!supabaseId) return;

    const wasCompleted = challenge.is_completed;

    // Toggle completion status
    const success = await toggleChallengeCompletion(
      supabaseId,
      id,
      challenge.is_completed
    );

    if (!success) {
      console.error("Failed to toggle challenge completion");
    } else if (!wasCompleted) {
      // Only trigger animation when completing (not uncompleting)
      reward();
    }
  };

  /* ------------------------------ Dropdown Menu ----------------------------- */
  const dropdownRef = useRef<HTMLDivElement>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);

  // Particle animation setup
  const { reward } = useReward(doneButtonRef as React.RefObject<HTMLElement>, "stars", {
    particleCount: 40,
    spread: 200,
    startVelocity: 4,
    elementSize: 15,
    lifetime: 150,
    physics: {
      gravity: .6,
      wind: 0,
      friction: 0.98
    },
    effects: {
      twinkle: false
    },
    colors: [
      "#FFD700",
      "#FFA500",
      "#FF6347"
    ]
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        openDropdownId === challenge.id
      ) {
        toggleDropdownId(challenge.id);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openDropdownId === challenge.id) {
        toggleDropdownId(challenge.id);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdownId, challenge.id, toggleDropdownId]);

  /* ------------------------- Handle Delete Challenge ------------------------ */

  const handleDeleteSingleChallenge = () => {
    setDeleteRecurringChallengeId(null);
    setDeleteChallengeId(challenge.id);
    toggleDeleteChallengeModalOpen();
  };

  const handleDeleteRecurringChallenge = () => {
    if (challenge.recurring_challenge_id) {
      setDeleteChallengeId(null);
      setDeleteRecurringChallengeId(challenge.recurring_challenge_id);
      toggleDeleteChallengeModalOpen();
    }
  };

  /* ------------------------- Handle Edit Challenge ------------------------ */

  const handleEditChallenge = () => {
    setChallengeDetailsPageChallenge(challenge);
    toggleEditChallengeModalOpen();
  };

  return (
    <div className={`challenge-card_wrapper${!hasStarted ? " challenge-card_not-started" : ""}`}>
      <Link
        onClick={() => setChallengeDetailsPageChallenge(challenge)}
        to={`/challenge-details/${challenge.id}`}
      >
        <span>{challenge.emoji}</span>
        <div className="titles">
          <h4>{challenge.title}</h4>
          <p>
            {repeatLabel && (
              <span className="challenge-repeat-badge">↻ {repeatLabel}</span>
            )}
            {pastChallengeDisplay ? (
              <>
                <span
                  className={`challenge-status-${pastChallengeDisplay.status}`}
                >
                  {pastChallengeDisplay.verb}
                </span>
                {pastChallengeDisplay.rest}
              </>
            ) : !hasStarted ? (
              `Starts ${new Date(challenge.start_date!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
            ) : challenge.is_completed ? (
              "Completed"
            ) : (
              `${getDeadlineDisplay(new Date(challenge.deadline))} left`
            )}
          </p>
        </div>
      </Link>
      <div className="card-status">
        <button
          ref={doneButtonRef}
          onClick={(e) => completeChallengeHandler(e, challenge.id)}
          className="card-status-done"
        >
          <img src={challenge.is_completed ? greenCheckmark : greyCheckmark} />
          <span>Done</span>
        </button>
        <div
          aria-haspopup="menu"
          aria-expanded={isOpen}
          ref={dropdownRef}
          className="dropdown-menu_wrapper"
        >
          {activeTab === "current" && (
            <button
              onClick={() => {
                toggleDropdownId(challenge.id);
              }}
            >
              <img src={greyEllipsis} />
            </button>
          )}

          <div className="dropdown-menu" role="menu" aria-label="Action menu">
            <ul>
              <li role="none">
                {challenge.is_completed ? (
                  <button
                    className="dropdown_invite-button-disabled"
                    role="menuitem"
                  >
                    <img src={EditPencil} />
                    <p>Edit</p>
                    <span>COMPLETED</span>
                  </button>
                ) : (
                  <button role="menuitem" onClick={handleEditChallenge}>
                    <img src={EditPencil} />
                    <p>Edit</p>
                  </button>
                )}
              </li>
              {/* <li role="none">
                <button role="menuitem">
                  <img src={addUser} />
                  <p>Invite</p>
                </button>
              </li> */}
              <li role="none">
                <button
                  className="dropdown_invite-button-disabled"
                  role="menuitem"
                >
                  <img src={addUserDisabled} />
                  <p>Invite</p>
                  <span>COMING SOON</span>
                </button>
              </li>
              <li role="none">
                <button onClick={handleDeleteSingleChallenge} role="menuitem">
                  <img src={DeleteTrashcan} />
                  <p>{challenge.recurring_challenge_id ? "Delete Single" : "Delete"}</p>
                </button>
              </li>
              {challenge.recurring_challenge_id && (
                <li role="none">
                  <button onClick={handleDeleteRecurringChallenge} role="menuitem">
                    <img src={DeleteTrashcan} />
                    <p>Delete Recurring</p>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
