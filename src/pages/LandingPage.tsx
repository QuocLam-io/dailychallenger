import { useState } from "react";
import CarraigeLoader from "../components/CarraigeLoader";
import LoadingWrapper from "../components/LoadingWrapper";
import EmptyLanding from "../components/EmptyLanding";
import FilledLanding from "../components/FilledLanding";

export interface PublicChallengeTypes {
  challenge: string;
  expiresAt: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  expired: boolean;
}

const LandingPage = () => {
  const [publicChallenge, setPublicChallenge] =
    useState<PublicChallengeTypes | null>(null);

  const loadPublicChallenge = async () => {
    const data = localStorage.getItem("publicChallenge");

    if (data) {
      const parsedData = JSON.parse(data) as Omit<
        PublicChallengeTypes,
        "expiresAt"
      > & { expiresAt: number };

      const now = Date.now();
      const timeLeft = parsedData.expiresAt - now;

      if (timeLeft > 0) {
        // TODO: refactor this for countdown timer and make scalable in a util folder
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);

        setPublicChallenge({
          ...parsedData,
          expiresAt: { hours, minutes, seconds },
          expiresAtMs: parsedData.expiresAt,
        });
      } else {
        setPublicChallenge({
          ...parsedData,
          expiresAt: null,
          expired: true,
        });
      }
    } else {
      setPublicChallenge(null);
    }
  };

  console.log(publicChallenge, "publicChallenge, timeLeft");

  return (
    <LoadingWrapper loadFn={loadPublicChallenge} fallback={<CarraigeLoader />}>
      {/* TODO: Add publicExpired component and logic */}
      {publicChallenge ? (
        // <EmptyLanding />
        <FilledLanding
          setPublicChallenge={setPublicChallenge}
          publicChallenge={publicChallenge}
        />
      ) : (
        <EmptyLanding />
      )}
    </LoadingWrapper>
  );
};

export default LandingPage;
