-- Friendships table (one row per friendship)
-- user_id = who sent the request
-- friend_id = who received the request
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,

  -- Prevent duplicate requests (Alex can't send Ben two requests)
  UNIQUE(user_id, friend_id),

  -- Can't friend yourself
  CHECK (user_id != friend_id)
);

-- Indexes for fast lookups
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
