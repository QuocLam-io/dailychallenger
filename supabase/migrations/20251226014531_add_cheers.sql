-- Cheers table (one cheer per user per challenge_log)
CREATE TABLE IF NOT EXISTS cheers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_log_id UUID NOT NULL REFERENCES challenge_logs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One cheer per user per challenge_log (can't cheer same thing twice)
  UNIQUE(challenge_log_id, user_id)
);

-- Index for counting cheers on a challenge_log
CREATE INDEX idx_cheers_challenge_log_id ON cheers(challenge_log_id);

-- Index for finding all cheers by a user
CREATE INDEX idx_cheers_user_id ON cheers(user_id);
