export type FriendUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

export type Friendship = {
  id: string;
  user_id: string;
  friend_id: string;
  status: "pending" | "accepted";
  created_at: string;
  accepted_at: string | null;
};

export type FriendChallenge = {
  id: string;
  challenge_id: string;
  user_id: string;
  title: string;
  emoji: string;
  deadline: string;
  is_completed: boolean;
  is_failed: boolean;
  friend_first_name: string | null;
  friend_last_name: string | null;
  friend_avatar_url: string | null;
};

export type Cheer = {
  id: string;
  challenge_log_id: string;
  user_id: string;
  created_at: string;
};

export type ReceivedCheer = {
  id: string;
  challenge_log_id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type ChallengeInvite = {
  id: string;
  challenge_id: string;
  inviter_id: string;
  invitee_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
};
