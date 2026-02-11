//Routing
import {
  Routes,
  Route,
  BrowserRouter,
  Outlet,
  Navigate,
} from "react-router-dom";
//Auth
import { SignedOut, useAuth } from "@clerk/clerk-react";
import PrivateRoutesWrapper from "./auth/PrivateRoutesWrapper.tsx";
//Components
import { Navbar, ModalPortal } from "@/components/shared";
import LandingPage from "./pages/LandingPage.tsx";
import UnderConstruction from "./pages/UnderConstruction.tsx";
import Home from "./pages/Home.tsx";
import ChallengeDetailsPage from "./pages/ChallengeDetailsPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";

function App() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              isSignedIn ? (
                <Navigate to="/home" replace />
              ) : (
                <SignedOut>
                  <Outlet />
                </SignedOut>
              )
            }
          >
            <Route path="/" element={<LandingPage />} />
            <Route path="/under-construction" element={<UnderConstruction />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Route>
          {/* All Private Routes - protected by PrivateRoutesWrapper */}
          <Route
            element={isSignedIn ? <PrivateRoutesWrapper /> : <Navigate to="/" replace />}
          >
            <Route path="/home" element={<Home />} />
            <Route path="challenge-details/:id" element={<ChallengeDetailsPage />} />
          </Route>
        </Routes>
        <ModalPortal />
      </BrowserRouter>
    </>
  );
}

export default App;
