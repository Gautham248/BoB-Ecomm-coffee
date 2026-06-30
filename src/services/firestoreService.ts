import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, ensureAuth } from './firebase';
import type { AdminCache } from '../types/admin';
import { validateCache } from './cacheService';

const CACHE_DOC_ID = 'admin_cache';

export async function readFirestoreCache(): Promise<AdminCache | null> {
  try {
    const docRef = doc(db, 'settings', CACHE_DOC_ID);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return validateCache(data);
  } catch (err) {
    console.error('Firestore read error:', err);
    return null;
  }
}

export async function writeFirestoreCache(cache: AdminCache): Promise<void> {
  await ensureAuth();
  validateCache(cache);
  const docRef = doc(db, 'settings', CACHE_DOC_ID);
  try {
    await setDoc(docRef, cache);
  } catch (err) {
    console.error('Firestore writeFirestoreCache failed:', err instanceof Error ? err.message : err, {
      stack: new Error().stack,
      docId: CACHE_DOC_ID,
    });
    throw err;
  }
}

export async function readCollection<T>(collectionName: string): Promise<T[]> {
  const colRef = collection(db, collectionName);
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => d.data() as T);
}

export async function writeCollection<T extends { id: string }>(
  collectionName: string,
  items: T[]
): Promise<void> {
  await ensureAuth();
  const colRef = collection(db, collectionName);
  try {
    if (items.length <= 50) {
      const batch = writeBatch(db);
      for (const item of items) {
        batch.set(doc(colRef, item.id), item as Record<string, unknown>);
      }
      await batch.commit();
    } else {
      for (let i = 0; i < items.length; i += 500) {
        const batch = writeBatch(db);
        const chunk = items.slice(i, i + 500);
        for (const item of chunk) {
          batch.set(doc(colRef, item.id), item as Record<string, unknown>);
        }
        await batch.commit();
      }
    }
  } catch (err) {
    console.error(`Firestore writeCollection(${collectionName}) failed:`, err instanceof Error ? err.message : err, {
      stack: new Error().stack,
      collection: collectionName,
      itemCount: items.length,
    });
    throw err;
  }
}
