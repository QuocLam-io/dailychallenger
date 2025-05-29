//React
import { useState } from "react";
// Styles
import "./ChallengeCard.scss";
import greenCheckmark from "@/assets/checkmark-green-circle.svg";
import greyCheckmark from "@/assets/checkmark-grey-circle.svg";
import greyEllipsis from "@/assets/vertical-ellipsis-grey.png";
import EditPencil from "@/assets/edit-pencil-grey.png";
import DeleteTrashcan from "@/assets/delete-trashcan-grey.png";
import addUser from "@/assets/user-add.svg";
//Utils
import { getDeadlineDisplay } from "@/utils/deadlineDisplay";
//Types
import { Challenge } from "@/stores/challengesStore";
//Zustand
import { useDropdownStore } from "@/stores/dropdownStore";

type Props = {
  challenge: Challenge;
};

const ChallengeCard = ({ challenge }: Props) => {
  //TODO: time left utils
  //TODO: dropdown menu button fns trigger modals to handle actions
  const { openDropdownId, toggleDropdownId } = useDropdownStore();
  const isOpen = openDropdownId === challenge.id;

  // const [challengeActionsMenuToggle, setChallengeActionsMenuToggle] =
  //   useState<boolean>(false);
  // console.log(challengeActionsMenuToggle, "challengeActionsMenuToggle");

  const completeChallengeHandler = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    console.log(id);
  };

  const deleteChallengeHandler = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    console.log(id);
  };

  return (
    <div className="challenge-card_wrapper">
      <span>{challenge.emoji}</span>
      <div className="titles">
        <h4>{challenge.title}</h4>
        <p>{getDeadlineDisplay(challenge.deadline)} left</p>
      </div>
      <div className="card-status">
        <div className="card-status-done">
          <img src={challenge.is_completed ? greenCheckmark : greyCheckmark} />
          <button onClick={(e) => completeChallengeHandler(e, challenge.id)}>
            Done
          </button>
        </div>
        <div
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="dropdown-menu_wrapper"
        >
          <button
            onClick={() => {
              // setChallengeActionsMenuToggle(!challengeActionsMenuToggle);
              toggleDropdownId(challenge.id);
            }}
          >
            <img src={greyEllipsis} />
          </button>

          <div className="dropdown-menu" role="menu" aria-label="Action menu">
            <ul>
              <li role="menuitem">
                <img src={EditPencil} />
                <p>Edit</p>
              </li>
              <li role="menuitem">
                <img src={addUser} />
                <p>Invite</p>
              </li>
              <li role="menuitem">
                <img src={DeleteTrashcan} />
                <p>Delete</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
