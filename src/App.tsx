import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import UnderConstruction from "./pages/UnderConstruction.tsx";

function App() {

  // console.log("env test")
  // TODO: is this where I do the conditional?
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
      </Routes>
    </>
  );
}

export default App;
