import { differenceInDays, differenceInHours, differenceInWeeks, differenceInMonths } from "date-fns";

export function getDeadlineDisplay(deadline: Date | undefined) {
  if (!deadline) return "";

  const now = new Date();
  const daysDiff = differenceInDays(deadline, now);
  const hoursDiff = differenceInHours(deadline, now);

  if (daysDiff === 0) {
    if (hoursDiff > 0) {
      return `${hoursDiff} hour${hoursDiff !== 1 ? "s" : ""}`;
    }
    return ""; // Already expired or today
  }

  if (daysDiff < 7) {
    return `${daysDiff} day${daysDiff !== 1 ? "s" : ""}`;
  }

  if (daysDiff % 7 === 0) {
    const weeks = differenceInWeeks(deadline, now);
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  }

  if (daysDiff >= 45) {
    const months = differenceInMonths(deadline, now);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }

  return `${daysDiff} day${daysDiff !== 1 ? "s" : ""}`;
}