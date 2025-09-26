import { initializeApp } from 'https://www.gstatic.com/firebasejs/14.0.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/14.0.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/14.0.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/14.0.0/firebase-storage.js';

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFS_Ux0rM2-0jJEmcVygu74Mv_XsvDTec",
  authDomain: "wingman-d44e6.firebaseapp.com",
  projectId: "wingman-d44e6",
  storageBucket: "wingman-d44e6.firebasestorage.app",
  messagingSenderId: "154039314019",
  appId: "1:154039314019:web:4a23399d7b87956763ba56"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app, "gs://wingman-d44e6.firebasestorage.app");