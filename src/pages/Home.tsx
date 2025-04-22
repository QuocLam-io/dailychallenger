//Styles
import "./Home.scss";
import { AnimatePresence } from "framer-motion";

//Zustand
import { useUserStore } from "@/stores/userStore";

//Components
import CarraigeLoader from "@/components/CarraigeLoader";
// import Overlay from "@/components/Overlay.tsx";
// import ChallengerForm from "@/components/ChallengerForm.tsx";
import NavSpacer from "@/components/NavSpacer";

const Home = () => {
  const userId = useUserStore((s) => s.userId);
  // console.log(userId,"userId" )

  if (!userId) return <CarraigeLoader />;

  return (
    <main>
      <NavSpacer />
      {/* Write conditional logic to display email id no name exists */}

      <AnimatePresence>
        {/* <Overlay>
          <ChallengerForm />
        </Overlay> */}
      </AnimatePresence>
    </main>
  );
};

export default Home;
