-- Add end_date to recurring_challenges
-- duration_days = interval between occurrences (1=daily, 7=weekly, 30=monthly)
-- end_date = when to stop creating new occurrences
ALTER TABLE recurring_challenges
ADD COLUMN IF NOT EXISTS end_date DATE;
