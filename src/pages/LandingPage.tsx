import { useState } from "react";
import { CarraigeLoader, LoadingWrapper } from "@/components/shared";
import { EmptyLanding, FilledLanding } from "@/components/landing";

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
    try {
      const data = localStorage.getItem("publicChallenge");

      if (data) {
        const parsedData = JSON.parse(data) as Omit<
          PublicChallengeTypes,
          "expiresAt"
        > & { expiresAt: number };

        const now = Date.now();
        const timeLeft = parsedData.expiresAt - now;

        if (timeLeft > 0) {
          setPublicChallenge({
            ...parsedData,
            timeLeft,
            expiresAt: parsedData.expiresAt,
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
