// Styles
import "./ChallengeCard.scss";
import greenCheckmark from "@/assets/checkmark-green-circle.svg";
import greyCheckmark from "@/assets/checkmark-grey-circle.svg";
import greyEllipsis from "@/assets/vertical-ellipsis-grey.png";

//Utils
import { getDeadlineDisplay } from "@/utils/deadlineDisplay";

//Types
import { Challenge } from "@/stores/challengesStore";

type Props = {
  challenge: Challenge;
};

const ChallengeCard = ({ challenge }: Props) => {
  //TODO: time left utils
  //TODO: dropdown menu

  const completeChallengeHandler = (e: React.MouseEvent, id: string) => {
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
        <button>
          <img src={greyEllipsis} />
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
