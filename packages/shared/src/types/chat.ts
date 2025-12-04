import type { Timestamp } from "firebase/firestore";

/**
 * Message type in chat
 */
export type MessageType = "text" | "image";

/**
 * Chat conversation document
 * Collection: chats/{chatId}
 */
export interface Chat {
  /** Chat document ID */
  id: string;
  /** Array of participant UIDs [uid1, uid2] */
  participants: [string, string];
  /** Preview of last message */
  lastMessage: string;
  /** Timestamp of last message */
  lastMessageAt: Timestamp;
  /** UID of user who sent last message */
  lastMessageSenderId: string;
  /** Unread count per user: { [uid]: count } */
  unreadCount: Record<string, number>;
  /** When chat was created */
  createdAt: Timestamp;
}

/**
 * Individual message in a chat
 * Collection: chats/{chatId}/messages/{messageId}
 */
export interface Message {
  /** Message document ID */
  id: string;
  /** UID of sender */
  senderId: string;
  /** Type of message */
  type: MessageType;
  /** Message content (text or image URL) */
  content: string;
  /** For images: whether moderation has been completed */
  moderationStatus: "pending" | "approved" | "rejected" | null;
  /** When message was read by recipient (null if unread) */
  readAt: Timestamp | null;
  /** When message was sent */
  createdAt: Timestamp;
}

/**
 * Chat list item for UI display
 */
export interface ChatListItem {
  chatId: string;
  /** The other participant's profile */
  otherUser: {
    uid: string;
    displayName: string;
    profileImageUrl: string | null;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageAt: Timestamp;
  unreadCount: number;
  /** Whether current user sent the last message */
  isLastMessageMine: boolean;
}
