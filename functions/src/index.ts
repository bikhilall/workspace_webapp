import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Example Cloud Function
export const helloWorld = functions.https.onRequest((request, response) => {
  response.json({message: "Hello from Firebase!"});
});

