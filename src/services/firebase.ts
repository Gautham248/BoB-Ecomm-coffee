import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA28hADmQrb8QhZ1Pkz3AMFWP1t_brPk0U',
  authDomain: 'beansofbodhi-b45f9.firebaseapp.com',
  projectId: 'beansofbodhi-b45f9',
  storageBucket: 'beansofbodhi-b45f9.firebasestorage.app',
  messagingSenderId: '461193596822',
  appId: '1:461193596822:web:6b7651f7d6b503cc8917b7',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

let authPromise: Promise<void> | null = null;

function ensureAuth(): Promise<void> {
  if (!authPromise) {
    authPromise = signInAnonymously(auth).catch((err) => {
      console.warn('Firebase anonymous auth failed:', err.message);
      authPromise = null;
    });
  }
  return authPromise;
}

if (import.meta.env.DEV && import.meta.env.VITE_FIRESTORE_EMULATOR) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { db, ensureAuth };
export default app;

