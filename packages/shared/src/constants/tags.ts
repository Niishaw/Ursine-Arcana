import type { TagCategory } from "../types/taxonomy";

/**
 * Curated tag taxonomy organized by category
 * Categories marked with requiresSpecialConsent: true need POPIA Section 26 consent
 */
export const TAG_TAXONOMY: TagCategory[] = [
  {
    id: "identity",
    name: "Identity",
    requiresSpecialConsent: false,
    tags: [
      "furry",
      "therian",
      "otherkin",
      "artist",
      "fursuiter",
      "writer",
      "musician",
      "gamer",
      "cosplayer",
      "content_creator",
    ],
  },
  {
    id: "interests",
    name: "Interests",
    requiresSpecialConsent: false,
    tags: [
      "conventions",
      "art",
      "music",
      "gaming",
      "outdoors",
      "travel",
      "fitness",
      "photography",
      "movies",
      "anime",
      "crafts",
      "cooking",
      "reading",
      "sports",
    ],
  },
  {
    id: "relationship_style",
    name: "Relationship Style",
    requiresSpecialConsent: true,
    tags: [
      "monogamous",
      "open",
      "polyamorous",
      "exploring",
      "single",
      "partnered",
    ],
  },
  {
    id: "kink_role",
    name: "Kink Role",
    requiresSpecialConsent: true,
    tags: [
      "dominant",
      "submissive",
      "switch",
      "handler",
      "pup",
      "pet",
      "owner",
      "alpha",
      "beta",
      "omega",
      "master",
      "slave",
      "brat",
      "caregiver",
      "little",
    ],
  },
  {
    id: "activities",
    name: "Activities",
    requiresSpecialConsent: true,
    tags: [
      "pup_play",
      "pet_play",
      "leather",
      "rubber",
      "bondage",
      "rope",
      "impact",
      "sensory",
      "wax",
      "electro",
      "wrestling",
      "muscle_worship",
      "feet",
      "tickling",
    ],
  },
  {
    id: "gear",
    name: "Gear",
    requiresSpecialConsent: true,
    tags: [
      "pup_hood",
      "collar",
      "harness",
      "tail",
      "mitts",
      "fursuit",
      "partial_suit",
      "leather_gear",
      "rubber_gear",
      "sports_gear",
      "uniforms",
      "jockstraps",
    ],
  },
];

/**
 * Get all tags that do NOT require special consent
 */
export function getPublicTags(): string[] {
  return TAG_TAXONOMY.filter((cat) => !cat.requiresSpecialConsent).flatMap(
    (cat) => cat.tags,
  );
}

/**
 * Get all tags that require special consent
 */
export function getSpecialConsentTags(): string[] {
  return TAG_TAXONOMY.filter((cat) => cat.requiresSpecialConsent).flatMap(
    (cat) => cat.tags,
  );
}

/**
 * Check if a tag requires special consent
 */
export function tagRequiresSpecialConsent(tag: string): boolean {
  const category = TAG_TAXONOMY.find((cat) => cat.tags.includes(tag));
  return category?.requiresSpecialConsent ?? false;
}

/**
 * Get category for a tag
 */
export function getTagCategory(tag: string): TagCategory | undefined {
  return TAG_TAXONOMY.find((cat) => cat.tags.includes(tag));
}

/**
 * Format tag for display (convert snake_case to Title Case)
 */
export function formatTagLabel(tag: string): string {
  return tag
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Maximum number of tags a user can select
 */
export const MAX_TAGS_SELECTION = 20;
