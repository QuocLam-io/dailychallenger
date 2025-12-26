-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_challenges ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE
-- Users can only read and update their own row
-- ============================================
CREATE POLICY "Users can read own row"
  ON users FOR SELECT
  USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update own row"
  ON users FOR UPDATE
  USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can insert own row"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = clerk_id);

-- ============================================
-- CHALLENGES TABLE
-- Anyone can read challenges (for discovery)
-- Only creator can insert/update/delete
-- ============================================
CREATE POLICY "Anyone can read challenges"
  ON challenges FOR SELECT
  USING (true);

CREATE POLICY "Users can create own challenges"
  ON challenges FOR INSERT
  WITH CHECK (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = created_by
  ));

CREATE POLICY "Users can update own challenges"
  ON challenges FOR UPDATE
  USING (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = created_by
  ));

CREATE POLICY "Users can delete own challenges"
  ON challenges FOR DELETE
  USING (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = created_by
  ));

-- ============================================
-- CHALLENGE_LOGS TABLE
-- Users can only CRUD their own logs
-- ============================================
CREATE POLICY "Users can read own logs"
  ON challenge_logs FOR SELECT
  USING (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can create own logs"
  ON challenge_logs FOR INSERT
  WITH CHECK (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can update own logs"
  ON challenge_logs FOR UPDATE
  USING (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can delete own logs"
  ON challenge_logs FOR DELETE
  USING (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = user_id
  ));

-- ============================================
-- RECURRING_CHALLENGES TABLE
-- Anyone can read (for discovery/joining)
-- Only creator can update/delete
-- Anyone authenticated can create
-- ============================================
CREATE POLICY "Anyone can read recurring challenges"
  ON recurring_challenges FOR SELECT
  USING (true);

CREATE POLICY "Users can create recurring challenges"
  ON recurring_challenges FOR INSERT
  WITH CHECK (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = created_by
  ));

CREATE POLICY "Users can update own recurring challenges"
  ON recurring_challenges FOR UPDATE
  USING (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = created_by
  ));

CREATE POLICY "Users can delete own recurring challenges"
  ON recurring_challenges FOR DELETE
  USING (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = created_by
  ));
