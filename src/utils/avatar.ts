const AVATAR_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#14b8a6",
  "#06b6d4",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#3b82f6",
];

export function getInitials(
  firstName: string | null,
  lastName: string | null
): string {
  const first = firstName?.charAt(0)?.toUpperCase() ?? "";
  const last = lastName?.charAt(0)?.toUpperCase() ?? "";
  return first + last || "?";
}

export function getAvatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = hash + userId.charCodeAt(i);
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
