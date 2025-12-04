/**
 * Formatting utilities for Ursine Arcana
 */

/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted string (e.g., "500m", "2.5km", "10km+")
 */
export function formatDistance(meters: number | null): string {
  if (meters === null) {
    return "Unknown";
  }

  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }

  if (meters < 10000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }

  if (meters < 100000) {
    return `${Math.round(meters / 1000)}km`;
  }

  return "100km+";
}

/**
 * Format relative time for display
 * @param date Date to format
 * @returns Relative time string (e.g., "Just now", "5m ago", "2h ago", "Yesterday")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  // Format as date for older
  return date.toLocaleDateString();
}

/**
 * Format online status for display
 * @param isOnline Whether user is currently online
 * @param lastActiveAt Last active timestamp
 * @returns Status string (e.g., "Online", "Active 5m ago")
 */
export function formatOnlineStatus(
  isOnline: boolean,
  lastActiveAt: Date | null,
): string {
  if (isOnline) {
    return "Online";
  }

  if (!lastActiveAt) {
    return "Offline";
  }

  const relativeTime = formatRelativeTime(lastActiveAt);

  if (relativeTime === "Just now") {
    return "Active just now";
  }

  return `Active ${relativeTime}`;
}

/**
 * Truncate text with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Format message preview for chat list
 * @param content Message content
 * @param type Message type
 * @returns Preview string
 */
export function formatMessagePreview(
  content: string,
  type: "text" | "image",
): string {
  if (type === "image") {
    return "📷 Photo";
  }

  return truncateText(content, 50);
}

/**
 * Capitalize first letter of string
 */
export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert snake_case to Title Case
 */
export function snakeToTitleCase(str: string): string {
  return str
    .split("_")
    .map((word) => capitalizeFirst(word))
    .join(" ");
}
