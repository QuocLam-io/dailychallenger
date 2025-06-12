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
//Utils
import { getDeadlineDisplay } from "@/utils/deadlineDisplay";
//Types
import { Challenge } from "@/stores/challengesStore";
//Zustand
import { useDropdownStore } from "@/stores/dropdownStore";
import { useModalsStore } from "@/stores/modalsStore";

type Props = {
  challenge: Challenge;
};

const ChallengeCard = ({ challenge }: Props) => {
  //TODO: time left utils
  const { setDeleteChallengeId, toggleDeleteChallengeModalOpen } =
    useModalsStore();
  const { openDropdownId, toggleDropdownId } = useDropdownStore();
  const isOpen = openDropdownId === challenge.id;

  /* --------------- Toggle Challenge as Complete/Undo Complete --------------- */
  const completeChallengeHandler = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    console.log(id);
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

  return (
    <div className="challenge-card_wrapper">
      <span>{challenge.emoji}</span>
      <div className="titles">
        <h4>{challenge.title}</h4>
        <p>{getDeadlineDisplay(new Date(challenge.deadline))} left</p>
      </div>
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
          <button
            onClick={() => {
              toggleDropdownId(challenge.id);
            }}
          >
            <img src={greyEllipsis} />
          </button>

          <div className="dropdown-menu" role="menu" aria-label="Action menu">
            <ul>
              <li role="none">
                <button role="menuitem">
                  <img src={EditPencil} />
                  <p>Edit</p>
                </button>
              </li>
              {/* <li role="none">
                <button role="menuitem">
                  <img src={addUser} />
                  <p>Invite</p>
                  <span>COMING SOON</span>
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
