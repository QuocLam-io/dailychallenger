"use client";
import React, { useState } from "react";
//Styling
import "./EmptyLanding.scss";
import { AnimatePresence } from "framer-motion";
import StrongMan from "../assets/strongest-man-alive.png";
import PlusCircle from "../assets/plus-black-circle-white.png";
import PlusReverse from "../assets/plus-white-circle-black.png";
import OldTimeyLamp from "../assets/old-timey-lamp.png";
import CloseXBW from "../assets/close-x-bw.png";
import ArrowRight from "../assets/arrow-right-bw.png";

//Components
import Overlay from "./Overlay";

const EmptyLanding: React.FC = () => {
  const [publicChallengerModalOpen, setPublicChallengerModalOpen] =
    useState(false);

  const publicChallengerModalClose = () => {
    setPublicChallengerModalOpen(false);
  };

  return (
    <div className="public-empty-container">
      <section className="public-empty-hero">
        <img
          src={StrongMan}
          alt="strongest man alive"
          className="public-empty-hero-strong_man"
        />
        <div className="public-empty-hero_titles">
          <h2>Say old chap...</h2>
          <h1>Fancy a challenge?</h1>
        </div>
        <p>
          Never get caught by your ex looking like a slob again! Crush those
          push-ups! Hit that run! Read that book! You’ve got this— talk is
          cheap, but showing off your hard-earned results? Priceless.
        </p>
      </section>
      <section className="public-empty-examples">
        <h3>My Challenges</h3>
        <ExampleCard title="Do 50 push-ups" dead="Ends in 3 hours" />
        <ExampleCard title="Jog 4 miles" dead="Ends in 7 days" />
      </section>
      <section className="public-empty-footer">
        <h3>Try it out:</h3>
        <button onClick={() => setPublicChallengerModalOpen(true)}>
          <img src={PlusCircle} alt="Create a challenge plus icon" />
          <p>Create a challenge</p>
        </button>
      </section>
      <AnimatePresence>
        {publicChallengerModalOpen && (
          <Overlay
            onClose={publicChallengerModalClose}
            customClassName={`flex-align-start portrait-align-center`}
          >
            <PublicChallengerForm onClose={publicChallengerModalClose} />
          </Overlay>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmptyLanding;

/* ------------------------- Example Card Component ------------------------- */

interface ExampleCardProps {
  title: string;
  dead: string;
}

export const ExampleCard: React.FC<ExampleCardProps> = ({ title, dead }) => {
  return (
    <div className="example-card">
      <div className="example-card-icon"></div>
      <div className="example-card-info">
        <h4>{title}</h4>
        <p>{dead}</p>
      </div>
      <div className="example-card-check">
        <img src={PlusReverse} alt="checkmark icon" />
      </div>
    </div>
  );
};

/* ------------------------- Public Challenger Form ------------------------- */

interface PublicChallengerFormProps {
  onClose: () => void;
}

export const PublicChallengerForm: React.FC<PublicChallengerFormProps> = ({
  onClose,
}) => {
  const [challenge, setChallenge] = useState("");

  const challengeSuggestions = [
    { title: "Do 50 push-ups", dead: "Ends in 3 hours" },
    { title: "Jog 3 miles", dead: "Ends in 7 days}" },
  ];

  const setPublicChallengeHandler = (e) => {
    e.preventDefault();
    if (challenge) {
      const expirationTime = Date.now() + 24 * 60 * 60 * 1000;

      localStorage.setItem(
        "publicChallenge",
        JSON.stringify({ challenge, expiresAt: expirationTime, expired: false })
      );

      onClose();
      window.location.reload();
    }
  };

  return (
    <div className="public-challenger-form_container">
      <form
        onSubmit={(e) => setPublicChallengeHandler(e)}
        className="public-challenger-form"
      >
        <div className="public-challenger-form_header">
          <img src={OldTimeyLamp} alt="old timey lamp" />{" "}
          <button
            type="button"
            className="public-challenger-form_close-button"
            onClick={onClose}
          >
            <img src={CloseXBW} alt="Close challenger form button" />
          </button>
        </div>
        <div className="public-challenger-form_body">
          <div className="input-wrapper">
            {!challenge && <span className="blinking-caret"></span>}
            <input
              aria-label="Challenge input"
              autoFocus
              type="text"
              placeholder="Create a challenge"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
            />
          </div>
          <div className="pro-example-features">
            <div className="pro-example-feature">
              <p>Ends in 1 day</p>
              <div className="pro-fake-btn">
                <p>Edit</p>
                <div>PRO</div>
              </div>
            </div>
            <div className="pro-example-feature">
              <p>Does not repeat</p>
              <div className="pro-fake-btn">
                <p>Edit</p>
                <div>PRO</div>
              </div>
            </div>
          </div>
        </div>
        <div className="public-challenger-form_footer">
          <button disabled={!challenge}>
            <p>Create</p>
            <img src={ArrowRight} alt="Create a challenge arrow icon" />
          </button>
        </div>
      </form>
      <section className="public-challenger-form_suggestions">
        <h3>Popular Challenges</h3>
        <div className="suggestion-example-cards">
          <button
            onClick={() => {
              setChallenge(challengeSuggestions[0].title);
            }}
          >
            <ExampleCard
              title={challengeSuggestions[0].title}
              dead="Ends in 3 hours"
            />
          </button>
          <button
            onClick={() => {
              setChallenge(challengeSuggestions[1].title);
            }}
          >
            <ExampleCard
              title={challengeSuggestions[1].title}
              dead="Ends in 7 days"
            />
          </button>
        </div>
      </section>
    </div>
  );
};