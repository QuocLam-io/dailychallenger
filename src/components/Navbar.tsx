//Router
import { Link } from "react-router-dom";
//Styles
import "./Navbar.scss";
//Auth
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className="navbar" id="navbar">
      <Link to="/" className="navbar-logo">
        <p>The</p>
        <p>Daily Challenger</p>
      </Link>
      <div className="navbar-action-btns">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
