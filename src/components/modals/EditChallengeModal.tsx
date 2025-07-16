import { useEffect } from "react";

//Styling
import { fadeInOut } from "@/constants/animations";
import "./EditChallengeModal.scss";

//Zustand
import { useChallengeDetailsPageStore } from "@/stores/challengeDetailsPageStore";
import { useModalsStore } from "@/stores/modalsStore";
import { useUserStore } from "@/stores/userStore";
import useChallengesStore from "@/stores/challengesStore";

//Utils
import { editChallengeHandler } from "@/utils/editChallenge";

//Components
import Overlay from "../Overlay";
import CloseXBW from "@/assets/close-x-bw.png";
import ArrowRight from "@/assets/arrow-right-bw.png";
import "./EditChallengeModal.scss";
import { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

const EditChallengeModal = () => {
  const { challengeDetailsPageChallenge } = useChallengeDetailsPageStore();
  const { toggleEditChallengeModalOpen } = useModalsStore();
  const [challenge, setChallenge] = useState(
    challengeDetailsPageChallenge ? challengeDetailsPageChallenge.title : ""
  );
  const supabaseId = useUserStore((s) => s.supabaseId);

  /* ---------------------------------- Emoji --------------------------------- */
  const [emoji, setEmoji] = useState(
    challengeDetailsPageChallenge?.emoji || "⛳️"
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  /* ------------------------------ Handle Submit ----------------------------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await editChallengeHandler(
      supabaseId,
      challenge,
      emoji,
      challengeDetailsPageChallenge
    );

    // if (!supabaseId || !challenge || !emoji || !challengeDetailsPageChallenge)
    //   return;

    // //Check if new challenge exists in Challenges table first
    // const { data: existingChallenge } = await supabase
    //   .from("challenges")
    //   .select("id")
    //   .eq("title", challenge)
    //   .single();

    // let challengeId = existingChallenge?.id;

    // //If challenge doesn't exist in the Challenges Table, make one
    // if (!challengeId) {
    //   const { data: newChallenge, error: insertError } = await supabase
    //     .from("challenges")
    //     .insert({
    //       title: challenge,
    //       created_by: supabaseId,
    //     })
    //     .select("id")
    //     .single();

    //   if (insertError) {
    //     console.error("Edit Challenge creation error:", insertError.message);
    //     return;
    //   }

    //   challengeId = newChallenge?.id;

    //   //Update current challenge_log's id and emoji to new challenge
    //   const { error: updateError } = await supabase
    //     .from("challenge_logs")
    //     .update({
    //       challenge_id: challengeId,
    //       emoji: emoji,
    //     })
    //     .eq("id", challengeDetailsPageChallenge.id);

    //   if (updateError) {
    //     console.error("Error updating challenge log:", updateError.message);
    //   } else {
    //     setChallengeDetailsPageChallenge(null);
    //     toggleEditChallengeModalOpen();
    //     fetchChallenges(supabaseId);
    //   }

    //   return;
    // }

    // // If challenge does exist in Challenges Table, than just update the challenge_log's id and emoji
    // if (challengeId) {
    //   const { error: updateError } = await supabase
    //     .from("challenge_logs")
    //     .update({
    //       challenge_id: challengeId,
    //       emoji: emoji,
    //     })
    //     .eq("id", challengeDetailsPageChallenge.id);

    //   if (updateError) {
    //     console.error("Error updating challenge log:", updateError.message);
    //   } else {
    //     setChallengeDetailsPageChallenge(null);
    //     toggleEditChallengeModalOpen();
    //     fetchChallenges(supabaseId);
    //   }
    // }
  };

  return (
    <Overlay customClassName="flex-align-start portrait-align-center">
      <div className="challenger-edit-form_container">
        <form onSubmit={handleSubmit} className="challenger-edit-form">
          <div className="challenger-edit-form_header">
            <button
              type="button"
              className="emoji-trigger challenger-edit-form_header_emoji-btn"
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
              className="challenger-edit-form_close-button"
              onClick={toggleEditChallengeModalOpen}
            >
              <img src={CloseXBW} alt="Close challenger form button" />
            </button>
          </div>
          <div className="challenger-edit-form_body">
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
          <div className="challenger-edit-form_footer">
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
