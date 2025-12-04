import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Get nearby users for the feed
 * Sorted by distance from the requesting user's location
 */
export const getNearbyUsers = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be logged in",
    );
  }

  const userId = context.auth.uid;
  const { latitude, longitude, radiusKm = 50, limit = 20, offset = 0 } = data;

  // Get current user to check blocks
  const currentUserDoc = await db.collection("users").doc(userId).get();
  const currentUser = currentUserDoc.data();

  if (!currentUser) {
    throw new functions.https.HttpsError("not-found", "User not found");
  }

  // Get users blocked by current user
  const blockedByMeQuery = await db
    .collection("blocks")
    .where("blockerId", "==", userId)
    .get();
  const blockedByMe = blockedByMeQuery.docs.map((doc) => doc.data().blockedId);

  // Get users who blocked current user
  const blockedMeQuery = await db
    .collection("blocks")
    .where("blockedId", "==", userId)
    .get();
  const blockedMe = blockedMeQuery.docs.map((doc) => doc.data().blockerId);

  // Get users hidden by current user
  const hiddenQuery = await db
    .collection("hiddenUsers")
    .where("userId", "==", userId)
    .get();
  const hiddenUsers = hiddenQuery.docs.map((doc) => doc.data().hiddenUserId);

  // Combine all excluded users
  const excludedUsers = new Set([
    ...blockedByMe,
    ...blockedMe,
    ...hiddenUsers,
    userId,
  ]);

  // Query users with location enabled
  // Note: For production, use GeoFirestore or similar for efficient geo queries
  const usersQuery = await db
    .collection("users")
    .where("accountStatus", "==", "active")
    .where("profileVisibility", "==", "public")
    .where("locationEnabled", "==", true)
    .orderBy("lastActiveAt", "desc")
    .limit(limit + excludedUsers.size) // Get extra to account for filtered users
    .get();

  // Filter and calculate distances
  const users = usersQuery.docs
    .filter((doc) => !excludedUsers.has(doc.id))
    .map((doc) => {
      const userData = doc.data();
      let distance: number | null = null;

      if (userData.location && latitude && longitude) {
        // Calculate distance using Haversine formula
        distance = calculateDistance(
          latitude,
          longitude,
          userData.location.latitude,
          userData.location.longitude,
        );
      }

      // Return public profile data only
      return {
        uid: doc.id,
        displayName: userData.displayName,
        bio: userData.bio,
        species: userData.species,
        customSpecies: userData.customSpecies,
        profileImageUrl: userData.profileImageUrl,
        galleryImageUrls: userData.galleryImageUrls,
        tribes: currentUser.consents?.specialPersonalInfoConsentAt
          ? userData.tribes
          : [],
        lookingFor: currentUser.consents?.specialPersonalInfoConsentAt
          ? userData.lookingFor
          : [],
        position: currentUser.consents?.specialPersonalInfoConsentAt
          ? userData.position
          : null,
        tags: currentUser.consents?.specialPersonalInfoConsentAt
          ? userData.tags
          : [],
        isOnline: userData.isOnline,
        lastActiveAt: userData.lastActiveAt,
        distance,
      };
    })
    .filter((user) => {
      // Filter by radius if location is available
      if (user.distance !== null && radiusKm) {
        return user.distance <= radiusKm * 1000; // Convert km to meters
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by distance (closest first), then by last active
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return 0;
    })
    .slice(offset, offset + limit);

  return { users };
});

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Block a user
 */
export const blockUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be logged in",
    );
  }

  const blockerId = context.auth.uid;
  const { blockedId, reason } = data;

  if (!blockedId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "blockedId is required",
    );
  }

  if (blockerId === blockedId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Cannot block yourself",
    );
  }

  const blockId = `${blockerId}_${blockedId}`;

  await db
    .collection("blocks")
    .doc(blockId)
    .set({
      id: blockId,
      blockerId,
      blockedId,
      reason: reason || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  return { success: true };
});

/**
 * Unblock a user
 */
export const unblockUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be logged in",
    );
  }

  const blockerId = context.auth.uid;
  const { blockedId } = data;

  if (!blockedId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "blockedId is required",
    );
  }

  const blockId = `${blockerId}_${blockedId}`;

  await db.collection("blocks").doc(blockId).delete();

  return { success: true };
});

/**
 * Report a user
 */
export const reportUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be logged in",
    );
  }

  const reporterId = context.auth.uid;
  const { reportedUserId, reason, details } = data;

  if (!reportedUserId || !reason) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "reportedUserId and reason are required",
    );
  }

  await db.collection("reports").add({
    reporterId,
    reportedUserId,
    reason,
    details: details || "",
    status: "pending",
    reviewedBy: null,
    reviewedAt: null,
    actionTaken: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});
