// ===============================
// BANQUE FACILE - FIREBASE
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ===============================
// CONFIGURATION FIREBASE
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyCedgq5K2ZR_cvvVnbLvUBKwTjAV_Mnc8U",
  authDomain: "banque-app-66bf9.firebaseapp.com",
  projectId: "banque-app-66bf9",
  storageBucket: "banque-app-66bf9.firebasestorage.app",
  messagingSenderId: "833823730245",
  appId: "1:833823730245:web:8141ce1171c93040f9912c"
};


// ===============================
// INITIALISATION
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// ===============================
// EXPORT
// ===============================

export {
  app,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  doc,
  setDoc,
  getDoc
};
