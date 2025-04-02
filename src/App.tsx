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
import Navbar from "./components/Navbar.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import UnderConstruction from "./pages/UnderConstruction.tsx";
import Home from "./pages/Home.tsx";

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
          </Route>
          {/* Private Routes */}
          <Route
            path="/home"
            element={isSignedIn ? <PrivateRoutesWrapper/> : <Navigate to="/" replace />}
          >
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
