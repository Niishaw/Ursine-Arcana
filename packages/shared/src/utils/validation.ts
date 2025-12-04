/**
 * Validation utilities for Ursine Arcana
 */

/**
 * Minimum age requirement (18+)
 */
export const MINIMUM_AGE = 18;

/**
 * Maximum length for display name
 */
export const MAX_DISPLAY_NAME_LENGTH = 50;

/**
 * Maximum length for bio
 */
export const MAX_BIO_LENGTH = 500;

/**
 * Maximum length for custom species
 */
export const MAX_CUSTOM_SPECIES_LENGTH = 50;

/**
 * Maximum profile image size in bytes (10MB)
 */
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Allowed image MIME types
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Check if user is at least 18 years old
 */
export function isAdult(dateOfBirth: Date): boolean {
  return calculateAge(dateOfBirth) >= MINIMUM_AGE;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (E.164)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate display name
 */
export function isValidDisplayName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Display name is required" };
  }

  if (name.length > MAX_DISPLAY_NAME_LENGTH) {
    return {
      valid: false,
      error: `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or less`,
    };
  }

  // Check for prohibited characters (basic sanitization)
  const prohibitedChars = /[<>{}[\]\\]/;
  if (prohibitedChars.test(name)) {
    return { valid: false, error: "Display name contains invalid characters" };
  }

  return { valid: true };
}

/**
 * Validate bio text
 */
export function isValidBio(bio: string): { valid: boolean; error?: string } {
  if (bio.length > MAX_BIO_LENGTH) {
    return {
      valid: false,
      error: `Bio must be ${MAX_BIO_LENGTH} characters or less`,
    };
  }

  return { valid: true };
}

/**
 * Validate custom species name
 */
export function isValidCustomSpecies(species: string): {
  valid: boolean;
  error?: string;
} {
  if (!species || species.trim().length === 0) {
    return { valid: false, error: "Custom species name is required" };
  }

  if (species.length > MAX_CUSTOM_SPECIES_LENGTH) {
    return {
      valid: false,
      error: `Custom species must be ${MAX_CUSTOM_SPECIES_LENGTH} characters or less`,
    };
  }

  return { valid: true };
}

/**
 * Validate image file
 */
export function isValidImage(file: { size: number; type: string }): {
  valid: boolean;
  error?: string;
} {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, error: "Image must be 10MB or less" };
  }

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return { valid: false, error: "Image must be JPEG, PNG, or WebP" };
  }

  return { valid: true };
}
