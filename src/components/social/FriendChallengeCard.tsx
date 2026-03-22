import "./FriendChallengeCard.scss";
import { getInitials, getAvatarColor } from "@/utils/avatar";
import { getDeadlineDisplay } from "@/utils/deadlineDisplay";
import CheerButton from "./CheerButton";
import type { FriendChallenge } from "@/types";

type FriendChallengeCardProps = {
  challenge: FriendChallenge;
  isCheered: boolean;
  onToggleCheer: () => void;
};

const FriendChallengeCard = ({
  challenge,
  isCheered,
  onToggleCheer,
}: FriendChallengeCardProps) => {
  const initials = getInitials(
    challenge.friend_first_name,
    challenge.friend_last_name
  );
  const color = getAvatarColor(challenge.user_id);
  const friendName = challenge.friend_first_name
    ? `${challenge.friend_first_name}${challenge.friend_last_name ? ` ${challenge.friend_last_name.charAt(0)}.` : ""}`
    : "Friend";

  return (
    <div className="friend-challenge-card">
      <div
        className="friend-challenge-card_avatar"
        style={challenge.friend_avatar_url ? undefined : { backgroundColor: color }}
      >
        {challenge.friend_avatar_url ? (
          <img src={challenge.friend_avatar_url} alt={friendName} />
        ) : (
          initials
        )}
      </div>
      <div className="friend-challenge-card_info">
        <span className="friend-challenge-card_emoji">{challenge.emoji}</span>
        <div className="friend-challenge-card_titles">
          <h4>{challenge.title}</h4>
          <p>
            {friendName} &middot;{" "}
            {getDeadlineDisplay(new Date(challenge.deadline))} left
          </p>
        </div>
      </div>
      <CheerButton
        isCheered={isCheered}
        onToggle={onToggleCheer}
      />
    </div>
  );
};

export default FriendChallengeCard;
