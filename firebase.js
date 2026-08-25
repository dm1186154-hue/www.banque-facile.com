// =====================================================
// BANQUE FACILE
// Configuration Firebase
// =====================================================

// Importations Firebase
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


// Configuration Firebase
// REMPLACER ces valeurs par celles de TON projet Firebase.

const firebaseConfig = {

    apiKey: "VOTRE_API_KEY",

    authDomain:
        "VOTRE_PROJET.firebaseapp.com",

    projectId:
        "VOTRE_PROJECT_ID",

    storageBucket:
        "VOTRE_PROJECT.firebasestorage.app",

    messagingSenderId:
        "VOTRE_MESSAGING_SENDER_ID",

    appId:
        "VOTRE_APP_ID"
};


// Initialisation

const app = initializeApp(firebaseConfig);


// Services

const auth = getAuth(app);

const db = getFirestore(app);


// Export

export {
    app,
    auth,
    db
};
