export const formatCountdownTime = (timeLeft: number): string => {
  if (timeLeft <= 0) {
    return "Expired";
  }

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const getTimeLeft = (deadline: string | Date): number => {
  const now = Date.now();
  const deadlineTime = new Date(deadline).getTime();
  return deadlineTime - now;
};