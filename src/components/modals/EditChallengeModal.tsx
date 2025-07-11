//Styling
import { fadeInOut } from "@/constants/animations";

//Zustand
import { useChallengeDetailsPageStore } from "@/stores/challengeDetailsPageStore";
import { useModalsStore } from "@/stores/modalsStore";

//Components
import Overlay from "../Overlay";
import CloseXBW from "@/assets/close-x-bw.png";
import ArrowRight from "@/assets/arrow-right-bw.png";
import "./EditChallengeModal.scss";
import { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

const EditChallengeModal = () => {
  const { challengeDetailsPageChallenge, setChallengeDetailsPageChallenge } =
    useChallengeDetailsPageStore();
  const { toggleEditChallengeModalOpen } = useModalsStore();
  const [challenge, setChallenge] = useState(
    challengeDetailsPageChallenge ? challengeDetailsPageChallenge.title : ""
  );

  /* ---------------------------------- Emoji --------------------------------- */
  //TODO: handle click outside
  const [emoji, setEmoji] = useState(
    challengeDetailsPageChallenge?.emoji || "⛳️"
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  /* ------------------------------ Handle Submit ----------------------------- */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Emoji logic
    // TODO: Supabase
    setChallengeDetailsPageChallenge(null);
    toggleEditChallengeModalOpen();
  };

  return (
    <Overlay customClassName="flex-align-start portrait-align-center">
      <div className="public-challenger-form_container">
        <form onSubmit={handleSubmit} className="public-challenger-form">
          <div className="public-challenger-form_header">
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
                    searchDisabled={true}
                    previewConfig={{ showPreview: false }}
                    height={350}
                    width={300}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              className="public-challenger-form_close-button"
              onClick={toggleEditChallengeModalOpen}
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
                placeholder="Edit your challenge"
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
              />
            </div>
          </div>
          <div className="public-challenger-form_footer">
            <button disabled={!challenge} type="submit">
              <p>Save</p>
              <img src={ArrowRight} alt="Save challenge arrow icon" />
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  );
};

export default EditChallengeModal;
