/**
 * Firebase Initialization
 *
 * Replace the placeholder values below with your actual Firebase config
 * when you're ready to connect to a real backend.
 *
 * To get these values:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Project Settings → Your Apps → Add Web App
 * 4. Copy the firebaseConfig object values here
 */

// ─── Mock Firebase Config (replace when ready) ────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "REPLACE_ME",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "REPLACE_ME",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "REPLACE_ME",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "REPLACE_ME",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "REPLACE_ME",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "REPLACE_ME",
};

// ─── Lazy Firebase Initialization ─────────────────────────────────────────────
// We use a lazy pattern so the app works even without Firebase configured.
// Once you provide real credentials, all Firebase functionality will work.

let _app: import("firebase/app").FirebaseApp | null = null;
let _auth: import("firebase/auth").Auth | null = null;
let _db: import("firebase/firestore").Firestore | null = null;
let _storage: import("firebase/storage").FirebaseStorage | null = null;
let _initialized = false;

async function initFirebase() {
  if (_initialized) return { app: _app, auth: _auth, db: _db, storage: _storage };
  
  const isConfigured = Object.values(firebaseConfig).every(
    (v) => v !== "REPLACE_ME" && v !== ""
  );

  if (!isConfigured) {
    console.warn(
      "[Firebase] Not configured. Using mock data. Provide VITE_FIREBASE_* env vars to enable."
    );
    _initialized = true;
    return { app: null, auth: null, db: null, storage: null };
  }

  try {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");
    const { getFirestore } = await import("firebase/firestore");
    const { getStorage } = await import("firebase/storage");

    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    _auth = getAuth(_app);
    _db = getFirestore(_app);
    _storage = getStorage(_app);
    _initialized = true;
    console.log("[Firebase] Initialized successfully.");
  } catch (err) {
    console.error("[Firebase] Initialization failed:", err);
  }

  return { app: _app, auth: _auth, db: _db, storage: _storage };
}

export { initFirebase };

// ─── Auth helpers ──────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { auth } = await initFirebase();
  if (!auth) throw new Error("Firebase not configured");
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  const { auth } = await initFirebase();
  if (!auth) return;
  const { signOut: fbSignOut } = await import("firebase/auth");
  return fbSignOut(auth);
}

export async function onAuthChange(
  callback: (user: import("firebase/auth").User | null) => void
) {
  const { auth } = await initFirebase();
  if (!auth) {
    callback(null);
    return () => {};
  }
  const { onAuthStateChanged } = await import("firebase/auth");
  return onAuthStateChanged(auth, callback);
}

// ─── Firestore helpers ─────────────────────────────────────────────────────────
export async function getCollection(collectionName: string) {
  const { db } = await initFirebase();
  if (!db) return null;
  const { collection, getDocs, query, orderBy } = await import(
    "firebase/firestore"
  );
  const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function addDocument(collectionName: string, data: object) {
  const { db } = await initFirebase();
  if (!db) throw new Error("Firebase not configured");
  const { collection, addDoc, serverTimestamp } = await import(
    "firebase/firestore"
  );
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: object
) {
  const { db } = await initFirebase();
  if (!db) throw new Error("Firebase not configured");
  const { doc, updateDoc } = await import("firebase/firestore");
  return updateDoc(doc(db, collectionName, docId), data);
}

export async function deleteDocument(collectionName: string, docId: string) {
  const { db } = await initFirebase();
  if (!db) throw new Error("Firebase not configured");
  const { doc, deleteDoc } = await import("firebase/firestore");
  return deleteDoc(doc(db, collectionName, docId));
}
