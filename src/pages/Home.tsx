//React
import { useEffect, useState } from "react";
//Utils
import { getGreeting } from "@/utils/getGreeting";

//Styles
import "./Home.scss";
import { AnimatePresence } from "framer-motion";
import PlaceHolderAvatarGroup from "@/assets/PlaceHolderAvatarGroup.jpg";
import greenCheckmark from "@/assets/checkmark-green-circle.svg";
import greyCheckmark from "@/assets/checkmark-grey-circle.svg";
import greyEllipsis from "@/assets/vertical-ellipsis-grey.png";
import plusCircle from "@/assets/plus-black-circle-white.png";

//Backend
import { supabase } from "../supabase-client.ts";

//Auth
import { useUser } from "@clerk/clerk-react";

//Zustand
import { useUserStore } from "@/stores/userStore";

//Components
import NavSpacer from "@/components/NavSpacer";
import CarraigeLoader from "@/components/CarraigeLoader";
import Button from "@/components/Button";
import Overlay from "@/components/Overlay.tsx";
import ChallengerForm from "@/components/ChallengerForm.tsx";

const Home = () => {
  const [challenges, setChallenges] = useState([]);
  const [isChallengerFormOpen, setIsChallengerFormOpen] = useState(false);
  const isNewUser = challenges.length === 0;
  const greeting = getGreeting(isNewUser);
  const userId = useUserStore((s) => s.userId);
  const { user } = useUser();
  const standinUserName = user?.primaryEmailAddress?.emailAddress.split("@")[0];
  
  /* ----------------------- Fetch Challenges useEffect ----------------------- */
  
  useEffect(() => {
    // TODO: Add skeleton state
    // TODO: Refactor for zustand, so when adding a challenge, the fetch retriggers.
    if (!userId) return;

    const fetchChallenges = async () => {
      try {
        const { data: logs, error: logError } = await supabase
          .from("challenge_logs")
          .select("*")
          .eq("user_id", userId);

        if (logError || !logs) {
          console.error("Failed to fetch challenge logs", logError);
          return;
        }

        
        const challengeIds = logs.map((log) => log.challenge_id);
        
        console.log(logs, "logs");
        const { data: challenges, error: challengeError } = await supabase
          .from("challenges")
          .select("id, title")
          .in("id", challengeIds);

        if (challengeError || !challenges) {
          console.error("Failed to fetch challenge details", challengeError);
          return;
        }

        const enrichedLogs = logs.map((log) => {
          const challenge = challenges.find((c) => c.id === log.challenge_id);
          return {
            ...log,
            title: challenge?.title ?? "Untitled",
          };
        });

        console.log("Enriched challenges:", enrichedLogs);
        setChallenges(enrichedLogs);
      } catch (error) {
        console.error("Unexpected error fetching challenges", error);
      }
    };

    if (userId) {
      fetchChallenges();
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
      {!challenges.length && (
        <section className="dashboard-kyurem">
          <h1>Your challenges will appear here</h1>
          <div className="dashboard-kyurem_display-example">
            <div className="dashboard-kyurem_display-example_titles">
              <h3>Challenges</h3>
              <p>Show your fellow chaps you are true to your word</p>
            </div>
            <div className="dashboard-kyurem_display-example_cards">
              <div className="divider"></div>
              <div className="dashboard-kyurem_display-example_cards-card">
                <span role="img" aria-label="bagel">
                  🥯
                </span>
                <div className="dashboard-kyurem_display-example_cards-card-text">
                  <p>Jog to bagel store</p>
                  <p>Daily, 1 day left</p>
                </div>
                <div className="dashboard-kyurem_display-example_cards-card-status">
                  <div className="dashboard-kyurem_display-example_cards-card-status-done">
                    <img src={greenCheckmark} />
                    <p>Done</p>
                  </div>
                  <img src={greyEllipsis} />
                </div>
              </div>
              <div className="divider"></div>

              <div className="dashboard-kyurem_display-example_cards-card">
                <span role="img" aria-label="bagel">
                  🏃
                </span>
                <div className="dashboard-kyurem_display-example_cards-card-text">
                  <p>Jog to bagel store</p>
                  <p>Daily, 1 day left</p>
                </div>
                <div className="dashboard-kyurem_display-example_cards-card-status">
                  <div className="dashboard-kyurem_display-example_cards-card-status-done">
                    <img src={greyCheckmark} />
                    <p>Done</p>
                  </div>
                  <img src={greyEllipsis} />
                </div>
              </div>
              <div className="divider"></div>
            </div>
          </div>
        </section>
      )}
      {!challenges.length && (
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
