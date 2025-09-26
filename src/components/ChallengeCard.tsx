//React
import { useEffect, useRef } from "react";
// Styles
import "./ChallengeCard.scss";
import greenCheckmark from "@/assets/checkmark-green-circle.svg";
import greyCheckmark from "@/assets/checkmark-grey-circle.svg";
import greyEllipsis from "@/assets/vertical-ellipsis-grey.png";
import EditPencil from "@/assets/edit-pencil-grey.png";
import DeleteTrashcan from "@/assets/delete-trashcan-grey.png";
// @ts-expect-error: This import is temporarily unused, but may be used in the future for the Invite button.
import addUser from "@/assets/user-add.svg";
import addUserDisabled from "@/assets/user-add-disabled.svg";
//Router
import { Link } from "react-router-dom";
//Utils
import { getDeadlineDisplay, getPastChallengeDisplay } from "@/utils/deadlineDisplay";
import { toggleChallengeCompletionHandler as toggleChallengeCompletion } from "@/utils/completeChallenge";
//Types
import { Challenge } from "@/stores/challengesStore";
//Zustand
import { useDropdownStore } from "@/stores/dropdownStore";
import { useModalsStore } from "@/stores/modalsStore";
import { useDashboardStore } from "@/stores/dashboard/dashboardStore";
import { useChallengeDetailsPageStore } from "@/stores/challengeDetailsPageStore";
import { useUserStore } from "@/stores/userStore";

type Props = {
  challenge: Challenge;
};

const ChallengeCard = ({ challenge }: Props) => {
  const { supabaseId } = useUserStore();
  //TODO: time left utils for past challenges
  const {
    setDeleteChallengeId,
    toggleDeleteChallengeModalOpen,
    toggleEditChallengeModalOpen,
  } = useModalsStore();
  const { setChallengeDetailsPageChallenge } = useChallengeDetailsPageStore();
  const { openDropdownId, toggleDropdownId } = useDropdownStore();
  const isOpen = openDropdownId === challenge.id;
  const { activeTab } = useDashboardStore();

  // Calculate display info for past challenges
  const pastChallengeDisplay = activeTab === "past" 
    ? getPastChallengeDisplay(challenge.completed_at, challenge.failed_at, challenge.deadline)
    : null;

  /* --------------- Toggle Challenge as Complete/Undo Complete --------------- */
  const completeChallengeHandler = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    if (!supabaseId) return;

    // Toggle completion status
    const success = await toggleChallengeCompletion(supabaseId, id, challenge.is_completed);

    if (!success) {
      console.error("Failed to toggle challenge completion");
    }
  };

  /* ------------------------------ Dropdown Menu ----------------------------- */
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleDeleteChallenge = () => {
    toggleDeleteChallengeModalOpen();
    setDeleteChallengeId(challenge.id);
  };

  /* ------------------------- Handle Edit Challenge ------------------------ */

  const handleEditChallenge = () => {
    setChallengeDetailsPageChallenge(challenge);
    toggleEditChallengeModalOpen();
  };

  return (
    <div className="challenge-card_wrapper">
      <Link
        onClick={() => setChallengeDetailsPageChallenge(challenge)}
        to={`/challenge-details/${challenge.id}`}
      >
        <span>{challenge.emoji}</span>
        <div className="titles">
          <h4>{challenge.title}</h4>
          <p>
            {pastChallengeDisplay ? (
              <>
                <span className={`challenge-status-${pastChallengeDisplay.status}`}>
                  {pastChallengeDisplay.verb}
                </span>
                {pastChallengeDisplay.rest}
              </>
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
                <button onClick={() => handleDeleteChallenge()} role="menuitem">
                  <img src={DeleteTrashcan} />
                  <p>Delete</p>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
