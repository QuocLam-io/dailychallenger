import { useState } from "react";
import CarraigeLoader from "../components/CarraigeLoader";
import LoadingWrapper from "../components/LoadingWrapper";
import EmptyLanding from "../components/EmptyLanding";
import FilledLanding from "../components/FilledLanding";

export interface PublicChallengeTypes {
  challenge: string;
  expiresAt: number | null;
  expired: boolean;
  isCompleted: boolean;
  timeLeft: number;
  timeInABottle?: string;
}

const LandingPage = () => {
  const [publicChallenge, setPublicChallenge] =
    useState<PublicChallengeTypes | null>(null);

  const loadPublicChallenge = async (): Promise<boolean> => {
    // await new Promise((resolve) => setTimeout(resolve, 4000));
    //😿 created performance issues. I'm a victim of my own success
    try {
      const data = localStorage.getItem("publicChallenge");

      if (data) {
        const parsedData = JSON.parse(data) as Omit<
          PublicChallengeTypes,
          "expiresAt"
        > & { expiresAt: number };

        const now = Date.now();
        const timeLeft = parsedData.expiresAt - now;
        // console.log(typeof timeLeft, "timeLeft");

        if (timeLeft > 0) {
          // const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
          // const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
          // const seconds = Math.floor((timeLeft / 1000) % 60);

          setPublicChallenge({
            ...parsedData,
            timeLeft,
            expiresAt: parsedData.expiresAt,
            // expiresAt: { hours, minutes, seconds },
          });
        } else {
          setPublicChallenge({
            ...parsedData,
            expiresAt: null,
            expired: true,
            isCompleted: false,
          });
        }
      } else {
        setPublicChallenge(null);
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // console.log(publicChallenge, "publicChallenge, timeLeft");

  return (
    <LoadingWrapper loadFn={loadPublicChallenge} fallback={<CarraigeLoader />}>
      {publicChallenge ? (
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
