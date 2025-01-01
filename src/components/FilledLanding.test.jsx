import React from "react";
import { render, screen } from "@testing-library/react";
import FilledLanding from "./FilledLanding";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";

//Mock Data
const publicChallenge = {
  challenge: "Do 10 pushups",
  expired: false,
  expiresAt: 1700000000000,
  isCompleted: false,
  timeInABottle: null,
  timeLeft: 72139371,
};

const setPublicChallenge = () => {
  console.log("Yay deleted!")
};

describe("Filled Landing Delete Challenge", () => {
  it("deletes the challenge from localStorage", async () => {
    render(
      <FilledLanding
        publicChallenge={publicChallenge}
        setPublicChallenge={setPublicChallenge}
      />
    );
    const deleteButton = screen.getByText("Delete", {
      selector: ".public-challenge-action-btns button p",
    });
    deleteButton.click();
    //Async waits for modal to render
    const yesDeleteButton = await screen.findByText("Yes, Delete");
    yesDeleteButton.click();
    expect(localStorage.getItem("challenges")).toBeNull();
  });
});
