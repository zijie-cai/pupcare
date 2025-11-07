import { FirebaseError } from "firebase/app";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const waitlistCollection = "waitlist";

export type WaitlistResult = "created" | "exists";

export const addToWaitlist = async (email: string): Promise<WaitlistResult> => {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    throw new Error("Email required");
  }

  const safeId = trimmedEmail.replace(/[^a-z0-9@._+-]/g, "");
  const waitlistRef = doc(db, waitlistCollection, safeId);

  try {
    await setDoc(
      waitlistRef,
      {
        email: trimmedEmail,
        createdAt: serverTimestamp(),
      },
      { merge: false }
    );

    return "created";
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "permission-denied") {
      return "exists";
    }
    throw error;
  }
};
