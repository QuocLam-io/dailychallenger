//React
import { useEffect, useState } from "react";
//Utils
import { getGreeting } from "@/utils/getGreeting";
//Styles
import "./Home.scss";
import { AnimatePresence } from "framer-motion";
import PlaceHolderAvatarGroup from "@/assets/PlaceHolderAvatarGroup.jpg";
import plusCircle from "@/assets/plus-black-circle-white.png";
import plusSoft from "@/assets/plus-white-circle-grey.svg";
//Auth
import { useUser } from "@clerk/clerk-react";
//Zustand
import { useUserStore } from "@/stores/userStore";
import useChallengesStore from "@/stores/challengesStore";
import { useModalsStore } from "@/stores/modalsStore";
//Types
import type { Challenge } from "@/stores/challengesStore";
//Components
import NavSpacer from "@/components/NavSpacer";
import CarraigeLoader from "@/components/CarraigeLoader";
import Button from "@/components/Button";
import ChallengerForm from "@/components/ChallengerForm.tsx";
import DashboardEmptyExamples from "@/components/DashboardEmptyExamples.tsx";
import ChallengeCard from "@/components/ChallengeCard";
import DashboardCTAFooter from "@/components/dashboard/DashboardCTAFooter";
import DeleteChallengeModal from "@/components/modals/DeleteChallengeModal";

const Home = () => {
  const {
    challenges,
    currentChallenges,
    pastChallenges,
    needsUserAction,
    fetchChallenges,
  } = useChallengesStore();
  console.log(
    challenges,
    // currentChallenges,
    //    pastChallenges,
    needsUserAction,
    "current"
  );
  const [isChallengerFormOpen, setIsChallengerFormOpen] = useState(false);
  const isNewUser = challenges.length === 0;
  const greeting = getGreeting(isNewUser);

  const userId = useUserStore((s) => s.userId);
  const { user } = useUser();
  const standinUserName = user?.primaryEmailAddress?.emailAddress.split("@")[0];
  // const { deleteChallengeModalOpen } = useModalsStore();
  const deleteChallengeModalOpen = useModalsStore((s) => s.deleteChallengeModalOpen);

  /* ----------------------- Fetch Challenges useEffect ----------------------- */

  useEffect(() => {
    // TODO: Add skeleton state
    if (!userId) return;

    if (userId) {
      fetchChallenges(userId);
    }
  }, [userId]);

  /* ----------------------- Mark Challenge Done Handler ---------------------- */

  const markDoneHandler = (challenge: Challenge) => {
    console.log(challenge);
  };
  /* -------------------------------------------------------------------------- */
  if (!userId) return <CarraigeLoader />;
  
  console.log(markDoneHandler, pastChallenges);
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
          {currentChallenges.length === 0 ? (
            <div className="dashboard_challenges-display_new-cta">
              <p>You’ve done it! Splendid work.</p>
              <p>Now then — pip pip, and on to the next!</p>
              <Button
                icon={plusCircle}
                onClick={() => setIsChallengerFormOpen(true)}
              >
                Create a challenge
              </Button>
            </div>
          ) : (
            <div className="dashboard_challenges-display_cards-container">
              {currentChallenges.map((c) => {
              {/* {pastChallenges.map((c) => { */}
                return <ChallengeCard key={c.id} challenge={c} />;
              })}
              <button
                onClick={() => setIsChallengerFormOpen(true)}
                className="dashboard_challenges-display_cards-container_new-challenge-card"
              >
                <img src={plusSoft} />
                <span>New challenge</span>
              </button>
            </div>
          )}
        </section>
      )}
      {/* Footer */}
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
        // {/* TODO: Add a Footer Spacer */}
        <DashboardCTAFooter />
      )}

      {/* Modals */}
      <AnimatePresence>
        {isChallengerFormOpen && (
          <ChallengerForm onClose={() => setIsChallengerFormOpen(false)} />
        )}
        {deleteChallengeModalOpen && <DeleteChallengeModal />}
      </AnimatePresence>
    </main>
  );
};

export default Home;
