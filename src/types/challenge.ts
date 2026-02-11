export type Challenge = {
  challenge_id: string;
  completed_at: string;
  created_at: string;
  deadline: string;
  emoji: string;
  failed_at: string;
  id: string;
  is_completed: boolean;
  is_failed: boolean;
  is_public: boolean;
  title: string;
  user_id: string;
  is_dismissed: boolean;
  recurring_challenge_id: string | null;
  start_date: string | null;
};

export type RecurringChallenge = {
  id: string;
  challenge_id: string;
  start_date: string;
  duration_days: number;
  end_date: string | null;
  created_by: string;
  created_at: string;
};

export type RepeatFrequency = "daily" | "weekly" | "monthly" | null;

export function durationDaysToFrequency(days: number): RepeatFrequency {
  if (days === 1) return "daily";
  if (days === 7) return "weekly";
  if (days === 30) return "monthly";
  return null;
}

export function frequencyToDurationDays(freq: RepeatFrequency): number {
  if (freq === "daily") return 1;
  if (freq === "weekly") return 7;
  if (freq === "monthly") return 30;
  return 0;
}
