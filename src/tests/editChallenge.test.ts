import { editChallengeHandler } from './../utils/editChallenge';
import { vi, describe, it, expect, beforeEach } from "vitest";

// ----------------- Zustand store mocks -----------------
const mockToggleEdit = vi.fn();
const mockSetChallenge = vi.fn();
const mockFetchChallenges = vi.fn();

vi.mock("@/stores/modalsStore", () => ({
  useModalsStore: {
    getState: () => ({
      toggleEditChallengeModalOpen: mockToggleEdit,
    }),
  },
}));

vi.mock("@/stores/challengeDetailsPageStore", () => ({
  useChallengeDetailsPageStore: {
    getState: () => ({
      setChallengeDetailsPageChallenge: mockSetChallenge,
    }),
  },
}));

vi.mock("@/stores/challengesStore", () => ({
  default: {
    getState: () => ({
      fetchChallenges: mockFetchChallenges,
    }),
  },
}));

// ----------------- Supabase mock -----------------
vi.mock("@/supabase-client", () => {
  const mockEq = vi.fn(() => Promise.resolve({ error: null }));

  const mockUpdate = vi.fn(() => ({
    eq: mockEq,
  }));

  const mockInsertSingle = vi.fn();
  const mockInsert = vi.fn(() => ({
    select: vi.fn(() => ({ single: mockInsertSingle })),
  }));

  const mockSelectSingle = vi.fn();
  const mockSelect = vi.fn(() => ({
    eq: vi.fn(() => ({ single: mockSelectSingle })),
  }));

  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
  }));

  // expose internal mocks for test assertions
  return {
    supabase: {
      from: mockFrom,
    },
    __mockHelpers: {
      mockFrom,
      mockSelect,
      mockSelectSingle,
      mockInsert,
      mockInsertSingle,
      mockUpdate,
      mockEq,
    },
  };
});

// ----------------- Test cases -----------------
describe("editChallengeHandler", () => {
  let __mockHelpers: any;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/supabase-client");
    __mockHelpers = mod.__mockHelpers;

    vi.clearAllMocks();
  });

  const supabaseId = "user-123";
  const challenge = "Push-ups";
  const emoji = "💪";
  const challengeDetailsPageChallenge = { id: "log-456" };

  it("updates challenge log if challenge already exists", async () => {
    __mockHelpers.mockSelectSingle.mockResolvedValueOnce({ data: { id: "existing-id" } });
    __mockHelpers.mockEq.mockResolvedValueOnce({ error: null });

    await editChallengeHandler(supabaseId, challenge, emoji, challengeDetailsPageChallenge);

    expect(__mockHelpers.mockFrom).toHaveBeenCalledWith("challenges");
    expect(__mockHelpers.mockEq).toHaveBeenCalledWith("id", "log-456");
    expect(mockSetChallenge).toHaveBeenCalledWith(null);
    expect(mockToggleEdit).toHaveBeenCalled();
    expect(mockFetchChallenges).toHaveBeenCalledWith("user-123");
  });

  it("inserts new challenge if it doesn't exist, then updates challenge log", async () => {
    __mockHelpers.mockSelectSingle.mockResolvedValueOnce({ data: null });

    __mockHelpers.mockInsertSingle.mockResolvedValueOnce({
      data: { id: "new-id" },
      error: null,
    });

    __mockHelpers.mockEq.mockResolvedValueOnce({ error: null });

    await editChallengeHandler(supabaseId, challenge, emoji, challengeDetailsPageChallenge);

    expect(__mockHelpers.mockInsert).toHaveBeenCalled();
    expect(__mockHelpers.mockEq).toHaveBeenCalledWith("id", "log-456");
    expect(mockSetChallenge).toHaveBeenCalledWith(null);
    expect(mockToggleEdit).toHaveBeenCalled();
    expect(mockFetchChallenges).toHaveBeenCalledWith("user-123");
  });

  it("logs error if update fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    __mockHelpers.mockSelectSingle.mockResolvedValueOnce({ data: { id: "existing-id" } });
    __mockHelpers.mockEq.mockResolvedValueOnce({ error: { message: "Update failed" } });

    await editChallengeHandler(supabaseId, challenge, emoji, challengeDetailsPageChallenge);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating challenge log:",
      "Update failed"
    );
    consoleSpy.mockRestore();
  });

  it("logs error if insert fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    __mockHelpers.mockSelectSingle.mockResolvedValueOnce({ data: null });

    __mockHelpers.mockInsertSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "Insert failed" },
    });

    await editChallengeHandler(supabaseId, challenge, emoji, challengeDetailsPageChallenge);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Edit Challenge creation error:",
      "Insert failed"
    );
    consoleSpy.mockRestore();
  });

  it("exits early if required data is missing", async () => {
    await editChallengeHandler("", "", "", { id: "" });

    expect(__mockHelpers.mockFrom).not.toHaveBeenCalled();
    expect(mockToggleEdit).not.toHaveBeenCalled();
    expect(mockSetChallenge).not.toHaveBeenCalled();
    expect(mockFetchChallenges).not.toHaveBeenCalled();
  });
});