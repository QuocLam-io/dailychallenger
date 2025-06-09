import React, { useRef, useState, useEffect } from "react";
//Style
import "./DashboardCTAFooter.scss";
import { motion as m } from "framer-motion";

//Zustand
import { useDashboardStore } from "@/stores/dashboard/dashboardStore";
import useChallengesStore from "@/stores/challengesStore";

const DashboardCTAFooter = () => {
  const { activeTab, setActiveTab } = useDashboardStore();
  console.log(activeTab);
  const { currentChallenges, pastChallenges } = useChallengesStore();

  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const currentRef = useRef(null);
  const pastRef = useRef(null);

  useEffect(() => {
    if (currentRef.current && currentRef.current.offsetParent) {
      const { offsetLeft, offsetWidth, offsetHeight } = currentRef.current;
      setPosition({
        left: offsetLeft,
        width: offsetWidth,
        height: offsetHeight,
        opacity: 1,
      });
    }
  }, []);

  return (
    <section className="dashboard_cta-footer">
      <div className="dashboard_cta-footer_cursor-wrapper">
        <Tab
          tabType="current"
          setPosition={setPosition}
          // activeTab={activeTab}
          length={currentChallenges.length}
          onClick={setActiveTab}
          tabRef={currentRef}
        >
          Current Challenges
        </Tab>
        <Tab
          tabType="past"
          setPosition={setPosition}
          // activeTab={activeTab}
          length={pastChallenges.length}
          onClick={setActiveTab}
          tabRef={pastRef}
        >
          Past Challenges
        </Tab>

        <Cursor position={position} />
      </div>
    </section>
  );
};

export default DashboardCTAFooter;

const Tab = ({ children, setPosition, length, onClick, tabType, tabRef }) => {
  //TODO: make typescript props

  return (
    <button
      ref={tabRef}
      onMouseEnter={() => {
        if (!tabRef.current) return;

        const { width, height } = tabRef.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          height,
          left: tabRef.current.offsetLeft,
        });
      }}
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
      initial={false}
      layout
      animate={position}
      className="dashboard_cta-footer_cursor"
    />
  );
};
