import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const WISHES_COLLECTION = "wishes";

/**
 * Subscribes to all wishes in real time, oldest first.
 * Returns an unsubscribe function — call it on cleanup.
 */
export function subscribeToWishes(onData, onError) {
  if (!db) return () => {};
  const q = query(collection(db, WISHES_COLLECTION), orderBy("createdAt", "asc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const wishes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      onData(wishes);
    },
    onError
  );
}

/**
 * Saves one friend's message, with an optional photo.
 * `photo` should already be a compressed data URL (see lib/compressImage.js)
 * to stay comfortably under Firestore's 1MB-per-document limit. Pass
 * `null`/undefined to send a text-only message with no photo.
 */
export async function submitWish({ name, message, photo }) {
  if (!db) throw new Error("Firebase isn't configured yet.");
  await addDoc(collection(db, WISHES_COLLECTION), {
    name: name.trim().slice(0, 60),
    message: message.trim().slice(0, 500),
    photo: photo || null,
    createdAt: serverTimestamp(),
  });
}

/**
 * Permanently removes one wish. Used by the /admin moderation page.
 */
export async function deleteWish(id) {
  if (!db) throw new Error("Firebase isn't configured yet.");
  await deleteDoc(doc(db, WISHES_COLLECTION, id));
}