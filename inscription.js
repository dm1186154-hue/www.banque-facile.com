import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ==========================================
// CONFIGURATION FIREBASE
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyCedgq5K2ZR_cvvVnbLvUBKwTjAV_Mnc8U",
    authDomain: "banque-app-66bf9.firebaseapp.com",
    projectId: "banque-app-66bf9",
    storageBucket: "banque-app-66bf9.firebasestorage.app",
    messagingSenderId: "833823730245",
    appId: "1:833823730245:web:8141ce1171c93040f9912c"
};


// ==========================================
// INITIALISATION FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// ==========================================
// FORMULAIRE
// ==========================================

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");


// ==========================================
// CREATION DU COMPTE
// ==========================================

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Récupération des données
    const fullname = document
        .getElementById("fullname")
        .value
        .trim();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const phone = document
        .getElementById("phone")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value;


    // ==========================================
    // VERIFICATION DU MOT DE PASSE
    // ==========================================

    if (password !== confirmPassword) {

        registerMessage.textContent =
            "❌ Les mots de passe ne correspondent pas.";

        registerMessage.style.color = "red";

        return;
    }


    if (password.length < 6) {

        registerMessage.textContent =
            "❌ Le mot de passe doit contenir au moins 6 caractères.";

        registerMessage.style.color = "red";

        return;
    }


    // ==========================================
    // MESSAGE DE CHARGEMENT
    // ==========================================

    registerMessage.textContent =
        "Création du compte en cours...";

    registerMessage.style.color = "#0066cc";


    try {

        // ==========================================
        // CREATION UTILISATEUR FIREBASE
        // ==========================================

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = userCredential.user;


        // ==========================================
        // AJOUT DU NOM
        // ==========================================

        await updateProfile(user, {
            displayName: fullname
        });


        // ==========================================
        // ENREGISTREMENT DES INFORMATIONS
        // DANS FIRESTORE
        // ==========================================

        await setDoc(
            doc(db, "users", user.uid),
            {
                uid: user.uid,
                nomComplet: fullname,
                email: email,
                telephone: phone,
                dateCreation: new Date().toISOString()
            }
        );


        // ==========================================
        // SUCCÈS
        // ==========================================

        registerMessage.textContent =
            "✅ Compte créé avec succès !";

        registerMessage.style.color = "green";


        // Redirection après 2 secondes
        setTimeout(() => {

            window.location.href = "connexion.html";

        }, 2000);


    } catch (error) {

        console.error(
            "Erreur Firebase :",
            error
        );


        // ==========================================
        // MESSAGES D'ERREUR
        // ==========================================

        let message =
            "❌ Une erreur est survenue.";

        if (error.code === "auth/email-already-in-use") {

            message =
                "❌ Cette adresse e-mail est déjà utilisée.";

        } else if (error.code === "auth/invalid-email") {

            message =
                "❌ Adresse e-mail invalide.";

        } else if (error.code === "auth/weak-password") {

            message =
                "❌ Le mot de passe est trop faible.";

        } else if (error.code === "auth/network-request-failed") {

            message =
                "❌ Problème de connexion Internet.";

        }


        registerMessage.textContent = message;

        registerMessage.style.color = "red";
    }

});
