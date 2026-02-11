import React from "react";
import "./Overlay.scss";
import { motion } from "framer-motion";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface OverlayProps {
  children: React.ReactNode;
  customClassName?: string;
  onOverlayClick?: () => void;
}

const Overlay: React.FC<OverlayProps> = ({
  children,
  customClassName,
  onOverlayClick,
}) => {
  // Lock body scroll when overlay is mounted
  useLockBodyScroll();

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking on the overlay itself, not on children
    if (e.target === e.currentTarget && onOverlayClick) {
      onOverlayClick();
    }
  };

  return (
    <motion.div
      className={`overlay-wrapper ${customClassName}`}
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Overlay;
