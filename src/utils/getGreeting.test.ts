// src/utils/getGreeting.test.ts
import { getGreeting } from "./getGreeting";
import { greetings } from "@/constants/greetings";

describe("getGreeting", () => {
  const RealDate = Date;

  afterEach(() => {
    global.Date = RealDate;
  });

  const mockHour = (hour: number) => {
    global.Date = class extends Date {
      getHours() {
        return hour;
      }
    } as any;
  };

  it("returns a morning greeting before 12pm", () => {
    mockHour(9);
    const greeting = getGreeting(false);
    expect(greetings.mornings).toContain(greeting);
  });

  it("returns a night greeting after 9pm", () => {
    mockHour(22);
    const greeting = getGreeting(false);
    expect(greetings.nights).toContain(greeting);
  });

  it("returns a returning user greeting in afternoon", () => {
    mockHour(15);
    const greeting = getGreeting(false);
    expect(greetings.returningUser).toContain(greeting);
  });

  it("returns a new user greeting in afternoon", () => {
    mockHour(15);
    const greeting = getGreeting(true);
    expect(greetings.newUser).toContain(greeting);
  });
});
