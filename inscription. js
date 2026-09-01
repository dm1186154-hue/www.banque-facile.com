// =====================================================
// BANQUE FACILE
// INSCRIPTION - FIREBASE AUTHENTICATION
// =====================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


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
// INITIALISATION
// =====================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// =====================================================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// =====================================================

const registerForm = document.getElementById("registerForm");

const fullNameInput = document.getElementById("fullName");

const emailInput = document.getElementById("email");

const phoneInput = document.getElementById("phone");

const passwordInput = document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const registerButton =
    document.getElementById("registerButton");

const registerMessage =
    document.getElementById("registerMessage");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


// =====================================================
// VÉRIFICATION DES ÉLÉMENTS
// =====================================================

console.log("BANQUE FACILE - inscription.js chargé");

console.log("Formulaire :", registerForm);
console.log("Nom :", fullNameInput);
console.log("Email :", emailInput);
console.log("Téléphone :", phoneInput);
console.log("Mot de passe :", passwordInput);
console.log("Confirmation :", confirmPasswordInput);


// =====================================================
// AFFICHER UN MESSAGE
// =====================================================

function showMessage(message, type) {

    if (!registerMessage) {
        return;
    }

    registerMessage.textContent = message;

    registerMessage.className =
        "form-message " + type;
}


// =====================================================
// AFFICHER / MASQUER LE MOT DE PASSE
// =====================================================

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "🙈";

            togglePassword.setAttribute(
                "aria-label",
                "Masquer le mot de passe"
            );

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "👁️";

            togglePassword.setAttribute(
                "aria-label",
                "Afficher le mot de passe"
            );
        }

    });
}


// =====================================================
// AFFICHER / MASQUER LA CONFIRMATION
// =====================================================

if (toggleConfirmPassword && confirmPasswordInput) {

    toggleConfirmPassword.addEventListener(
        "click",
        function () {

            if (confirmPasswordInput.type === "password") {

                confirmPasswordInput.type = "text";

                toggleConfirmPassword.textContent = "🙈";

                toggleConfirmPassword.setAttribute(
                    "aria-label",
                    "Masquer la confirmation du mot de passe"
                );

            } else {

                confirmPasswordInput.type = "password";

                toggleConfirmPassword.textContent = "👁️";

                toggleConfirmPassword.setAttribute(
                    "aria-label",
                    "Afficher la confirmation du mot de passe"
                );
            }

        }
    );
}


// =====================================================
// INSCRIPTION
// =====================================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log("Formulaire envoyé");


            // -------------------------------------------------
            // RÉCUPÉRATION DES VALEURS
            // -------------------------------------------------

            const fullName =
                fullNameInput.value.trim();

            const email =
                emailInput.value.trim();

            const phone =
                phoneInput.value.trim();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            console.log("Nom :", fullName);
            console.log("Email :", email);
            console.log("Téléphone :", phone);


            // -------------------------------------------------
            // VALIDATION DU NOM
            // -------------------------------------------------

            if (fullName === "") {

                showMessage(
                    "⚠️ Veuillez entrer votre nom complet.",
                    "error"
                );

                fullNameInput.focus();

                return;
            }


            // -------------------------------------------------
            // VALIDATION EMAIL
            // -------------------------------------------------

            if (email === "") {

                showMessage(
                    "⚠️ Veuillez entrer votre adresse e-mail.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            // -------------------------------------------------
            // VALIDATION TÉLÉPHONE
            // -------------------------------------------------

            if (phone === "") {

                showMessage(
                    "⚠️ Veuillez entrer votre numéro de téléphone.",
                    "error"
                );

                phoneInput.focus();

                return;
            }


            // -------------------------------------------------
            // VALIDATION MOT DE PASSE
            // -------------------------------------------------

            if (password.length < 6) {

                showMessage(
                    "⚠️ Le mot de passe doit contenir au moins 6 caractères.",
                    "error"
                );

                passwordInput.focus();

                return;
            }


            // -------------------------------------------------
            // CONFIRMATION MOT DE PASSE
            // -------------------------------------------------

            if (password !== confirmPassword) {

                showMessage(
                    "⚠️ Les deux mots de passe ne correspondent pas.",
                    "error"
                );

                confirmPasswordInput.focus();

                return;
            }


            // -------------------------------------------------
            // CHARGEMENT
            // -------------------------------------------------

            registerButton.disabled = true;

            registerButton.textContent =
                "Création du compte...";

            showMessage(
                "⏳ Création de votre compte Banque Facile...",
                "loading"
            );


            try {

                // =============================================
                // CRÉATION DU COMPTE FIREBASE
                // =============================================

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                const user =
                    userCredential.user;


                // =============================================
                // ENREGISTREMENT DU NOM
                // =============================================

                await updateProfile(user, {
                    displayName: fullName
                });


                // =============================================
                // SAUVEGARDE LOCALE
                // =============================================

                localStorage.setItem(
                    "banqueFacileFullname",
                    fullName
                );

                localStorage.setItem(
                    "banqueFacileEmail",
                    email
                );

                localStorage.setItem(
                    "banqueFacilePhone",
                    phone
                );


                // =============================================
                // SUCCÈS
                // =============================================

                showMessage(
                    "✅ Compte créé avec succès ! Redirection...",
                    "success"
                );


                registerButton.textContent =
                    "Compte créé ✓";


                // =============================================
                // REDIRECTION
                // =============================================

                setTimeout(function () {

                    window.location.href =
                        "tableau_de_bord.html";

                }, 1500);


            } catch (error) {

                console.error(
                    "Erreur Firebase :",
                    error
                );


                let message =
                    "❌ Une erreur est survenue pendant l'inscription.";


                // =============================================
                // ERREURS FIREBASE
                // =============================================

                switch (error.code) {

                    case "auth/email-already-in-use":

                        message =
                            "❌ Cette adresse e-mail possède déjà un compte.";

                        break;


                    case "auth/invalid-email":

                        message =
                            "❌ Cette adresse e-mail n'est pas valide.";

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


                    case "auth/too-many-requests":

                        message =
                            "⚠️ Trop de tentatives. Réessayez plus tard.";

                        break;


                    default:

                        message =
                            "❌ " +
                            (error.message ||
                            "Impossible de créer le compte.");

                        break;
                }


                showMessage(
                    message,
                    "error"
                );


                // -------------------------------------------------
                // RÉACTIVER LE BOUTON
                // -------------------------------------------------

                registerButton.disabled = false;

                registerButton.textContent =
                    "Créer mon compte";

            }

        }
    );

} else {

    console.error(
        "ERREUR : #registerForm est introuvable."
    );
}
