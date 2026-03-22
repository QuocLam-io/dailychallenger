import { useRef } from "react";
import { useReward } from "partycles";
import "./CheerButton.scss";

type CheerButtonProps = {
  isCheered: boolean;
  onToggle: () => void;
};

const CheerButton = ({ isCheered, onToggle }: CheerButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { reward } = useReward(
    buttonRef as React.RefObject<HTMLElement>,
    "stars",
    {
      particleCount: 25,
      spread: 160,
      startVelocity: 3,
      elementSize: 12,
      lifetime: 120,
      physics: { gravity: 0.5, wind: 0, friction: 0.98 },
      colors: ["#FFD700", "#FFA500", "#FF6347"],
    }
  );

  const handleClick = () => {
    if (!isCheered) {
      reward();
    }
    onToggle();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`cheer-button ${isCheered ? "cheer-button--active" : ""}`}
      aria-label={isCheered ? "Remove cheer" : "Cheer"}
    >
      <span>{isCheered ? "🎉" : "👏"}</span>
      <span>{isCheered ? "Cheered" : "Cheer"}</span>
    </button>
  );
};

export default CheerButton;
