/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

interface User {
  id: string;
  displayName: string;
  [key: string]: unknown;
}
admin.initializeApp();

const db = admin.firestore();

export const notifyOnNewMessage = functions.firestore
  .document("groupChat/{messageId}")
  .onCreate(async (snapshot) => {
    const newMessage = snapshot.data();

    if (!newMessage) {
      console.error("No message data found");
      return;
    }

    // Fetch all users from the "users" collection
    try {
      const usersSnapshot = await db.collection("users").get();
      const users: User[] = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName,
        ...doc.data(),
      }));

      users.forEach((user: User) => {
        console.log(
          `Notification sent to ${user.displayName} with id ${user.id}`
        );
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  });
