// ============================================
// BANQUE FACILE
// Création de compte
// Firebase Authentication + Firestore
// ============================================

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


// ============================================
// CONFIGURATION FIREBASE
// ============================================

const firebaseConfig = {

    apiKey: "AIzaSyCedgq5K2ZR_cvvVnbLvUBKwTjAV_Mnc8U",

    authDomain:
        "banque-app-66bf9.firebaseapp.com",

    projectId:
        "banque-app-66bf9",

    storageBucket:
        "banque-app-66bf9.firebasestorage.app",

    messagingSenderId:
        "833823730245",

    appId:
        "1:833823730245:web:8141ce1171c93040f9912c"
};


// ============================================
// INITIALISATION
// ============================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


// ============================================
// ELEMENTS HTML
// ============================================

const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");

const registerButton =
    document.getElementById("registerButton");


// ============================================
// INSCRIPTION
// ============================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ====================================
            // RECUPERATION DES DONNEES
            // ====================================

            const fullname =
                document
                    .getElementById("fullname")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            // ====================================
            // VALIDATION NOM
            // ====================================

            if (fullname === "") {

                showMessage(
                    "Veuillez entrer votre nom complet.",
                    "red"
                );

                return;
            }


            // ====================================
            // VALIDATION EMAIL
            // ====================================

            if (email === "") {

                showMessage(
                    "Veuillez entrer votre adresse e-mail.",
                    "red"
                );

                return;
            }


            // ====================================
            // VALIDATION TELEPHONE
            // ====================================

            if (phone === "") {

                showMessage(
                    "Veuillez entrer votre numéro de téléphone.",
                    "red"
                );

                return;
            }


            // ====================================
            // VALIDATION MOT DE PASSE
            // ====================================

            if (password.length < 6) {

                showMessage(
                    "Le mot de passe doit contenir au moins 6 caractères.",
                    "red"
                );

                return;
            }


            // ====================================
            // CONFIRMATION
            // ====================================

            if (password !== confirmPassword) {

                showMessage(
                    "Les mots de passe ne correspondent pas.",
                    "red"
                );

                return;
            }


            // ====================================
            // DESACTIVER LE BOUTON
            // ====================================

            registerButton.disabled = true;

            registerButton.textContent =
                "Création du compte...";


            showMessage(
                "Création de votre compte...",
                "#0d6efd"
            );


            try {

                // ====================================
                // CREATION COMPTE FIREBASE
                // ====================================

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                // ====================================
                // NOM UTILISATEUR FIREBASE
                // ====================================

                await updateProfile(
                    user,
                    {
                        displayName: fullname
                    }
                );


                // ====================================
                // FIRESTORE
                // ====================================

                await setDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    ),
                    {

                        uid: user.uid,

                        nomComplet:
                            fullname,

                        email:
                            email,

                        telephone:
                            phone,

                        dateCreation:
                            new Date().toISOString(),

                        statut:
                            "actif"

                    }
                );


                // ====================================
                // SUCCES
                // ====================================

                showMessage(
                    "Compte créé avec succès !",
                    "green"
                );


                registerButton.textContent =
                    "Compte créé ✓";


                // ====================================
                // REDIRECTION
                // ====================================

                setTimeout(
                    function () {

                        window.location.href =
                            "tableau_de_bord.html";

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Erreur Firebase :",
                    error
                );


                // ====================================
                // MESSAGES D'ERREUR
                // ====================================

                let message =
                    "Une erreur est survenue. Veuillez réessayer.";


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message =
                        "Cette adresse e-mail est déjà utilisée.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "L'adresse e-mail n'est pas valide.";

                }

                else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message =
                        "Le mot de passe est trop faible.";

                }

                else if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    message =
                        "Problème de connexion Internet.";

                }

                else if (
                    error.code ===
                    "auth/operation-not-allowed"
                ) {

                    message =
                        "L'inscription par e-mail n'est pas activée dans Firebase.";

                }


                showMessage(
                    message,
                    "red"
                );


                // Réactiver le bouton

                registerButton.disabled =
                    false;

                registerButton.textContent =
                    "Créer mon compte";

            }

        }
    );

}


// ============================================
// FONCTION MESSAGE
// ============================================

function showMessage(
    message,
    color
) {

    if (!registerMessage) {
        return;
    }

    registerMessage.textContent =
        message;

    registerMessage.style.color =
        color;

}
