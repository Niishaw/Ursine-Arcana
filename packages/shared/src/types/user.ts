import type { Timestamp, GeoPoint } from "firebase/firestore";
import type { Species, Tribe, LookingFor, Position } from "./taxonomy";

/**
 * User consent tracking for POPIA compliance
 */
export interface UserConsents {
  /** Timestamp when Terms of Service were accepted */
  termsAcceptedAt: Timestamp;
  /** Timestamp when Privacy Policy was accepted */
  privacyAcceptedAt: Timestamp;
  /** Timestamp when special personal info consent was given (null if not given) */
  specialPersonalInfoConsentAt: Timestamp | null;
  /** Timestamp when location consent was given (null if not given) */
  locationConsentAt: Timestamp | null;
  /** Whether user has opted out of analytics */
  analyticsOptOut: boolean;
}

/**
 * User profile visibility settings
 */
export type ProfileVisibility = "public" | "hidden";

/**
 * User account status
 */
export type AccountStatus = "active" | "suspended" | "banned";

/**
 * Core user profile document stored in Firestore
 * Collection: users/{uid}
 */
export interface UserProfile {
  /** Firebase Auth UID */
  uid: string;
  /** User's email address */
  email: string;
  /** User's phone number (optional) */
  phone: string | null;
  /** Display name shown in app */
  displayName: string;
  /** Date of birth for 18+ verification */
  dateOfBirth: Timestamp;
  /** Timestamp when age was verified */
  ageVerifiedAt: Timestamp;

  // Consent tracking (POPIA)
  consents: UserConsents;

  // Basic profile (not special personal info)
  /** User bio / about me text */
  bio: string;
  /** Selected species */
  species: Species;
  /** Custom species name if species === 'other' */
  customSpecies: string | null;
  /** Profile image URL (SFW only) */
  profileImageUrl: string | null;
  /** Gallery image URLs (SFW only) */
  galleryImageUrls: string[];

  // Fields requiring special consent (POPIA Section 26)
  /** Selected tribes/identity labels */
  tribes: Tribe[];
  /** What user is looking for */
  lookingFor: LookingFor[];
  /** Sexual position preference */
  position: Position | null;
  /** Interest and kink tags */
  tags: string[];

  // Location (opt-in)
  /** Whether location sharing is enabled */
  locationEnabled: boolean;
  /** Current location (null if disabled) */
  location: GeoPoint | null;
  /** When location was last updated */
  locationUpdatedAt: Timestamp | null;

  // Privacy settings
  /** Profile visibility in feed */
  profileVisibility: ProfileVisibility;
  /** Whether to show distance to other users */
  showDistance: boolean;
  /** Whether to show online status */
  showOnlineStatus: boolean;

  // Status
  /** Whether user is currently online */
  isOnline: boolean;
  /** Last time user was active */
  lastActiveAt: Timestamp;
  /** Account status */
  accountStatus: AccountStatus;
  /** Account creation timestamp */
  createdAt: Timestamp;
  /** Last profile update timestamp */
  updatedAt: Timestamp;
}

/**
 * Public-facing user profile (excludes sensitive fields)
 */
export interface PublicUserProfile {
  uid: string;
  displayName: string;
  bio: string;
  species: Species;
  customSpecies: string | null;
  profileImageUrl: string | null;
  galleryImageUrls: string[];
  tribes: Tribe[];
  lookingFor: LookingFor[];
  position: Position | null;
  tags: string[];
  isOnline: boolean;
  lastActiveAt: Timestamp;
  /** Distance in meters (calculated server-side) */
  distance: number | null;
}

/**
 * Hidden user relationship
 * Collection: hiddenUsers/{odcId}
 */
export interface HiddenUser {
  /** Composite ID: {userId}_{hiddenUserId} */
  id: string;
  /** User who performed the hide action */
  userId: string;
  /** User who was hidden */
  hiddenUserId: string;
  /** When the hide was created */
  createdAt: Timestamp;
}

/**
 * Block relationship
 * Collection: blocks/{blockId}
 */
export interface Block {
  /** Composite ID: {blockerId}_{blockedId} */
  id: string;
  /** User who performed the block */
  blockerId: string;
  /** User who was blocked */
  blockedId: string;
  /** Optional reason for block */
  reason: string | null;
  /** When the block was created */
  createdAt: Timestamp;
}
