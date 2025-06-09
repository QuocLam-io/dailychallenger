import React, { useRef, useState } from "react";
//Style
import "./DashboardCTAFooter.scss";
import { motion as m } from "framer-motion";

//Zustand
import { useDashboardStore } from "@/stores/dashboard/dashboardStore";
import useChallengesStore from "@/stores/challengesStore";

const DashboardCTAFooter = () => {
  const { activeTab, setActiveTab } = useDashboardStore();
  const { currentChallenges, pastChallenges } = useChallengesStore();

  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <section className="dashboard_cta-footer">
      <div className="dashboard_cta-footer_cursor-wrapper">
        <Tab
          tabType="current"
          setPosition={setPosition}
          activeTab={activeTab}
          length={currentChallenges.length}
          onClick={setActiveTab}
        >
          Current Challenges
        </Tab>
        <Tab
          tabType="past"
          setPosition={setPosition}
          activeTab={activeTab}
          length={pastChallenges.length}
          onClick={setActiveTab}
        >
          Past Challenges
        </Tab>

        <Cursor position={position} />
      </div>
    </section>
  );
};

export default DashboardCTAFooter;

const Tab = ({ children, setPosition, length, onClick, activeTab, tabType }) => {
  //TODO: make typescript props
  //TODO: Refactor cursor to match designs and appear behind current tab on default

  const ref = useRef(null);

  return (
    <button
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className={activeTab === tabType ? "active" : ""}
      onClick={() => onClick(tabType)}
    >
      <p>{children}</p>
      <span>{length}</span>
    </button>
  );
};

const Cursor = ({ position }) => {
  return (
    <m.span
      animate={position}
      className="absolute z-0 h-10 rounded-full bg-black md:h-12"
    />
  );
};
