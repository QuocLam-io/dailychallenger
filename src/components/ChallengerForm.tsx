import { useState } from "react";
//Styles
import OldTimeyLamp from "../assets/old-timey-lamp.png";
import CloseXBW from "../assets/close-x-bw.png";
import ArrowRight from "../assets/arrow-right-bw.png";

interface ChallengerFormTypes {
  //No props... for now *shifty eyes*
}

const ChallengerForm: React.FC<ChallengerFormTypes> = () => {
  const [challenge, setChallenge] = useState<string>("");

  return (
    // TODO: change classnames
    <div className="public-challenger-form_container">
      <form
        // onSubmit={(e) => setPublicChallengeHandler(e)}
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

// export const PublicChallengerForm: React.FC<PublicChallengerFormProps> = ({
//   onClose,
//   editPCModalOpen = false,
// }) => {
//   const [challenge, setChallenge] = useState("");

//   return <div>Blub</div>;
// };
