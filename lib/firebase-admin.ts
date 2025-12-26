
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Check if we are running in a server environment
if (process.env.NODE_ENV !== "development" && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // In production, we might rely on default Google Application Default Credentials
    // if deployed on GCP/Firebase Functions. 
    // On Vercel, we need the service account.
}

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

const app = !getApps().length
    ? initializeApp({
        credential: serviceAccount ? cert(serviceAccount) : undefined,
        // If no service account provided (e.g. dev without env), 
        // it might fail or try default creds.
        // We ensure we handle this gracefully or require the env var.
    })
    : getApp();

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth };
