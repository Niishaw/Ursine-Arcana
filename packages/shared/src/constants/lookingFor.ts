import type { LookingFor } from "../types/taxonomy";

/**
 * Looking For display configuration
 */
export interface LookingForOption {
  value: LookingFor;
  label: string;
  description: string;
}

/**
 * All available "Looking For" options (Grindr-style)
 * Requires POPIA special consent
 */
export const LOOKING_FOR_OPTIONS: LookingForOption[] = [
  { value: "chat", label: "Chat", description: "Just looking to talk" },
  { value: "dates", label: "Dates", description: "Looking for dates" },
  { value: "friends", label: "Friends", description: "Looking for friends" },
  {
    value: "networking",
    label: "Networking",
    description: "Professional connections",
  },
  {
    value: "relationship",
    label: "Relationship",
    description: "Looking for a relationship",
  },
  { value: "hookups", label: "Hookups", description: "Casual encounters" },
];

/**
 * Get display label for a looking for value
 */
export function getLookingForLabel(value: LookingFor): string {
  const option = LOOKING_FOR_OPTIONS.find((l) => l.value === value);
  return option?.label ?? value;
}

/**
 * Maximum number of "Looking For" options a user can select
 */
export const MAX_LOOKING_FOR_SELECTION = 6;
