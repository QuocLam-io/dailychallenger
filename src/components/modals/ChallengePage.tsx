import React from "react";
import "./ChallengePage.scss";
import Overlay from "../Overlay";
import { useModalsStore } from "@/stores/modalsStore";

const ChallengePage = () => {
  const challenge = useModalsStore((s) => s.challengePageChallenge);
  console.log(challenge);
  return (
    <Overlay>
      <div className="challenge-page">Blub</div>
    </Overlay>
  );
};

export default ChallengePage;
