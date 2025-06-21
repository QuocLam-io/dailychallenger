import React from "react";
import "./ChallengePage.scss";
import Overlay from "../Overlay";
import { useModalsStore } from "@/stores/modalsStore";
import OldTimeyLamp from "@/assets/old-timey-lamp.png";

const ChallengePage = () => {
  const challenge = useModalsStore((s) => s.challengePageChallenge);

  if (!challenge) return null;

  return (
    <Overlay>
      <div className="challenge-page">
        <div className="challenge-page-hero">
          <img src={OldTimeyLamp} alt="old timey lamp" width={80} height={80} />
          <div className="challenge-page-hero-text">
            <h2>I challenge myself to...</h2>
            <p>{challenge.title}</p>
          </div>
        </div>
        <div className="challenge-page-timer">
          <p>Challenge ends in:</p>
          <p>{/* TODO: Add timer logic here */}</p>
        </div>
        {/* TODO: Add footer and action buttons similar to FilledLanding */}
      </div>
    </Overlay>
  );
};

export default ChallengePage;
