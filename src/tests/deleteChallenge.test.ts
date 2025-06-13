import { vi, describe, it, expect } from "vitest";
import { handleDeleteChallenge } from "../utils/deleteChallenge";
import { supabase } from "@/supabase-client";

// Mock Supabase
vi.mock("@/supabase-client", () => ({
  supabase: {
    from: vi.fn(() => ({
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

describe("handleDeleteChallenge", () => {
  const mockFetchChallenges = vi.fn();
  const mockHandleClose = vi.fn();

  //Use before all tests
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes the challenges and calls callbacks on success", async () => {
    await handleDeleteChallenge(
      "challenge-123",
      "user-456",
      mockFetchChallenges,
      mockHandleClose
    );

    expect(supabase.from).toHaveBeenCalledWith("challenge_logs");
    expect(mockHandleClose).toHaveBeenCalled();
    expect(mockFetchChallenges).toHaveBeenCalledWith("user-456");
  });

   it("does not call anything if challengeId is missing", async () => {
    await handleDeleteChallenge(
      "",
      "user-456",
      mockFetchChallenges,
      mockHandleClose
    );

    expect(supabase.from).not.toHaveBeenCalled();
    expect(mockHandleClose).not.toHaveBeenCalled();
    expect(mockFetchChallenges).not.toHaveBeenCalled();
  });

  it("logs an error and does not call close/fetch if deletion fails", async () => {
    const mockConsoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Force error
    (supabase.from as any).mockReturnValueOnce({
      delete: () => ({
        eq: () =>
          Promise.resolve({
            error: { message: "Delete failed" },
          }),
      }),
    });

    await handleDeleteChallenge(
      "challenge-123",
      "user-456",
      mockFetchChallenges,
      mockHandleClose
    );

    expect(mockConsoleError).toHaveBeenCalledWith(
      "CHALLENGE DELETION ERROR:",
      "Delete failed"
    );
    expect(mockHandleClose).not.toHaveBeenCalled();
    expect(mockFetchChallenges).not.toHaveBeenCalled();

    mockConsoleError.mockRestore();
  });
});
