import type { Challenge } from "@/stores/challengesStore";

export const calculateCurrentStreak = (challenges: Challenge[]): number => {
  // Filter completed challenges and sort by completion date (newest first)
  const completedChallenges = challenges
    .filter(challenge => challenge.completed_at && challenge.is_completed)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

  console.log('=== STREAK CALCULATION DEBUG ===');
  console.log('Total challenges:', challenges.length);
  console.log('Completed challenges:', completedChallenges.length);
  console.log('Completed challenge dates:', completedChallenges.map(c => ({
    id: c.id,
    completed_at: c.completed_at,
    date: new Date(c.completed_at).toISOString().split('T')[0]
  })));

  if (completedChallenges.length === 0) {
    return 0;
  }

  // Group challenges by completion date (using local date)
  const challengesByDate = new Map<string, Challenge[]>();

  completedChallenges.forEach(challenge => {
    const date = new Date(challenge.completed_at);
    // Use local date components
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (!challengesByDate.has(dateKey)) {
      challengesByDate.set(dateKey, []);
    }
    challengesByDate.get(dateKey)!.push(challenge);
  });

  const completionDates = Array.from(challengesByDate.keys())
    .map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date;
    })
    .sort((a, b) => b.getTime() - a.getTime()); // Sort newest first

  console.log('Unique completion dates:', completionDates.map(d => d.toISOString().split('T')[0]));

  // Calculate current streak using local dates
  let currentStreak = 0;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  console.log('Today (local):', today.toISOString().split('T')[0]);
  console.log('Yesterday (local):', yesterday.toISOString().split('T')[0]);

  // Check if there's activity today or yesterday to start the streak
  if (completionDates.length > 0) {
    const mostRecentDate = completionDates[0];

    console.log('Most recent completion:', mostRecentDate.toISOString().split('T')[0]);
    console.log('Is today or yesterday?', mostRecentDate.getTime() === today.getTime() || mostRecentDate.getTime() === yesterday.getTime());

    // Only start streak if most recent completion was today or yesterday
    if (mostRecentDate.getTime() === today.getTime() ||
        mostRecentDate.getTime() === yesterday.getTime()) {

      // Start counting from the most recent date
      let streakDate = new Date(mostRecentDate);

      // Count backwards checking for consecutive days
      for (const completionDate of completionDates) {
        console.log(`Checking ${completionDate.toISOString().split('T')[0]} against ${streakDate.toISOString().split('T')[0]}`);

        if (completionDate.getTime() === streakDate.getTime()) {
          currentStreak++;
          console.log(`Match! Streak is now ${currentStreak}`);
          streakDate = new Date(streakDate);
          streakDate.setDate(streakDate.getDate() - 1); // Move to previous day
        } else if (completionDate.getTime() < streakDate.getTime()) {
          // There's a gap in the streak, stop counting
          console.log('Gap found, breaking');
          break;
        }
      }
    }
  }

  console.log('Final streak:', currentStreak);
  console.log('=== END DEBUG ===');

  return currentStreak;
};

export const calculateLongestStreak = (challenges: Challenge[]): number => {
  // Filter completed challenges and sort by completion date (oldest first)
  const completedChallenges = challenges
    .filter(challenge => challenge.completed_at && challenge.is_completed)
    .sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime());

  if (completedChallenges.length === 0) {
    return 0;
  }

  // Group challenges by completion date (using local date)
  const challengesByDate = new Map<string, Challenge[]>();

  completedChallenges.forEach(challenge => {
    const date = new Date(challenge.completed_at);
    // Use local date components
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (!challengesByDate.has(dateKey)) {
      challengesByDate.set(dateKey, []);
    }
    challengesByDate.get(dateKey)!.push(challenge);
  });

  const completionDates = Array.from(challengesByDate.keys())
    .map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date;
    })
    .sort((a, b) => a.getTime() - b.getTime()); // Sort oldest first

  // Calculate longest streak by checking all possible streaks
  let longestStreak = 0;
  let currentStreakLength = 0;
  let expectedDate: Date | null = null;

  for (const completionDate of completionDates) {
    if (expectedDate === null) {
      // First date, start a new streak
      currentStreakLength = 1;
      expectedDate = new Date(completionDate);
      expectedDate.setDate(expectedDate.getDate() + 1);
    } else if (completionDate.getTime() === expectedDate.getTime()) {
      // Consecutive day, continue streak
      currentStreakLength++;
      expectedDate.setDate(expectedDate.getDate() + 1);
    } else {
      // Gap found, check if this was the longest streak so far
      longestStreak = Math.max(longestStreak, currentStreakLength);

      // Start new streak from current date
      currentStreakLength = 1;
      expectedDate = new Date(completionDate);
      expectedDate.setDate(expectedDate.getDate() + 1);
    }
  }

  // Don't forget to check the final streak
  longestStreak = Math.max(longestStreak, currentStreakLength);

  return longestStreak;
};