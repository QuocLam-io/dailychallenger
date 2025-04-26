import { useState, useRef, useEffect } from "react";
//Styles
import "./ChallengerForm.scss";
import { motion } from "framer-motion";
import OldTimeyLamp from "../assets/old-timey-lamp.png";
import CloseXBW from "../assets/close-x-bw.png";
import ArrowRight from "../assets/arrow-right-bw.png";

interface ChallengerFormTypes {
  onClick: () => void;
}

const ChallengerForm = ({ onClick }: ChallengerFormTypes) => {
  const [challenge, setChallenge] = useState<string>("");

  //Carousel
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const carousel = useRef();

  useEffect(() => {
    setCarouselWidth(
      carousel.current.scrollWidth - carousel.current.offsetWidth
    );
  }, []);

  return (
    // TODO: change classnames
    <div className="challenger-form_wrapper">
      <form
        // onSubmit={(e) => setPublicChallengeHandler(e)}
        className="challenger-form"
      >
        <div className="challenger-form_header">
          {/* TODO: react emoji library */}
          <img src={OldTimeyLamp} aria-hidden="true" />{" "}
          <button
            type="button"
            className="challenger-form_close-button"
            onClick={onClick}
          >
            <img src={CloseXBW} alt="Close challenger form button" />
          </button>
        </div>
        <div className="challenger-form_body">
          <div className="input-wrapper">
            {!challenge && <span className="blinking-caret"></span>}
            <input
              aria-label="Challenge input"
              autoFocus
              type="text"
              placeholder="Wake up at 6AM"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
            />
          </div>
          <div className="challenger-form_deadline-setter">
            <div className="deadline-setter_date-setting">
              <p>Ends in</p>
              <motion.div
                ref={carousel}
                className="deadline-setter_date-setting_carousel"
              >
                <motion.div
                  drag="x"
                  dragConstraints={{ right: 0, left: -carouselWidth }}
                  className="deadline-setter_date-setting_carousel-inner"
                >
                  <button>1 Day</button>
                  <button>1 Week</button>
                  <button>Custom</button>
                </motion.div>
              </motion.div>
            </div>
            <div className="deadline-setter_repeat-setting">
              Does not repeat <span>COMING SOON</span>
            </div>
          </div>
        </div>
        <div className="challenger-form_footer">
          {/* TODO: swap out for Button component */}
          <button disabled={!challenge}>
            <p>Create</p>
            <img src={ArrowRight} alt="Create a challenge arrow icon" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChallengerForm;
