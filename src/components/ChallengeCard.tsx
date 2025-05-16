// Styles
import "./ChallengeCard.scss";
import greenCheckmark from "@/assets/checkmark-green-circle.svg";
import greyCheckmark from "@/assets/checkmark-grey-circle.svg";
import greyEllipsis from "@/assets/vertical-ellipsis-grey.png";

//Types
import { Challenge } from "@/stores/challengesStore";

type Props = {
  challenge: Challenge;
};

const ChallengeCard = ({ challenge }: Props) => {
  //TODO: time left utils
  //TODO: dropdown menu
  //TODO: green checkmark logic
  return (
    <div className="challenge-card_wrapper">
      <span>{challenge.emoji}</span>
      <div className="titles">
        <h4>{challenge.title}</h4>
        <p>{challenge.deadline}</p>
      </div>
      <div className="card-status">
        <div className="card-status-done">
          <img src={greenCheckmark} />
          <p>Done</p>
        </div>
        <button>
          <img src={greyEllipsis} />
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
