import { useState } from "react";
import CarraigeLoader from "../components/CarraigeLoader";
import LoadingWrapper from "../components/LoadingWrapper";
// import EmptyLanding from "@/Components/public-landing/EmptyLanding";
// import FilledLanding from "@/Components/public-landing/FilledLanding";

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
      <div
        style={{
          padding: "65px",
        }}
      >
        {
          publicChallenge ? (
            <h1>Yes</h1>
          ) : (
            //     <FilledLanding
            //       setPublicChallenge={setPublicChallenge}
            //       publicChallenge={publicChallenge}
            //     />
            <h1>No</h1>
          )
          // <EmptyLanding />
        }
      </div>
    </LoadingWrapper>
    // <CarraigeLoader />
  );
};

export default LandingPage;
