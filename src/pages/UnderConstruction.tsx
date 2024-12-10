import React from "react";
//Router
import { useNavigate } from "react-router";
//Styles
import "./UnderConstruction.scss";
import ArrowLeft from "../assets/arrow-left-bw.png";
import CharlieChaplin from "../assets/charlie-chaplin.gif";

const UnderConstruction = () => {
  const navigate = useNavigate();
  const closeHandler = () => {
    //TODO: add conditional logic for authenticated user
    navigate("/");
  };

  return (
    <div className="under-construction">
      <div className="under-construction-text">
        <h1>Under Construction</h1>
        <p>Oopsies... seems we&apos;re a bit under-dressed</p>
        <p>Well, this is embarrassing. Please check back soon for updates.</p>
      </div>
      <img src={CharlieChaplin} alt="Stock photo of Charlie Chaplin" />
      <div className="under-construction-footer">
        <button onClick={closeHandler}>
          <img src={ArrowLeft} alt="Left arrow" />
          <p>Back to Home</p>
        </button>
      </div>
    </div>
  );
};

export default UnderConstruction;
