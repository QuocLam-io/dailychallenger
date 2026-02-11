import { describe, it, expect } from "vitest";
import { calculateCurrentStreak } from "@/utils/calculateStreak";
import type { Challenge } from "@/types";

describe("calculateCurrentStreak", () => {
  it("should return 0 for empty array", () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it("should return 0 when no completed challenges", () => {
    const challenges: Challenge[] = [
      {
        id: "1",
        challenge_id: "challenge-1",
        title: "Test Challenge",
        is_completed: false,
        completed_at: "",
        created_at: "2024-01-01T00:00:00Z",
        deadline: "2024-01-02T00:00:00Z",
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
    ];
    expect(calculateCurrentStreak(challenges)).toBe(0);
  });

  it("should calculate current streak for consecutive days", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    const challenges: Challenge[] = [
      {
        id: "1",
        challenge_id: "challenge-1",
        title: "Challenge 1",
        is_completed: true,
        completed_at: today.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: today.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
      {
        id: "2",
        challenge_id: "challenge-2",
        title: "Challenge 2",
        is_completed: true,
        completed_at: yesterday.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: yesterday.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
      {
        id: "3",
        challenge_id: "challenge-3",
        title: "Challenge 3",
        is_completed: true,
        completed_at: dayBeforeYesterday.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: dayBeforeYesterday.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
    ];

    expect(calculateCurrentStreak(challenges)).toBe(3);
  });

  it("should return 0 when most recent completion is too old", () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const challenges: Challenge[] = [
      {
        id: "1",
        challenge_id: "challenge-1",
        title: "Challenge 1",
        is_completed: true,
        completed_at: threeDaysAgo.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: threeDaysAgo.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
    ];

    expect(calculateCurrentStreak(challenges)).toBe(0);
  });

  it("should break streak when there's a gap", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const challenges: Challenge[] = [
      {
        id: "1",
        challenge_id: "challenge-1",
        title: "Challenge 1",
        is_completed: true,
        completed_at: today.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: today.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
      {
        id: "2",
        challenge_id: "challenge-2",
        title: "Challenge 2",
        is_completed: true,
        completed_at: yesterday.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: yesterday.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
      {
        id: "3",
        challenge_id: "challenge-3",
        title: "Challenge 3",
        is_completed: true,
        completed_at: threeDaysAgo.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: threeDaysAgo.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
    ];

    // Should only count today and yesterday (2 days) because there's a gap
    expect(calculateCurrentStreak(challenges)).toBe(2);
  });

  it("should continue streak when completing a challenge today after having a 2-day streak", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const challenges: Challenge[] = [
      {
        id: "1",
        challenge_id: "challenge-1",
        title: "Challenge 1",
        is_completed: true,
        completed_at: twoDaysAgo.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: twoDaysAgo.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
      {
        id: "2",
        challenge_id: "challenge-2",
        title: "Challenge 2",
        is_completed: true,
        completed_at: yesterday.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: yesterday.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
      {
        id: "3",
        challenge_id: "challenge-3",
        title: "Challenge 3",
        is_completed: true,
        completed_at: today.toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        deadline: today.toISOString(),
        emoji: "🎯",
        failed_at: "",
        is_failed: false,
        is_public: false,
        user_id: "user-1",
        is_dismissed: false,
      },
    ];

    // Should count all 3 consecutive days
    expect(calculateCurrentStreak(challenges)).toBe(3);
  });
});