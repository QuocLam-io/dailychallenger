import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from "date-fns";

export function getDeadlineDisplay(deadline: Date | undefined) {
  if (!deadline) return "";

  const today = new Date();
  const daysDiff = differenceInDays(deadline, today);

  if (daysDiff === 0) {
    return "";
  }

  if (daysDiff < 7) {
    return `${daysDiff} day${daysDiff !== 1 ? "s" : ""}`;
  }

  if (daysDiff % 7 === 0) {
    const weeks = differenceInWeeks(deadline, today);
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  }

  if (daysDiff >= 45) {
    const months = differenceInMonths(deadline, today);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }

  return `${daysDiff} day${daysDiff !== 1 ? "s" : ""}`;
}