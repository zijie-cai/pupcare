import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

const fallbackConfig = {
  apiKey: "AIzaSyDIJ1ZjGtr9zrh9VTcOmD_U1PYvjFdlZkk",
  authDomain: "pupcare-b8e30.firebaseapp.com",
  projectId: "pupcare-b8e30",
  storageBucket: "pupcare-b8e30.firebasestorage.app",
  messagingSenderId: "314965954695",
  appId: "1:314965954695:web:21dc7ada8980585da62822",
  measurementId: "G-HTZFBDC32N",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? fallbackConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? fallbackConfig.measurementId,
};

const app = initializeApp(firebaseConfig);

initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});

export const db = getFirestore(app);

export let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}
