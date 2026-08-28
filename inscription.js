// ======================================================
// BANQUE FACILE
// SYSTÈME D'INSCRIPTION FIREBASE
// ======================================================

// Firebase
import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// ======================================================
// CONFIGURATION FIREBASE
// ======================================================

const firebaseConfig = {

    apiKey: "AIzaSyCedgq5K2ZR_cvvVnbLvUBKwTjAV_Mnc8U",

    authDomain: "banque-app-66bf9.firebaseapp.com",

    projectId: "banque-app-66bf9",

    storageBucket: "banque-app-66bf9.firebasestorage.app",

    messagingSenderId: "833823730245",

    appId: "1:833823730245:web:8141ce1171c93040f9912c"
};


// ======================================================
// INITIALISATION FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// ======================================================
// ELEMENTS HTML
// ======================================================

const form = document.getElementById("registerForm");

const fullnameInput =
    document.getElementById("fullname");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const button =
    document.getElementById("registerButton");

const message =
    document.getElementById("registerMessage");


// ======================================================
// AFFICHER UN MESSAGE
// ======================================================

function showMessage(text, type) {

    message.textContent = text;

    message.className = "message " + type;
}


// ======================================================
// VALIDATION DU FORMULAIRE
// ======================================================

form.addEventListener("submit", async function(event) {

    event.preventDefault();


    // --------------------------------------------------
    // RECUPERATION DES VALEURS
    // --------------------------------------------------

    const fullname =
        fullnameInput.value.trim();

    const email =
        emailInput.value.trim();

    const phone =
        phoneInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    // --------------------------------------------------
    // VALIDATION NOM
    // --------------------------------------------------

    if (fullname.length < 2) {

        showMessage(
            "Veuillez entrer votre nom complet.",
            "error"
        );

        return;
    }


    // --------------------------------------------------
    // VALIDATION TELEPHONE
    // --------------------------------------------------

    if (phone.length < 8) {

        showMessage(
            "Veuillez entrer un numéro de téléphone valide.",
            "error"
        );

        return;
    }


    // --------------------------------------------------
    // VALIDATION MOT DE PASSE
    // --------------------------------------------------

    if (password.length < 6) {

        showMessage(
            "Le mot de passe doit contenir au moins 6 caractères.",
            "error"
        );

        return;
    }


    // --------------------------------------------------
    // CONFIRMATION MOT DE PASSE
    // --------------------------------------------------

    if (password !== confirmPassword) {

        showMessage(
            "Les deux mots de passe ne correspondent pas.",
            "error"
        );

        return;
    }


    // --------------------------------------------------
    // DESACTIVER LE BOUTON
    // --------------------------------------------------

    button.disabled = true;

    button.textContent =
        "Création du compte...";

    showMessage(
        "Création de votre compte en cours...",
        "success"
    );


    try {

        // ==================================================
        // CREATION DU COMPTE FIREBASE
        // ==================================================

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        // ==================================================
        // ENREGISTRER LE NOM DANS FIREBASE AUTH
        // ==================================================

        await updateProfile(user, {

            displayName: fullname

        });


        // ==================================================
        // SAUVEGARDER LES INFORMATIONS LOCALEMENT
        // ==================================================

        localStorage.setItem(
            "banqueFacile_fullname",
            fullname
        );

        localStorage.setItem(
            "banqueFacile_phone",
            phone
        );

        localStorage.setItem(
            "banqueFacile_email",
            email
        );


        // ==================================================
        // MESSAGE DE SUCCES
        // ==================================================

        showMessage(
            "✅ Compte créé avec succès ! Redirection...",
            "success"
        );


        // ==================================================
        // REDIRECTION
        // ==================================================

        setTimeout(function() {

            window.location.href =
                "tableau_de_bord.html";

        }, 1500);


    } catch (error) {

        console.error(
            "Erreur Firebase :",
            error
        );


        // ==================================================
        // MESSAGES D'ERREUR
        // ==================================================

        let errorMessage =
            "Une erreur est survenue. Veuillez réessayer.";


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            errorMessage =
                "❌ Cette adresse e-mail possède déjà un compte.";

        }


        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            errorMessage =
                "❌ Adresse e-mail invalide.";

        }


        else if (
            error.code ===
            "auth/weak-password"
        ) {

            errorMessage =
                "❌ Le mot de passe est trop faible.";

        }


        else if (
            error.code ===
            "auth/network-request-failed"
        ) {

            errorMessage =
                "❌ Problème de connexion Internet.";

        }


        else if (
            error.code ===
            "auth/operation-not-allowed"
        ) {

            errorMessage =
                "❌ La connexion par e-mail n'est pas activée dans Firebase.";

        }


        showMessage(
            errorMessage,
            "error"
        );


        // --------------------------------------------------
        // REACTIVER LE BOUTON
        // --------------------------------------------------

        button.disabled = false;

        button.textContent =
            "Créer mon compte";
    }

});


// ======================================================
// AFFICHER / CACHER LE MOT DE PASSE
// ======================================================

window.togglePassword = function(
    inputId,
    element
) {

    const input =
        document.getElementById(inputId);


    if (input.type === "password") {

        input.type = "text";

        element.textContent = "🙈";

    } else {

        input.type = "password";

        element.textContent = "👁️";
    }

};
