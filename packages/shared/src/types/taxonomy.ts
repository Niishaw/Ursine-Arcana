/**
 * Species options for user profiles
 * Derived from Furscience and WikiFur community data
 */
export type Species =
  // Canines
  | "wolf"
  | "fox"
  | "dog_husky"
  | "dog_generic"
  // Felines
  | "cat_domestic"
  | "big_cat_tiger"
  | "big_cat_lion"
  | "big_cat_leopard"
  | "big_cat_snow_leopard"
  // Mythical
  | "dragon"
  | "gryphon"
  | "unicorn"
  | "phoenix"
  | "sergal"
  // Mustelids
  | "otter"
  | "ferret"
  // Bears
  | "bear"
  // Rodents
  | "rat_mouse"
  | "squirrel"
  | "rabbit"
  // Other Mammals
  | "raccoon"
  | "deer"
  | "horse"
  | "hyena"
  | "skunk"
  | "goat"
  | "cow"
  | "kangaroo"
  | "wombat"
  // Aquatic / Reptiles
  | "shark"
  | "seal"
  | "reptile_serpent"
  | "lizard"
  // Custom
  | "other";

/**
 * Tribe / identity labels (Grindr-style with furry additions)
 * Requires POPIA special consent
 */
export type Tribe =
  | "bear"
  | "twink"
  | "jock"
  | "otter"
  | "daddy"
  | "clean_cut"
  | "geek"
  | "leather"
  | "rugged"
  | "poz"
  | "trans"
  | "discreet"
  // Furry/pup-play specific
  | "pup"
  | "handler"
  | "fursuiter";

/**
 * Looking for options (Grindr-style)
 * Requires POPIA special consent
 */
export type LookingFor =
  | "chat"
  | "dates"
  | "friends"
  | "networking"
  | "relationship"
  | "hookups";

/**
 * Sexual position preference (Grindr-style)
 * Requires POPIA special consent
 */
export type Position =
  | "top"
  | "vers_top"
  | "versatile"
  | "vers_bottom"
  | "bottom"
  | "side"
  | "no_response";

/**
 * Tag category definition
 */
export interface TagCategory {
  /** Unique category identifier */
  id: string;
  /** Display name */
  name: string;
  /** Whether this category requires POPIA special consent */
  requiresSpecialConsent: boolean;
  /** Tags in this category */
  tags: string[];
}
