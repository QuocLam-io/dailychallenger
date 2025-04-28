import { useState, useRef, useEffect } from "react";
import { getDeadlineDisplay } from "@/utils/deadlineDisplay";

//Styles
import "./ChallengerForm.scss";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { fadeInOut } from "@/constants/animations";
import OldTimeyLamp from "../assets/old-timey-lamp.png";
import CloseXBW from "../assets/close-x-bw.png";
import ArrowRight from "../assets/arrow-right-bw.png";
import Button from "./Button";

interface ChallengerFormTypes {
  onClose: () => void;
}

const ChallengerForm = ({ onClose }: ChallengerFormTypes) => {
  const [challenge, setChallenge] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [deadline, setDeadline] = useState<Date | undefined>(new Date());
  const [selectedDeadlineType, setSelectedDeadlineType] = useState<
    "1d" | "1w" | "custom" | null
  >(null);
  const deadlineDisplay = getDeadlineDisplay(deadline);
  // TODO: check backend date format
  console.log(deadline, "deadline");

  //Carousel
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const carousel = useRef();

  useEffect(() => {
    setCarouselWidth(
      carousel.current.scrollWidth - carousel.current.offsetWidth
    );
  }, []);

  return (
    <motion.div className="challenger-form_wrapper" {...fadeInOut}>
      {/* --------------------------------- Modals --------------------------------- */}
      <AnimatePresence>
        {calendarOpen && (
          <motion.div
            className="challenger-form_calendar-wrapper"
            {...fadeInOut}
          >
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
            />
            <Button
              className="challenger-form_calendar-btn-confirm"
              onClick={() => {
                setCalendarOpen(false);
              }}
            >
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --------------------------------------------------------------------------  */}
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
            onClick={onClose}
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
                  <button
                    type="button"
                    className={selectedDeadlineType === "1d" ? "selected" : ""}
                    onClick={() => {
                      const newDeadline = new Date();
                      newDeadline.setDate(newDeadline.getDate() + 1);
                      setDeadline(newDeadline);
                      setSelectedDeadlineType("1d");
                    }}
                  >
                    1 Day
                  </button>
                  <button
                    type="button"
                    className={selectedDeadlineType === "1w" ? "selected" : ""}
                    onClick={() => {
                      const newDeadline = new Date();
                      newDeadline.setDate(newDeadline.getDate() + 7);
                      setDeadline(newDeadline);
                      setSelectedDeadlineType("1w");
                    }}
                  >
                    1 Week
                  </button>
                  <button
                    type="button"
                    className={
                      selectedDeadlineType === "custom" ? "selected" : ""
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setCalendarOpen(true);
                      setSelectedDeadlineType("custom");
                    }}
                  >
                    Custom{deadlineDisplay && `: ${deadlineDisplay}`}
                  </button>
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
    </motion.div>
  );
};

export default ChallengerForm;
