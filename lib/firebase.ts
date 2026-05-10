import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, set, update, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

let app: any;
let database: any;
let auth: any;

if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
  } catch (e) {
    console.warn('Firebase init failed:', e);
  }
}

export { app, database, auth, ref, onValue, get, set, update, child };

export const dbRef = (path: string) => ref(database, path);

export async function getFirebaseData(path: string) {
  try {
    const snapshot = await get(dbRef(path));
    return snapshot.val();
  } catch (e) {
    console.error('Error reading from Firebase:', e);
    return null;
  }
}

export async function setFirebaseData(path: string, data: any) {
  try {
    await set(dbRef(path), data);
    return true;
  } catch (e) {
    console.error('Error writing to Firebase:', e);
    return false;
  }
}

export async function updateFirebaseData(path: string, data: any) {
  try {
    await update(dbRef(path), data);
    return true;
  } catch (e) {
    console.error('Error updating Firebase:', e);
    return false;
  }
}

export function subscribeToData(path: string, callback: (data: any) => void) {
  try {
    const unsub = onValue(dbRef(path), (snapshot) => {
      callback(snapshot.val());
    });
    return unsub;
  } catch (e) {
    console.error('Error subscribing to Firebase:', e);
  }
}
