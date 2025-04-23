//React
import {
  // @ts-ignore
  useEffect,
  useState,
} from "react";
//Utils
import { getGreeting } from "@/utils/getGreeting";
//Styles
import "./Home.scss";
import { AnimatePresence } from "framer-motion";

//Auth
import { useUser } from "@clerk/clerk-react";

//Zustand
import { useUserStore } from "@/stores/userStore";

//Components
import NavSpacer from "@/components/NavSpacer";
import CarraigeLoader from "@/components/CarraigeLoader";
// import Overlay from "@/components/Overlay.tsx";
// import ChallengerForm from "@/components/ChallengerForm.tsx";

const Home = () => {
  // @ts-ignore
  const [challenges, setChallenges] = useState([]);
  const isNewUser = challenges.length === 0;
  const greeting = getGreeting(isNewUser);
  const userId = useUserStore((s) => s.userId);
  const { user } = useUser();
  const standinUserName = user?.primaryEmailAddress?.emailAddress.split("@")[0];
  // console.log(userId,"userId" )

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
            <p>{user.firstName ?? standinUserName}</p>
          </div>
          <div className="dashboard-user_streak">
            <p>Current streak</p>
            <p>1 day</p>
            <p>Longest streak: 1 day</p>
            <div className="dashboard-user_streak-cheers">
              <p>No cheers yet</p>
              {/* Pictures of friends cheering will be here */}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {/* <Overlay>
          <ChallengerForm />
        </Overlay> */}
      </AnimatePresence>
    </main>
  );
};

export default Home;
