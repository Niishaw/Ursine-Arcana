import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Triggered when a new user is created in Firebase Auth
 * Creates audit log entry
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const { uid, email, phoneNumber } = user;

  console.log(`New user created: ${uid}`);

  // Create audit log
  await db.collection("auditLogs").add({
    action: "user_created",
    performedBy: null, // System action
    targetUserId: uid,
    details: {
      email,
      phoneNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    ipAddress: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

/**
 * Triggered when a user is deleted from Firebase Auth
 * Cleans up user data and creates audit log
 */
export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  const { uid } = user;

  console.log(`User deleted: ${uid}`);

  const batch = db.batch();

  // Delete user profile
  batch.delete(db.collection("users").doc(uid));

  // Delete user's blocks (where they are the blocker)
  const blocksQuery = await db
    .collection("blocks")
    .where("blockerId", "==", uid)
    .get();
  blocksQuery.docs.forEach((doc) => batch.delete(doc.ref));

  // Delete user's hidden users
  const hiddenQuery = await db
    .collection("hiddenUsers")
    .where("userId", "==", uid)
    .get();
  hiddenQuery.docs.forEach((doc) => batch.delete(doc.ref));

  // Commit batch
  await batch.commit();

  // Create audit log
  await db.collection("auditLogs").add({
    action: "data_deletion",
    performedBy: null, // System action
    targetUserId: uid,
    details: {
      reason: "user_deleted",
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    ipAddress: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Cleaned up data for user: ${uid}`);
});
