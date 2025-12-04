import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Triggered when a new message is created in a chat
 * Updates the chat's lastMessage and sends push notification
 */
export const onMessageCreated = functions.firestore
  .document("chats/{chatId}/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const { chatId } = context.params;
    const message = snapshot.data();

    if (!message) return;

    // Update chat document with last message info
    const chatRef = db.collection("chats").doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      console.error(`Chat ${chatId} not found`);
      return;
    }

    const chat = chatDoc.data();
    if (!chat) return;

    // Find the recipient (the other participant)
    const recipientId = chat.participants.find(
      (p: string) => p !== message.senderId,
    );

    if (!recipientId) return;

    // Update chat with last message
    await chatRef.update({
      lastMessage:
        message.type === "image"
          ? "📷 Photo"
          : message.content.substring(0, 100),
      lastMessageAt: message.createdAt,
      lastMessageSenderId: message.senderId,
      [`unreadCount.${recipientId}`]: admin.firestore.FieldValue.increment(1),
    });

    // Get recipient's FCM token and send push notification
    const recipientDoc = await db.collection("users").doc(recipientId).get();
    const recipient = recipientDoc.data();

    if (!recipient?.fcmToken) {
      console.log(`No FCM token for user ${recipientId}`);
      return;
    }

    // Get sender's display name
    const senderDoc = await db.collection("users").doc(message.senderId).get();
    const sender = senderDoc.data();

    // Send push notification
    try {
      await admin.messaging().send({
        token: recipient.fcmToken,
        notification: {
          title: sender?.displayName || "New message",
          body:
            message.type === "image"
              ? "📷 Sent you a photo"
              : message.content.substring(0, 100),
        },
        data: {
          type: "new_message",
          chatId,
          senderId: message.senderId,
        },
        android: {
          priority: "high",
          notification: {
            channelId: "messages",
            clickAction: "OPEN_CHAT",
          },
        },
        apns: {
          payload: {
            aps: {
              badge: 1,
              sound: "default",
            },
          },
        },
      });
      console.log(`Push notification sent to ${recipientId}`);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  });

/**
 * Triggered when a report is created
 * Notifies moderators
 */
export const onReportCreated = functions.firestore
  .document("reports/{reportId}")
  .onCreate(async (snapshot) => {
    const report = snapshot.data();

    if (!report) return;

    console.log(`New report created: ${snapshot.id}`);

    // TODO: Send notification to moderators
    // This could be an email, Slack message, or push notification
    // depending on your moderation workflow
  });

/**
 * Triggered when a user profile is updated
 * Handles profile image moderation queue
 */
export const onUserProfileUpdated = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    const { userId } = context.params;
    const before = change.before.data();
    const after = change.after.data();

    // Check if profile image was changed
    if (
      before.profileImageUrl !== after.profileImageUrl &&
      after.profileImageUrl
    ) {
      console.log(`Profile image updated for user ${userId}`);

      // Add to moderation queue
      await db.collection("moderationQueue").add({
        type: "profile_image",
        contentRef: `profiles/${userId}`,
        imageUrl: after.profileImageUrl,
        userId,
        automatedResult: null, // Will be filled by moderation function
        status: "pending",
        reviewedBy: null,
        reviewedAt: null,
        notes: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // TODO: Trigger automated moderation (Vision API)
    }
  });
