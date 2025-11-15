import { useState, useRef, useEffect } from "react";
//Utils & Constants
import { getDeadlineDisplay } from "@/utils/deadlineDisplay";
import { getTomorrow } from "@/utils/getTomorrow";
import { challengerExampleData } from "@/constants/challengerExampleData";

//Supabase
import { supabase } from "@/supabase-client";

//Auth
import { useUser } from "@clerk/clerk-react";

//Zustand
import { useUserStore } from "@/stores/userStore";
import useChallengesStore from "@/stores/challengesStore";

//SMS
import { sendSurgeSMS } from "@/middleware/sms/sendSurgeSMS";


//Styles
import "./ChallengerForm.scss";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInOut } from "@/constants/animations";
import CloseXBW from "../assets/close-x-bw.png";
import ArrowRight from "../assets/arrow-right-bw.png";
import plusReverse from "@/assets/plus-white-circle-black.svg";

//Components
import EmojiPicker from "emoji-picker-react";
import { Calendar } from "@/components/ui/calendar";
import Button from "./Button";
import Overlay from "@/components/Overlay.tsx";

interface ChallengerFormTypes {
  onClose: () => void;
}

const ChallengerForm = ({ onClose }: ChallengerFormTypes) => {
  const { user } = useUser();
  const clerkId = useUserStore((s) => s.clerkId);
  const supabaseId = useUserStore((s) => s.supabaseId);
  const userRole = useUserStore((s) => s.role);
  const firstName = useUserStore((s) => s.firstName);
  const { fetchChallenges } = useChallengesStore();
  const isAdmin = userRole === "admin" || userRole === "superadmin";
  const standinUserName = user?.primaryEmailAddress?.emailAddress.split("@")[0];
  const [challenge, setChallenge] = useState<string>("");
  const [pseudoDeadline, setPseudoDeadline] = useState<Date | undefined>(
    getTomorrow
  );
  const [deadline, setDeadline] = useState<Date | undefined>(getTomorrow);
  const [selectedDeadlineType, setSelectedDeadlineType] = useState<
    "1d" | "1w" | "custom"
  >("1d");
  const deadlineDisplay = getDeadlineDisplay(deadline);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  //Carousel
  const [carouselWidth, setCarouselWidth] = useState<number>(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current) {
      setCarouselWidth(
        carousel.current.scrollWidth - carousel.current.offsetWidth
      );
    }
  }, []);

  const deadlineOptions = [
    {
      key: "1d",
      label: "1 Day",
      onClick: () => {
        const newDeadline = new Date();
        newDeadline.setDate(newDeadline.getDate() + 1);
        setDeadline(newDeadline);
        setSelectedDeadlineType("1d");
        setCalendarOpen(false);
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
        setCalendarOpen(false);
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

  //Calendar
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clickOutsideCalendarHandler(event: MouseEvent) {
      if (
        calendarOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutsideCalendarHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideCalendarHandler);
    };
  }, [calendarOpen]);

  //Emoji
  const [emoji, setEmoji] = useState<string>("⛳️");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    function clickOutsideEmojiHandler(event: MouseEvent) {
      const target = event.target as Node;
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(target) &&
        !document.querySelector(".emoji-trigger")?.contains(target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", clickOutsideEmojiHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideEmojiHandler);
    };
  }, [showEmojiPicker]);

  /* ------------------------ Submit Challenge Handler ------------------------ */
  const submitChallengeHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabaseId || !challenge || !deadline || !emoji || isSubmitting)
      return;

    setIsSubmitting(true);

    //Check challenges table if challenge exists
    const { data: existingChallenge } = await supabase
      .from("challenges")
      .select("id")
      .eq("created_by", supabaseId)
      .eq("title", challenge)
      .single();

    let challengeId = existingChallenge?.id;

    //If challenge doesn't exist in challenges table, make one
    if (!challengeId) {
      const { data: newChallenge, error: insertError } = await supabase
        .from("challenges")
        .insert({ title: challenge, created_by: supabaseId })
        .select("id")
        .single();

      if (insertError) {
        console.error("Challenge creation error:", insertError.message);
        setIsSubmitting(false);
        return;
      }

      challengeId = newChallenge?.id;
    }

    //Make a challenge_log in challenge logs table
    const { error: logError } = await supabase.from("challenge_logs").insert({
      challenge_id: challengeId,
      user_id: supabaseId,
      emoji,
      deadline: deadline.toISOString(),
      is_public: isPublic,
    });

    if (logError) {
      console.error("Log submission error:", logError.message);
      setIsSubmitting(false);
    } else {
      console.log("✅ Challenge + log submitted to test tables");

      // Send SMS notification if phone number provided
      if (phoneNumber) {
        // Use firstName from Zustand (which can be updated by user) instead of Clerk
        const userName = firstName ?? standinUserName ?? clerkId ?? "I";
        await sendSurgeSMS({
          phoneNumber,
          message: `${emoji} ${userName}'${userName.endsWith('s') ? '' : 's'} doing the challenge: "${challenge}" by ${deadlineDisplay}`,
        });
      }

      fetchChallenges(supabaseId);
      onClose();
    }
  };

  return (
    <Overlay customClassName={`flex-align-start portrait-align-center`}>
      <motion.div className="challenger-form_wrapper" {...fadeInOut}>
        {/* --------------------------------- Modals --------------------------------- */}
        <AnimatePresence>
          {calendarOpen && (
            <motion.div
              ref={calendarRef}
              className="challenger-form_calendar-wrapper"
              {...fadeInOut}
            >
              <Calendar
                mode="single"
                selected={pseudoDeadline}
                onSelect={setPseudoDeadline}
                disabled={(date) => date < new Date()}
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
          onSubmit={(e) => submitChallengeHandler(e)}
          className="challenger-form"
        >
          <div className="challenger-form_header">
            <button
              type="button"
              className="emoji-trigger challenger-form_header_emoji-btn"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              {emoji}
            </button>

            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  ref={emojiPickerRef}
                  className="emoji-picker-popover emoji-popover-absolute"
                  {...fadeInOut}
                >
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setEmoji(emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                    searchDisabled={false}
                    searchPlaceholder="Search emojis..."
                    autoFocusSearch={true}
                    previewConfig={{ showPreview: false }}
                    height={350}
                    width={300}
                  />
                </motion.div>
              )}
            </AnimatePresence>
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
                onChange={(e) => {
                  const input = e.target.value;
                  if (input.length === 1) {
                    setChallenge(input.toUpperCase());
                  } else {
                    setChallenge(input);
                  }
                }}
              />
            </div>
            {isAdmin && (
              <div className="input-wrapper">
                {!phoneNumber && <span className="blinking-caret"></span>}
                <input
                  aria-label="Phone number input"
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            )}
            <div className="challenger-form_deadline-setter">
              <div className="deadline-setter_date-setting">
                <p>Do it by</p>
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
                        className={
                          selectedDeadlineType === key ? "selected" : ""
                        }
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
                <button
                  onClick={() => {
                    setIsPublic(false);
                  }}
                ></button>
              </div>
            </div>
          </div>
          <div className="challenger-form_footer">
            <Button
              disabled={!challenge || isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
              className="challenger-form_submit-btn"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
        {/* ---------------------------- Suggestion Cards ----------------------------  */}
        <section className="cf_suggestion">
          <h2>Suggestions</h2>
          <div className="cf_suggestion-cards-container">
            {challengerExampleData.map((card) => {
              return (
                <button
                  onClick={() => {
                    setEmoji(card.emoji);
                    setChallenge(card.challenge);
                  }}
                  key={card.id}
                  className="cf_suggestion-card"
                >
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
    </Overlay>
  );
};

export default ChallengerForm;
