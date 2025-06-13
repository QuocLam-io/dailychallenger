import { useRef, useState, useEffect } from "react";
import "./DashboardCTAFooter.scss";
import { motion as m } from "framer-motion";

import { useDashboardStore } from "@/stores/dashboard/dashboardStore";
import useChallengesStore from "@/stores/challengesStore";

const DashboardCTAFooter = () => {
  const { activeTab, setActiveTab } = useDashboardStore();
  const { currentChallenges, pastChallenges } = useChallengesStore();

  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const currentRef = useRef<HTMLButtonElement | null>(null);
  const pastRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const ref = activeTab === "current" ? currentRef.current : pastRef.current;
    if (ref) {
      const { offsetLeft, offsetWidth, offsetHeight } = ref;
      setPosition({
        left: offsetLeft,
        width: offsetWidth,
        height: offsetHeight,
        opacity: 1,
      });
    }
  }, [activeTab]);

  return (
    <section className="dashboard_cta-footer">
      <div className="dashboard_cta-footer_cursor-wrapper">
        <Tab
          tabType="current"
          isActive={activeTab === "current"}
          length={currentChallenges.length}
          onClick={setActiveTab}
          tabRef={currentRef}
        >
          Current Challenges
        </Tab>
        <Tab
          tabType="past"
          isActive={activeTab === "past"}
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
  length: number;
  tabType: "current" | "past";
  tabRef: React.RefObject<HTMLButtonElement | null>;
  onClick: (tabType: "current" | "past") => void;
  isActive: boolean;
}

const Tab = ({
  children,
  length,
  onClick,
  tabType,
  tabRef,
  isActive,
}: TabProps) => {
  return (
    <button
      ref={tabRef}
      onClick={() => onClick(tabType)}
      className={isActive ? "active" : ""}
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
