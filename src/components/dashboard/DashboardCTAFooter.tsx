import React, { useRef, useState, useEffect, RefObject } from "react";
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

  const currentRef = useRef<HTMLButtonElement>(null);
  const pastRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (currentRef.current) {
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

interface TabProps {
  children: React.ReactNode;
  setPosition: (position: {
    width: number;
    height: number;
    left: number;
    opacity: number;
  }) => void;
  length: number;
  tabType: "current" | "past";
  tabRef: RefObject<HTMLButtonElement>;
  onClick: (tabType: "current" | "past") => void;
}

const Tab = ({
  children,
  setPosition,
  length,
  onClick,
  tabType,
  tabRef,
}: TabProps) => {
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

const Cursor = ({
  position,
}: {
  position: {
    left: number;
    width: number;
    height: number;
    opacity: number;
  };
}) => {
  return (
    <m.span
      initial={false}
      layout
      animate={position}
      className="dashboard_cta-footer_cursor"
    />
  );
};
