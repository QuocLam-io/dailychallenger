import { useEffect } from "react";

/**
 * Custom hook that locks body scroll when mounted and restores it on unmount.
 * Useful for modals, drawers, and other overlays that should prevent background scrolling.
 * Also handles scrollbar width to prevent layout shift.
 */
export const useLockBodyScroll = () => {
  useEffect(() => {
    // Store original values
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll and add padding to prevent layout shift
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Restore on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);
};
