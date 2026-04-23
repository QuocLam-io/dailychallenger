-- Enable RLS on friendships and cheers
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FRIENDSHIPS TABLE
-- Users can read/modify friendships they're part of
-- ============================================
CREATE POLICY "Users can read own friendships"
  ON friendships FOR SELECT
  USING (
    auth.uid()::text IN (
      SELECT clerk_id FROM users WHERE id IN (user_id, friend_id)
    )
  );

CREATE POLICY "Users can send friend requests"
  ON friendships FOR INSERT
  WITH CHECK (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can update friendships they're part of"
  ON friendships FOR UPDATE
  USING (
    auth.uid()::text IN (
      SELECT clerk_id FROM users WHERE id IN (user_id, friend_id)
    )
  );

CREATE POLICY "Users can delete friendships they're part of"
  ON friendships FOR DELETE
  USING (
    auth.uid()::text IN (
      SELECT clerk_id FROM users WHERE id IN (user_id, friend_id)
    )
  );

-- ============================================
-- CHEERS TABLE
-- Anyone can read cheers (for counts/avatars)
-- Only the cheerer can insert/delete their own cheer
-- ============================================
CREATE POLICY "Anyone can read cheers"
  ON cheers FOR SELECT
  USING (true);

CREATE POLICY "Users can create own cheers"
  ON cheers FOR INSERT
  WITH CHECK (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = user_id
  ));

CREATE POLICY "Users can delete own cheers"
  ON cheers FOR DELETE
  USING (auth.uid()::text = (
    SELECT clerk_id FROM users WHERE id = user_id
  ));
