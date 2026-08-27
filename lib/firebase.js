// ────────────────────────────────────────────────────────────────
// FIREBASE
// This is what lets friends' photos + messages from /photobooth
// show up on Viktor's /wall page — across different phones, not
// just in one browser. It needs a (free) Firebase project.
//
// Setup steps are in the README under "Set up the memory wall
// (Firebase)". Until you add the env vars, isFirebaseConfigured()
// returns false and the wall page shows a friendly setup notice
// instead of crashing.
// ────────────────────────────────────────────────────────────────

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

let app = null;
let dbInstance = null;

if (isFirebaseConfigured()) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
