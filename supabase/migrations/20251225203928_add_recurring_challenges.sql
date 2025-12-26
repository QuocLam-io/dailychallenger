-- Create recurring_challenges table (the "race registration")
CREATE TABLE IF NOT EXISTS recurring_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add recurring_challenge_id to challenge_logs
ALTER TABLE challenge_logs
ADD COLUMN IF NOT EXISTS recurring_challenge_id UUID REFERENCES recurring_challenges(id) ON DELETE SET NULL;

-- Index for finding all logs in a recurring challenge
CREATE INDEX IF NOT EXISTS idx_challenge_logs_recurring_challenge_id
ON challenge_logs(recurring_challenge_id)
WHERE recurring_challenge_id IS NOT NULL;

-- Index for finding recurring challenges by creator
CREATE INDEX IF NOT EXISTS idx_recurring_challenges_created_by
ON recurring_challenges(created_by);
