import "./DashboardEmptyExamples.scss"
import greenCheckmark from "@/assets/icons/checkmark-green-circle.svg";
import greyCheckmark from "@/assets/icons/checkmark-grey-circle.svg";
import greyEllipsis from "@/assets/images/vertical-ellipsis-grey.png";

const DashboardEmptyExamples = () => {
  
  return (
    <section className="dashboard-kyurem">
      <h1>Your challenges will appear here</h1>
      <div className="dashboard-kyurem_display-example">
        <div className="dashboard-kyurem_display-example_titles">
          <h3>Challenges</h3>
          <p>Show your fellow chaps you are true to your word</p>
        </div>
        <div className="dashboard-kyurem_display-example_cards">
          <div className="divider"></div>
          <div className="dashboard-kyurem_display-example_cards-card">
            <span role="img" aria-label="bagel">
              🥯
            </span>
            <div className="dashboard-kyurem_display-example_cards-card-text">
              <p>Jog to bagel store</p>
              <p>Daily, 1 day left</p>
            </div>
            <div className="dashboard-kyurem_display-example_cards-card-status">
              <div className="dashboard-kyurem_display-example_cards-card-status-done">
                <img src={greenCheckmark} />
                <p>Done</p>
              </div>
              <img src={greyEllipsis} />
            </div>
          </div>
          <div className="divider"></div>

          <div className="dashboard-kyurem_display-example_cards-card">
            <span role="img" aria-label="bagel">
              🏃
            </span>
            <div className="dashboard-kyurem_display-example_cards-card-text">
              <p>Jog to bagel store</p>
              <p>Daily, 1 day left</p>
            </div>
            <div className="dashboard-kyurem_display-example_cards-card-status">
              <div className="dashboard-kyurem_display-example_cards-card-status-done">
                <img src={greyCheckmark} />
                <p>Done</p>
              </div>
              <img src={greyEllipsis} />
            </div>
          </div>
          <div className="divider"></div>
        </div>
      </div>
    </section>
  );
};

export default DashboardEmptyExamples;
