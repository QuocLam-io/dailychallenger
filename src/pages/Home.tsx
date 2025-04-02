//Styles
import "./Home.scss";
import { AnimatePresence } from "framer-motion";

//Components
import Overlay from "@/components/Overlay.tsx";
import ChallengerForm from "@/components/ChallengerForm.tsx";

const Home = () => {

  return (
    <main>
      <p>Blub</p>
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
