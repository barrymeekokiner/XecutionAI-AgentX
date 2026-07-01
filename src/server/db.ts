import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Admin SDK for server-side operations
// This bypasses Security Rules and allows privileged access
const app = getApps().length === 0 
  ? initializeApp({
      projectId: firebaseConfig.projectId,
    }) 
  : getApps()[0];

// We specify the databaseId from our config
export const dbAdmin = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

console.log(`[Database] Admin SDK initialized for project: ${firebaseConfig.projectId}, database: ${firebaseConfig.firestoreDatabaseId || '(default)'}`);
