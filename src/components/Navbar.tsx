//Router
import { Link } from "react-router-dom";
//Styles
import "./Navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <p>The</p>
        <p>Daily Challenger</p>
      </Link>
      <div className="navbar-action-btns">
        <Link to="/under-construction">Sign In</Link>
      </div>
    </nav>
  );
};

export default Navbar;
