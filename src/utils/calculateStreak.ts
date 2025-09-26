import type { Challenge } from "@/stores/challengesStore";

export const calculateCurrentStreak = (challenges: Challenge[]): number => {
  // Filter completed challenges and sort by completion date (newest first)
  const completedChallenges = challenges
    .filter(challenge => challenge.completed_at && challenge.is_completed)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

  if (completedChallenges.length === 0) {
    return 0;
  }

  // Group challenges by completion date
  const challengesByDate = new Map<string, Challenge[]>();
  
  completedChallenges.forEach(challenge => {
    const dateKey = new Date(challenge.completed_at).toDateString();
    if (!challengesByDate.has(dateKey)) {
      challengesByDate.set(dateKey, []);
    }
    challengesByDate.get(dateKey)!.push(challenge);
  });

  const completionDates = Array.from(challengesByDate.keys())
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => b.getTime() - a.getTime()); // Sort newest first

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if there's activity today or yesterday to start the streak
  if (completionDates.length > 0) {
    const mostRecentDate = new Date(completionDates[0]);
    mostRecentDate.setHours(0, 0, 0, 0);
    
    // Only start streak if most recent completion was today or yesterday
    if (mostRecentDate.getTime() === today.getTime() || 
        mostRecentDate.getTime() === yesterday.getTime()) {
      
      // Start counting from the most recent date
      const streakDate = new Date(mostRecentDate);
      
      // Count backwards checking for consecutive days
      for (const completionDate of completionDates) {
        const normalizedDate = new Date(completionDate);
        normalizedDate.setHours(0, 0, 0, 0);
        
        if (normalizedDate.getTime() === streakDate.getTime()) {
          currentStreak++;
          streakDate.setDate(streakDate.getDate() - 1); // Move to previous day
        } else if (normalizedDate.getTime() < streakDate.getTime()) {
          // There's a gap in the streak, stop counting
          break;
        }
      }
    }
  }

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

  // Group challenges by completion date
  const challengesByDate = new Map<string, Challenge[]>();

  completedChallenges.forEach(challenge => {
    const dateKey = new Date(challenge.completed_at).toDateString();
    if (!challengesByDate.has(dateKey)) {
      challengesByDate.set(dateKey, []);
    }
    challengesByDate.get(dateKey)!.push(challenge);
  });

  const completionDates = Array.from(challengesByDate.keys())
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => a.getTime() - b.getTime()); // Sort oldest first

  // Calculate longest streak by checking all possible streaks
  let longestStreak = 0;
  let currentStreakLength = 0;
  let expectedDate: Date | null = null;

  for (const completionDate of completionDates) {
    const normalizedDate = new Date(completionDate);
    normalizedDate.setHours(0, 0, 0, 0);

    if (expectedDate === null) {
      // First date, start a new streak
      currentStreakLength = 1;
      expectedDate = new Date(normalizedDate);
      expectedDate.setDate(expectedDate.getDate() + 1);
    } else if (normalizedDate.getTime() === expectedDate.getTime()) {
      // Consecutive day, continue streak
      currentStreakLength++;
      expectedDate.setDate(expectedDate.getDate() + 1);
    } else {
      // Gap found, check if this was the longest streak so far
      longestStreak = Math.max(longestStreak, currentStreakLength);

      // Start new streak from current date
      currentStreakLength = 1;
      expectedDate = new Date(normalizedDate);
      expectedDate.setDate(expectedDate.getDate() + 1);
    }
  }

  // Don't forget to check the final streak
  longestStreak = Math.max(longestStreak, currentStreakLength);

  return longestStreak;
};