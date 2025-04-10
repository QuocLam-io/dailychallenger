//Styles
import "./Home.scss";
import { AnimatePresence } from "framer-motion";

//Zustand
import { useUserStore } from "@/stores/userStore";

//Components
// import Overlay from "@/components/Overlay.tsx";
// import ChallengerForm from "@/components/ChallengerForm.tsx";

const Home = () => {
  const userId = useUserStore((s) => s.userId);
  console.log(userId,"userId" )

  if (!userId) return <div>Loading Home...</div>;

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
