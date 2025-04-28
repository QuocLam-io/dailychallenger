import { useState, useRef, useEffect } from "react";
//Utils & Constants
import { getDeadlineDisplay } from "@/utils/deadlineDisplay";
import { getTomorrow } from "@/utils/getTomorrow";
import { challengerExampleData } from "@/constants/challengerExampleData";

//Styles
import "./ChallengerForm.scss";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { fadeInOut } from "@/constants/animations";
import OldTimeyLamp from "../assets/old-timey-lamp.png";
import CloseXBW from "../assets/close-x-bw.png";
import ArrowRight from "../assets/arrow-right-bw.png";
import Button from "./Button";
import plusReverse from "@/assets/plus-white-circle-black.svg";

interface ChallengerFormTypes {
  onClose: () => void;
}

const ChallengerForm = ({ onClose }: ChallengerFormTypes) => {
  const [challenge, setChallenge] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [pseudoDeadline, setPseudoDeadline] = useState<Date | undefined>(
    getTomorrow
  );
  const [deadline, setDeadline] = useState<Date | undefined>(getTomorrow);
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

  // TODO: make test for displayDate fn
  // TODO: make test for getTomorrow fn
  // TODO: test dates/check in collab with Product Manager about dates in btns
  // TODO: suggested challenges html
  const deadlineOptions = [
    {
      key: "1d",
      label: "1 Day",
      onClick: () => {
        const newDeadline = new Date();
        newDeadline.setDate(newDeadline.getDate() + 1);
        setDeadline(newDeadline);
        setSelectedDeadlineType("1d");
      },
    },
    {
      key: "1w",
      label: "1 Week",
      onClick: () => {
        const newDeadline = new Date();
        newDeadline.setDate(newDeadline.getDate() + 7);
        setDeadline(newDeadline);
        setSelectedDeadlineType("1w");
      },
    },
    {
      key: "custom",
      label:
        selectedDeadlineType === "custom" && deadlineDisplay
          ? `Custom: ${deadlineDisplay}`
          : "Custom",
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setCalendarOpen(true);
        setPseudoDeadline(deadline);
      },
    },
  ];

  const orderedDeadlineOptions =
    selectedDeadlineType === "custom"
      ? [
          deadlineOptions.find((opt) => opt.key === "custom")!,
          deadlineOptions.find((opt) => opt.key === "1d")!,
          deadlineOptions.find((opt) => opt.key === "1w")!,
        ]
      : deadlineOptions;

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
              selected={pseudoDeadline}
              onSelect={setPseudoDeadline}
            />
            <Button
              className="challenger-form_calendar-btn-confirm"
              onClick={() => {
                setDeadline(pseudoDeadline);
                setCalendarOpen(false);
                setSelectedDeadlineType("custom");
              }}
            >
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {/*  ---------------------------------- Form ----------------------------------  */}
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
                  {orderedDeadlineOptions.map(({ key, label, onClick }) => (
                    <button
                      key={key}
                      type="button"
                      className={selectedDeadlineType === key ? "selected" : ""}
                      onClick={onClick}
                    >
                      {label}
                    </button>
                  ))}
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

      <section className="cf_suggestion">
        <h2>Suggestions</h2>
        <div className="cf_suggestion-cards-container">
          {challengerExampleData.map((card) => {
            return (
              <button className="cf_suggestion-card">
                <p className="cf_suggestion-card_emoji">{card.emoji}</p>
                <div className="cf_suggestion-card_titles">
                  <h3>{card.challenge}</h3>
                  <p>{card.repeat}</p>
                </div>
                <img src={plusReverse} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
};

export default ChallengerForm;
