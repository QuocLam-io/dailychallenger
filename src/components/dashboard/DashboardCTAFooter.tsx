import React from "react";
//Style
import "./DashboardCTAFooter.scss";

//Zustand
import { useDashboardStore } from "@/stores/dashboard/dashboardStore";
import useChallengesStore from "@/stores/challengesStore";

const DashboardCTAFooter = () => {
  const { activeTab, setActiveTab } = useDashboardStore();
  const { currentChallenges, pastChallenges } = useChallengesStore();

  return (
    <section className="dashboard_cta-footer">
      <div className="dashboard_cta-footer_cursor-wrapper">
        <button
          className={activeTab === "current" ? "active" : ""}
          onClick={() => setActiveTab("current")}
        >
          <p>Current Challenges</p>
          <span>{currentChallenges.length}</span>
        </button>
        <button
          className={activeTab === "past" ? "active" : ""}
          onClick={() => setActiveTab("past")}
        >
          <p>Past Challenges</p>
          <span>{pastChallenges.length}</span>
        </button>
      </div>
    </section>
  );
};

export default DashboardCTAFooter;
