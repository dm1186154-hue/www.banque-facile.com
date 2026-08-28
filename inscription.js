// =====================================================
// BANQUE FACILE
// SYSTÈME D'INSCRIPTION AVEC FIREBASE AUTHENTICATION
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// =====================================================
// CONFIGURATION FIREBASE
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyCedgq5K2ZR_cvvVnbLvUBKwTjAV_Mnc8U",
    authDomain: "banque-app-66bf9.firebaseapp.com",
    projectId: "banque-app-66bf9",
    storageBucket: "banque-app-66bf9.firebasestorage.app",
    messagingSenderId: "833823730245",
    appId: "1:833823730245:web:8141ce1171c93040f9912c"
};


// =====================================================
// INITIALISATION FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// =====================================================
// FORMULAIRE D'INSCRIPTION
// =====================================================

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");


// Vérification de l'existence du formulaire
if (!registerForm) {
    console.error("Le formulaire #registerForm est introuvable.");
} else {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // =================================================
        // RÉCUPÉRATION DES INFORMATIONS
        // =================================================

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


        // =================================================
        // VALIDATION
        // =================================================

        if (!fullname || !email || !phone || !password || !confirmPassword) {

            showMessage(
                "⚠️ Veuillez remplir tous les champs.",
                "error"
            );

            return;
        }


        // Vérification du mot de passe

        if (password.length < 6) {

            showMessage(
                "⚠️ Le mot de passe doit contenir au moins 6 caractères.",
                "error"
            );

            return;
        }


        // Vérification des mots de passe

        if (password !== confirmPassword) {

            showMessage(
                "❌ Les mots de passe ne correspondent pas.",
                "error"
            );

            return;
        }


        // Vérification du téléphone

        const phoneClean = phone.replace(/\s+/g, "");

        if (!/^[0-9+()-]{8,20}$/.test(phoneClean)) {

            showMessage(
                "⚠️ Veuillez entrer un numéro de téléphone valide.",
                "error"
            );

            return;
        }


        // =================================================
        // MESSAGE DE CHARGEMENT
        // =================================================

        showMessage(
            "⏳ Création de votre compte en cours...",
            "loading"
        );


        const button = registerForm.querySelector(
            'button[type="submit"]'
        );

        if (button) {
            button.disabled = true;
            button.textContent = "Création en cours...";
        }


        try {

            // =================================================
            // CRÉATION DU COMPTE FIREBASE
            // =================================================

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user = userCredential.user;


            // =================================================
            // ENREGISTREMENT DU NOM
            // =================================================

            await updateProfile(user, {
                displayName: fullname
            });


            // =================================================
            // SAUVEGARDE DU NUMÉRO
            // =================================================

            // Firebase Authentication ne stocke pas directement
            // notre champ téléphone dans ce type d'inscription.
            // On le conserve temporairement pour le profil.

            localStorage.setItem(
                "banqueFacilePhone",
                phoneClean
            );


            localStorage.setItem(
                "banqueFacileFullname",
                fullname
            );


            // =================================================
            // SUCCÈS
            // =================================================

            showMessage(
                "✅ Compte créé avec succès ! Redirection...",
                "success"
            );


            // Nettoyage du formulaire

            registerForm.reset();


            // =================================================
            // REDIRECTION
            // =================================================

            setTimeout(function () {

                window.location.href = "tableau_de_bord.html";

            }, 1500);


        } catch (error) {

            console.error(
                "Erreur Firebase :",
                error
            );


            // =================================================
            // GESTION DES ERREURS FIREBASE
            // =================================================

            let message =
                "❌ Une erreur est survenue lors de la création du compte.";


            switch (error.code) {

                case "auth/email-already-in-use":

                    message =
                        "❌ Cette adresse e-mail est déjà utilisée.";

                    break;


                case "auth/invalid-email":

                    message =
                        "❌ L'adresse e-mail n'est pas valide.";

                    break;


                case "auth/weak-password":

                    message =
                        "❌ Le mot de passe est trop faible.";

                    break;


                case "auth/network-request-failed":

                    message =
                        "❌ Problème de connexion Internet.";

                    break;


                case "auth/operation-not-allowed":

                    message =
                        "❌ L'inscription par e-mail n'est pas activée dans Firebase.";

                    break;


                default:

                    message =
                        "❌ Erreur : " +
                        (error.message || "veuillez réessayer.");

                    break;
            }


            showMessage(
                message,
                "error"
            );


            if (button) {

                button.disabled = false;
                button.textContent = "Créer mon compte";

            }
        }

    });
}


// =====================================================
// AFFICHAGE DES MESSAGES
// =====================================================

function showMessage(message, type) {

    if (!registerMessage) {
        return;
    }


    registerMessage.textContent = message;

    registerMessage.className =
        "form-message " + type;

}
