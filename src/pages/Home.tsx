//React
import { useEffect, useState } from "react";
//Utils
import { getGreeting } from "@/utils/getGreeting";

//Styles
import "./Home.scss";
import { AnimatePresence } from "framer-motion";
import PlaceHolderAvatarGroup from "@/assets/PlaceHolderAvatarGroup.jpg";
import plusCircle from "@/assets/plus-black-circle-white.png";

//Auth
import { useUser } from "@clerk/clerk-react";

//Zustand
import { useUserStore } from "@/stores/userStore";
import useChallengesStore from "@/stores/challengesStore";

//Components
import NavSpacer from "@/components/NavSpacer";
import CarraigeLoader from "@/components/CarraigeLoader";
import Button from "@/components/Button";
import Overlay from "@/components/Overlay.tsx";
import ChallengerForm from "@/components/ChallengerForm.tsx";
import DashboardEmptyExamples from "@/components/DashboardEmptyExamples.tsx";

const Home = () => {
  const { challenges, fetchChallenges } = useChallengesStore();
  console.log(challenges, "challenges");
  const [isChallengerFormOpen, setIsChallengerFormOpen] = useState(false);
  const isNewUser = challenges.length === 0;
  const greeting = getGreeting(isNewUser);
  const userId = useUserStore((s) => s.userId);
  const { user } = useUser();
  const standinUserName = user?.primaryEmailAddress?.emailAddress.split("@")[0];

  /* ----------------------- Fetch Challenges useEffect ----------------------- */

  useEffect(() => {
    // TODO: Add skeleton state
    if (!userId) return;

    if (userId) {
      fetchChallenges(userId);
    }
  }, [userId]);
  /* -------------------------------------------------------------------------- */
  if (!userId) return <CarraigeLoader />;

  return (
    <main className="home_wrapper">
      <NavSpacer />
      <section className="dashboard-header">
        <div className="dashboard-time">
          <p>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p>
            {new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </p>
        </div>
        <div className="dashboard-user">
          <div className="dashboard-user_name">
            <p>{greeting}</p>
            {/* TODO: add feature to add name to clerk */}
            <p>{user?.firstName ?? standinUserName}</p>
          </div>
          <div className="dashboard-user_streak">
            <p>Current streak</p>
            <p>0 days</p>
            <p>Longest streak: 0 days</p>
            <div className="dashboard-user_streak-cheers">
              <p>No cheers yet</p>
              {/* Pictures of friends cheering will be here */}
              <img src={PlaceHolderAvatarGroup} />
            </div>
          </div>
        </div>
      </section>
      {!challenges.length ? (
        <DashboardEmptyExamples />
      ) : (
        <section className="dashboard_challenges-display">
          <div className="dashboard_challenges-display_header">
            <h2>Challenges</h2>
            <h3>Show your fellow chaps you are true to your word</h3>
          </div>
          <div className="dashboard_challenges-display_cards-container"></div>
        </section>
      )}
      {!challenges.length ? (
        <section className="dashboard-kyurem_cta">
          <h2>New are you? Start here:</h2>
          <Button
            icon={plusCircle}
            onClick={() => setIsChallengerFormOpen(true)}
            // iconPosition="right"
            // disabled={true}
          >
            Create a challenge
          </Button>
        </section>
      ) : (
        <section className="dashboard_cta-footer">
          <button>
            <p>Current Challenges</p>
            <span>{challenges.length}</span>
          </button>
          <button>
            <p>Past Challenges</p>
            <span>{challenges.length}</span>
          </button>
 
        </section>
      )}

      {/* Modals */}
      <AnimatePresence>
        {isChallengerFormOpen && (
          <Overlay customClassName={`flex-align-start portrait-align-center`}>
            <ChallengerForm onClose={() => setIsChallengerFormOpen(false)} />
          </Overlay>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;
