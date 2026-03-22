import { create } from "zustand";
import { supabase } from "@/supabase-client";
import type { FriendUser, FriendChallenge, ReceivedCheer } from "@/types";

interface SocialStoreProps {
  friends: FriendUser[];
  friendsChallenges: FriendChallenge[];
  receivedCheers: ReceivedCheer[];
  fetchFriends: (userId: string) => Promise<void>;
  fetchFriendsChallenges: (friendIds: string[]) => Promise<void>;
  fetchReceivedCheers: (challengeLogIds: string[]) => Promise<void>;
  addCheer: (challengeLogId: string, userId: string) => Promise<void>;
  removeCheer: (challengeLogId: string, userId: string) => Promise<void>;
}

const useSocialStore = create<SocialStoreProps>((set, get) => ({
  friends: [],
  friendsChallenges: [],
  receivedCheers: [],

  fetchFriends: async (userId: string) => {
    try {
      const { data: friendships, error: fError } = await supabase
        .from("friendships")
        .select("user_id, friend_id")
        .eq("status", "accepted")
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

      if (fError || !friendships) {
        console.error("Failed to fetch friendships", fError);
        return;
      }

      const friendIds = friendships.map((f) =>
        f.user_id === userId ? f.friend_id : f.user_id
      );

      if (friendIds.length === 0) {
        set({ friends: [] });
        return;
      }

      const { data: users, error: uError } = await supabase
        .from("users")
        .select("id, first_name, last_name, avatar_url")
        .in("id", friendIds);

      if (uError || !users) {
        console.error("Failed to fetch friend users", uError);
        return;
      }

      set({ friends: users });
    } catch (err) {
      console.error("Unexpected error in fetchFriends:", err);
    }
  },

  fetchFriendsChallenges: async (friendIds: string[]) => {
    try {
      if (friendIds.length === 0) {
        set({ friendsChallenges: [] });
        return;
      }

      const now = new Date().toISOString();

      const { data: logs, error: logError } = await supabase
        .from("challenge_logs")
        .select("id, challenge_id, user_id, deadline, is_completed, is_failed, emoji")
        .in("user_id", friendIds)
        .eq("is_completed", false)
        .eq("is_failed", false)
        .gt("deadline", now);

      if (logError || !logs) {
        console.error("Failed to fetch friends' challenge logs", logError);
        return;
      }

      if (logs.length === 0) {
        set({ friendsChallenges: [] });
        return;
      }

      const challengeIds = [...new Set(logs.map((l) => l.challenge_id))];
      const { data: challenges, error: cError } = await supabase
        .from("challenges")
        .select("id, title")
        .in("id", challengeIds);

      if (cError || !challenges) {
        console.error("Failed to fetch challenge titles", cError);
        return;
      }

      const { friends } = get();

      const enriched: FriendChallenge[] = logs.map((log) => {
        const challenge = challenges.find((c) => c.id === log.challenge_id);
        const friend = friends.find((f) => f.id === log.user_id);
        return {
          id: log.id,
          challenge_id: log.challenge_id,
          user_id: log.user_id,
          title: challenge?.title ?? "Untitled",
          emoji: log.emoji ?? "",
          deadline: log.deadline,
          is_completed: log.is_completed,
          is_failed: log.is_failed,
          friend_first_name: friend?.first_name ?? null,
          friend_last_name: friend?.last_name ?? null,
          friend_avatar_url: friend?.avatar_url ?? null,
        };
      });

      set({ friendsChallenges: enriched });
    } catch (err) {
      console.error("Unexpected error in fetchFriendsChallenges:", err);
    }
  },

  fetchReceivedCheers: async (challengeLogIds: string[]) => {
    try {
      if (challengeLogIds.length === 0) {
        set({ receivedCheers: [] });
        return;
      }

      const { data: cheers, error: cheerError } = await supabase
        .from("cheers")
        .select("id, challenge_log_id, user_id, created_at")
        .in("challenge_log_id", challengeLogIds);

      if (cheerError || !cheers) {
        console.error("Failed to fetch received cheers", cheerError);
        return;
      }

      if (cheers.length === 0) {
        set({ receivedCheers: [] });
        return;
      }

      const cheererIds = [...new Set(cheers.map((c) => c.user_id))];
      const { data: users, error: uError } = await supabase
        .from("users")
        .select("id, first_name, last_name, avatar_url")
        .in("id", cheererIds);

      if (uError || !users) {
        console.error("Failed to fetch cheerer users", uError);
        return;
      }

      const enriched: ReceivedCheer[] = cheers.map((cheer) => {
        const user = users.find((u) => u.id === cheer.user_id);
        return {
          ...cheer,
          first_name: user?.first_name ?? null,
          last_name: user?.last_name ?? null,
          avatar_url: user?.avatar_url ?? null,
        };
      });

      set({ receivedCheers: enriched });
    } catch (err) {
      console.error("Unexpected error in fetchReceivedCheers:", err);
    }
  },

  addCheer: async (challengeLogId: string, userId: string) => {
    const { error } = await supabase
      .from("cheers")
      .insert({ challenge_log_id: challengeLogId, user_id: userId });

    if (error) {
      console.error("Failed to add cheer", error);
    }
  },

  removeCheer: async (challengeLogId: string, userId: string) => {
    const { error } = await supabase
      .from("cheers")
      .delete()
      .eq("challenge_log_id", challengeLogId)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to remove cheer", error);
    }
  },
}));

export default useSocialStore;
