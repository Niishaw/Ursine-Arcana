import type { Species } from '../types/taxonomy';

/**
 * Species display configuration
 */
export interface SpeciesOption {
  value: Species;
  label: string;
  category: string;
}

/**
 * All available species options with display labels
 * Derived from Furscience and WikiFur community data
 */
export const SPECIES_OPTIONS: SpeciesOption[] = [
  // Canines
  { value: 'wolf', label: 'Wolf', category: 'Canines' },
  { value: 'fox', label: 'Fox', category: 'Canines' },
  { value: 'dog_husky', label: 'Dog (Husky)', category: 'Canines' },
  { value: 'dog_generic', label: 'Dog (Generic)', category: 'Canines' },

  // Felines
  { value: 'cat_domestic', label: 'Cat (Domestic)', category: 'Felines' },
  { value: 'big_cat_tiger', label: 'Tiger', category: 'Felines' },
  { value: 'big_cat_lion', label: 'Lion', category: 'Felines' },
  { value: 'big_cat_leopard', label: 'Leopard', category: 'Felines' },
  { value: 'big_cat_snow_leopard', label: 'Snow Leopard', category: 'Felines' },

  // Mythical
  { value: 'dragon', label: 'Dragon', category: 'Mythical' },
  { value: 'gryphon', label: 'Gryphon', category: 'Mythical' },
  { value: 'unicorn', label: 'Unicorn', category: 'Mythical' },
  { value: 'phoenix', label: 'Phoenix', category: 'Mythical' },
  { value: 'sergal', label: 'Sergal', category: 'Mythical' },

  // Mustelids
  { value: 'otter', label: 'Otter', category: 'Mustelids' },
  { value: 'ferret', label: 'Ferret', category: 'Mustelids' },

  // Bears
  { value: 'bear', label: 'Bear', category: 'Bears' },

  // Rodents
  { value: 'rat_mouse', label: 'Rat / Mouse', category: 'Rodents' },
  { value: 'squirrel', label: 'Squirrel', category: 'Rodents' },
  { value: 'rabbit', label: 'Rabbit', category: 'Rodents' },

  // Other Mammals
  { value: 'raccoon', label: 'Raccoon', category: 'Other Mammals' },
  { value: 'deer', label: 'Deer', category: 'Other Mammals' },
  { value: 'horse', label: 'Horse', category: 'Other Mammals' },
  { value: 'hyena', label: 'Hyena', category: 'Other Mammals' },
  { value: 'skunk', label: 'Skunk', category: 'Other Mammals' },
  { value: 'goat', label: 'Goat', category: 'Other Mammals' },
  { value: 'cow', label: 'Cow', category: 'Other Mammals' },
  { value: 'kangaroo', label: 'Kangaroo', category: 'Other Mammals' },
  { value: 'wombat', label: 'Wombat', category: 'Other Mammals' },

  // Aquatic / Reptiles
  { value: 'shark', label: 'Shark', category: 'Aquatic' },
  { value: 'seal', label: 'Seal', category: 'Aquatic' },
  {
    value: 'reptile_serpent',
    label: 'Reptile / Serpent',
    category: 'Reptiles',
  },
  { value: 'lizard', label: 'Lizard', category: 'Reptiles' },

  // Custom
  { value: 'other', label: 'Other / Create your own', category: 'Custom' },
];

/**
 * Get species categories for grouped display
 */
export const SPECIES_CATEGORIES = [
  'Canines',
  'Felines',
  'Mythical',
  'Mustelids',
  'Bears',
  'Rodents',
  'Other Mammals',
  'Aquatic',
  'Reptiles',
  'Custom',
] as const;

/**
 * Get species options grouped by category
 */
export function getSpeciesByCategory(): Record<string, SpeciesOption[]> {
  return SPECIES_OPTIONS.reduce(
    (acc, species) => {
      if (!acc[species.category]) {
        acc[species.category] = [];
      }
      acc[species.category]!.push(species);
      return acc;
    },
    {} as Record<string, SpeciesOption[]>
  );
}

/**
 * Get display label for a species value
 */
export function getSpeciesLabel(value: Species): string {
  const option = SPECIES_OPTIONS.find((s) => s.value === value);
  return option?.label ?? value;
}
