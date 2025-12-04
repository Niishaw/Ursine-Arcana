import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Update online status for inactive users
 * Runs every 5 minutes
 */
export const updateOnlineStatus = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Find users who are marked online but haven't been active
    const inactiveUsersQuery = await db
      .collection("users")
      .where("isOnline", "==", true)
      .where("lastActiveAt", "<", fiveMinutesAgo)
      .get();

    if (inactiveUsersQuery.empty) {
      console.log("No inactive users to update");
      return null;
    }

    const batch = db.batch();

    inactiveUsersQuery.docs.forEach((doc) => {
      batch.update(doc.ref, { isOnline: false });
    });

    await batch.commit();

    console.log(`Updated ${inactiveUsersQuery.size} users to offline`);
    return null;
  });

/**
 * Clean up old moderation queue items
 * Runs daily at 3 AM
 */
export const cleanupModerationQueue = functions.pubsub
  .schedule("0 3 * * *")
  .timeZone("UTC")
  .onRun(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Delete reviewed items older than 30 days
    const oldItemsQuery = await db
      .collection("moderationQueue")
      .where("status", "in", ["approved", "rejected"])
      .where("reviewedAt", "<", thirtyDaysAgo)
      .limit(500) // Process in batches
      .get();

    if (oldItemsQuery.empty) {
      console.log("No old moderation items to clean up");
      return null;
    }

    const batch = db.batch();

    oldItemsQuery.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log(`Cleaned up ${oldItemsQuery.size} old moderation items`);
    return null;
  });

/**
 * Delete inactive accounts after 2 years (POPIA compliance)
 * Runs weekly on Sunday at 2 AM
 */
export const deleteInactiveAccounts = functions.pubsub
  .schedule("0 2 * * 0")
  .timeZone("UTC")
  .onRun(async () => {
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);

    // Find inactive accounts
    const inactiveUsersQuery = await db
      .collection("users")
      .where("lastActiveAt", "<", twoYearsAgo)
      .limit(100) // Process in batches
      .get();

    if (inactiveUsersQuery.empty) {
      console.log("No inactive accounts to delete");
      return null;
    }

    console.log(`Found ${inactiveUsersQuery.size} inactive accounts to delete`);

    for (const doc of inactiveUsersQuery.docs) {
      const userId = doc.id;

      try {
        // Delete from Firebase Auth
        await admin.auth().deleteUser(userId);
        console.log(`Deleted user ${userId} from Auth`);

        // Note: The onUserDeleted trigger will handle Firestore cleanup
      } catch (error) {
        console.error(`Error deleting user ${userId}:`, error);
      }
    }

    return null;
  });

/**
 * Generate daily analytics summary
 * Runs daily at 1 AM
 */
export const generateDailyAnalytics = functions.pubsub
  .schedule("0 1 * * *")
  .timeZone("UTC")
  .onRun(async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count new users
    const newUsersQuery = await db
      .collection("users")
      .where("createdAt", ">=", yesterday)
      .where("createdAt", "<", today)
      .get();

    // Count active users
    const activeUsersQuery = await db
      .collection("users")
      .where("lastActiveAt", ">=", yesterday)
      .where("lastActiveAt", "<", today)
      .get();

    // Count new reports
    const newReportsQuery = await db
      .collection("reports")
      .where("createdAt", ">=", yesterday)
      .where("createdAt", "<", today)
      .get();

    // Store analytics
    await db
      .collection("analytics")
      .doc(yesterday.toISOString().split("T")[0])
      .set({
        date: yesterday,
        newUsers: newUsersQuery.size,
        activeUsers: activeUsersQuery.size,
        newReports: newReportsQuery.size,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log(`Analytics for ${yesterday.toISOString().split("T")[0]}:`, {
      newUsers: newUsersQuery.size,
      activeUsers: activeUsersQuery.size,
      newReports: newReportsQuery.size,
    });

    return null;
  });
