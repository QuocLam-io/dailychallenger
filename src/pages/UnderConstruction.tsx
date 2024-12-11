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
        {/* <button onClick={closeHandler}>
          <img src={ArrowLeft} alt="Left arrow" />
          <p>Back to Home</p>
        </button> */}
          <RoundedSlideButton />
      </div>
    </div>
  );
};

export default UnderConstruction;

const RoundedSlideButton = () => {
  return (
    <button
      className={`
        relative z-0 flex items-center gap-2 overflow-hidden rounded-lg border-[1px] 
        border-violet-300 px-4 py-2 font-semibold
        uppercase text-violet-300 transition-all duration-500
        
        before:absolute before:inset-0
        before:-z-10 before:translate-x-[150%]
        before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-violet-300
        before:transition-transform before:duration-1000
        before:content-[""]

        hover:scale-105 hover:text-neutral-900
        hover:before:translate-x-[0%]
        hover:before:translate-y-[0%]
        active:scale-95`}
    >
      <span>Sign up free</span>
    </button>
  );
};
