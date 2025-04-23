import { greetings } from "@/constants/greetings";

export const getGreeting = (isNewUser: boolean) => {
  const hour = new Date().getHours();

  let timeGreeting: string[];

  if (hour < 12) {
    timeGreeting = greetings.mornings;
  } else if (hour >= 21) {
    timeGreeting = greetings.nights;
  } else {
    timeGreeting = isNewUser ? greetings.newUser : greetings.returningUser;
  }

  return timeGreeting[Math.floor(Math.random() * timeGreeting.length)];
};
