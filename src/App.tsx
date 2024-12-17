import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.tsx";
import LandingPage from "./Pages/LandingPage";
import UnderConstruction from "./Pages/UnderConstruction";

function App() {
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
