export type User = {
  id: string;
  clerk_id: string;
  first_name: string | null;
  last_name: string | null;
  longest_streak: number;
  role: string | null;
  created_at: string;
};
