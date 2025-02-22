import { useState } from "react";
//Styles
import styles from "./ChallengerForm.module.scss";
import OldTimeyLamp from "../assets/old-timey-lamp.png";
import CloseXBW from "../assets/close-x-bw.png";
import ArrowRight from "../assets/arrow-right-bw.png";

const ChallengerForm = () => {
  const [challenge, setChallenge] = useState("");

  return (
    <div className={styles["challenger-form_container"]}>
      <form
        onSubmit={(e) => setPublicChallengeHandler(e)}
        className="public-challenger-form"
      >
        <div className="public-challenger-form_header">
          <img src={OldTimeyLamp} alt="old timey lamp" />{" "}
          <button
            type="button"
            className="public-challenger-form_close-button"
            // onClick={onClose}
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
    </div>
  );
};

export default ChallengerForm;

/* ------------------------- Public Challenger Form ------------------------- */

// interface PublicChallengerFormProps {
//   onClose: () => void;
//   editPCModalOpen?: boolean;
// }

export const PublicChallengerForm: React.FC<PublicChallengerFormProps> = ({
  onClose,
  editPCModalOpen = false,
}) => {
  const [challenge, setChallenge] = useState("");

  return <div>Blub</div>;
};
