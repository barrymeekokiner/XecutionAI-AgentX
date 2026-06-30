import { Firestore } from '@google-cloud/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Admin SDK for server-side operations
// This bypasses Security Rules and allows privileged access
export const dbAdmin = new Firestore({
  projectId: firebaseConfig.projectId,
  databaseId: firebaseConfig.firestoreDatabaseId
});
