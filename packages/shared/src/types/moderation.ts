import type { Timestamp } from "firebase/firestore";

/**
 * Report reason categories
 */
export type ReportReason =
  | "spam"
  | "harassment"
  | "inappropriate_content"
  | "underage"
  | "impersonation"
  | "scam"
  | "other";

/**
 * Report status
 */
export type ReportStatus = "pending" | "reviewed" | "actioned" | "dismissed";

/**
 * User report document
 * Collection: reports/{reportId}
 */
export interface Report {
  /** Report document ID */
  id: string;
  /** UID of user who submitted the report */
  reporterId: string;
  /** UID of user being reported */
  reportedUserId: string;
  /** Category of report */
  reason: ReportReason;
  /** Additional details provided by reporter */
  details: string;
  /** Current status of report */
  status: ReportStatus;
  /** UID of admin who reviewed (null if pending) */
  reviewedBy: string | null;
  /** When report was reviewed (null if pending) */
  reviewedAt: Timestamp | null;
  /** Action taken (e.g., 'warning', 'suspension', 'ban') */
  actionTaken: string | null;
  /** When report was submitted */
  createdAt: Timestamp;
}

/**
 * Moderation queue item type
 */
export type ModerationItemType =
  | "profile_image"
  | "gallery_image"
  | "chat_image";

/**
 * Moderation queue status
 */
export type ModerationStatus = "pending" | "approved" | "rejected";

/**
 * Moderation queue item
 * Collection: moderationQueue/{itemId}
 */
export interface ModerationQueueItem {
  /** Item document ID */
  id: string;
  /** Type of content being moderated */
  type: ModerationItemType;
  /** Reference to the content (storage path or message ID) */
  contentRef: string;
  /** URL of the image */
  imageUrl: string;
  /** UID of user who uploaded */
  userId: string;
  /** Results from automated moderation (Vision API) */
  automatedResult: {
    /** Whether automated check flagged the content */
    flagged: boolean;
    /** Confidence score (0-1) */
    confidence: number;
    /** Categories detected */
    categories: string[];
    /** Raw API response */
    raw: Record<string, unknown>;
  } | null;
  /** Current moderation status */
  status: ModerationStatus;
  /** UID of moderator who reviewed (null if pending) */
  reviewedBy: string | null;
  /** When item was reviewed (null if pending) */
  reviewedAt: Timestamp | null;
  /** Moderator notes */
  notes: string | null;
  /** When item was added to queue */
  createdAt: Timestamp;
}

/**
 * Audit log entry
 * Collection: auditLogs/{logId}
 */
export interface AuditLog {
  /** Log entry ID */
  id: string;
  /** Type of action */
  action:
    | "user_created"
    | "user_suspended"
    | "user_banned"
    | "user_reinstated"
    | "report_reviewed"
    | "content_moderated"
    | "admin_action"
    | "data_export"
    | "data_deletion";
  /** UID of user who performed action (null for system actions) */
  performedBy: string | null;
  /** UID of user affected by action */
  targetUserId: string | null;
  /** Additional details */
  details: Record<string, unknown>;
  /** IP address (for security events) */
  ipAddress: string | null;
  /** When action occurred */
  createdAt: Timestamp;
}
