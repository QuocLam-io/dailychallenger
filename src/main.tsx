import { createRoot } from "react-dom/client";
//Router
import { BrowserRouter as Router } from "react-router-dom";
//Styles
import "./index.scss";
import App from "./App.tsx";
//Auth
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <Router>
      <App />
    </Router>
  </ClerkProvider>
);
