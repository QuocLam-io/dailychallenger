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

export function getPastChallengeDisplay(completedAt: string | null, failedAt: string | null, deadline: string) {
  const now = new Date();
  
  if (completedAt) {
    const completedDate = new Date(completedAt);
    const daysDiff = Math.abs(differenceInDays(now, completedDate));
    
    if (daysDiff === 0) {
      return { verb: "Finished", rest: " today", status: "completed" };
    } else if (daysDiff === 1) {
      return { verb: "Finished", rest: " 1 day ago", status: "completed" };
    } else {
      return { verb: "Finished", rest: ` ${daysDiff} days ago`, status: "completed" };
    }
  } else if (failedAt) {
    const failedDate = new Date(failedAt);
    const daysDiff = Math.abs(differenceInDays(now, failedDate));
    
    if (daysDiff === 0) {
      return { verb: "Failed", rest: " today", status: "failed" };
    } else if (daysDiff === 1) {
      return { verb: "Failed", rest: " 1 day ago", status: "failed" };
    } else {
      return { verb: "Failed", rest: ` ${daysDiff} days ago`, status: "failed" };
    }
  } else {
    // Challenge is in past but no completion/failure date - check deadline
    const deadlineDate = new Date(deadline);
    const daysDiff = Math.abs(differenceInDays(now, deadlineDate));
    
    if (daysDiff === 0) {
      return { verb: "Due", rest: " today", status: "overdue" };
    } else if (daysDiff === 1) {
      return { verb: "Due", rest: " 1 day ago", status: "overdue" };
    } else {
      return { verb: "Due", rest: ` ${daysDiff} days ago`, status: "overdue" };
    }
  }
}