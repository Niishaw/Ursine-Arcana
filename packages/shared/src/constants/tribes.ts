import type { Tribe } from "../types/taxonomy";

/**
 * Tribe display configuration
 */
export interface TribeOption {
  value: Tribe;
  label: string;
  description: string;
}

/**
 * All available tribe options (Grindr-style with furry additions)
 * Requires POPIA special consent
 */
export const TRIBE_OPTIONS: TribeOption[] = [
  // Standard Grindr tribes
  { value: "bear", label: "Bear", description: "Larger, hairy men" },
  { value: "twink", label: "Twink", description: "Young, slim, smooth" },
  { value: "jock", label: "Jock", description: "Athletic, sporty" },
  { value: "otter", label: "Otter", description: "Slim, hairy" },
  { value: "daddy", label: "Daddy", description: "Mature, experienced" },
  {
    value: "clean_cut",
    label: "Clean-Cut",
    description: "Well-groomed, professional",
  },
  { value: "geek", label: "Geek", description: "Nerdy, intellectual" },
  { value: "leather", label: "Leather", description: "Leather community" },
  { value: "rugged", label: "Rugged", description: "Outdoorsy, masculine" },
  { value: "poz", label: "Poz", description: "HIV positive" },
  { value: "trans", label: "Trans", description: "Transgender" },
  { value: "discreet", label: "Discreet", description: "Private, low-key" },

  // Furry/pup-play specific
  { value: "pup", label: "Pup", description: "Pup play enthusiast" },
  { value: "handler", label: "Handler", description: "Pup handler / trainer" },
  {
    value: "fursuiter",
    label: "Fursuiter",
    description: "Owns/wears fursuits",
  },
];

/**
 * Get display label for a tribe value
 */
export function getTribeLabel(value: Tribe): string {
  const option = TRIBE_OPTIONS.find((t) => t.value === value);
  return option?.label ?? value;
}

/**
 * Maximum number of tribes a user can select
 */
export const MAX_TRIBES_SELECTION = 5;
