// =====================================================
// BANQUE FACILE
// CONNEXION AVEC FIREBASE AUTHENTICATION
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
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
// ÉLÉMENTS DE LA PAGE
// =====================================================

const loginForm = document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const loginButton =
    document.getElementById("loginButton");

const togglePassword =
    document.getElementById("togglePassword");

const passwordInput =
    document.getElementById("password");


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
// AFFICHAGE DES MESSAGES
// =====================================================

function showMessage(text, type) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = text;

    loginMessage.className =
        "form-message " + type;
}


// =====================================================
// CONNEXION
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // -------------------------------------------------
            // RÉCUPÉRATION DES DONNÉES
            // -------------------------------------------------

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                passwordInput.value;


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (!email || !password) {

                showMessage(
                    "⚠️ Veuillez remplir tous les champs.",
                    "error"
                );

                return;
            }


            // -------------------------------------------------
            // CHARGEMENT
            // -------------------------------------------------

            if (loginButton) {

                loginButton.disabled = true;

                loginButton.textContent =
                    "Connexion en cours...";

            }


            showMessage(
                "⏳ Connexion à votre espace...",
                "loading"
            );


            try {

                // =============================================
                // CONNEXION FIREBASE
                // =============================================

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                // =============================================
                // SAUVEGARDE DES INFORMATIONS
                // =============================================

                localStorage.setItem(
                    "banqueFacileEmail",
                    user.email || ""
                );


                localStorage.setItem(
                    "banqueFacileFullname",
                    user.displayName || ""
                );


                // =============================================
                // SUCCÈS
                // =============================================

                showMessage(
                    "✅ Connexion réussie ! Redirection...",
                    "success"
                );


                // =============================================
                // REDIRECTION
                // =============================================

                setTimeout(function () {

                    window.location.href =
                        "tableau_de_bord.html";

                }, 1200);


            } catch (error) {

                console.error(
                    "Erreur de connexion Firebase :",
                    error
                );


                // =============================================
                // ERREURS FIREBASE
                // =============================================

                let errorMessage =
                    "❌ Impossible de vous connecter.";


                switch (error.code) {

                    case "auth/invalid-credential":

                        errorMessage =
                            "❌ E-mail ou mot de passe incorrect.";

                        break;


                    case "auth/invalid-email":

                        errorMessage =
                            "❌ L'adresse e-mail n'est pas valide.";

                        break;


                    case "auth/user-not-found":

                        errorMessage =
                            "❌ Aucun compte ne correspond à cette adresse e-mail.";

                        break;


                    case "auth/wrong-password":

                        errorMessage =
                            "❌ Mot de passe incorrect.";

                        break;


                    case "auth/too-many-requests":

                        errorMessage =
                            "⚠️ Trop de tentatives. Réessayez plus tard.";

                        break;


                    case "auth/network-request-failed":

                        errorMessage =
                            "❌ Vérifiez votre connexion Internet.";

                        break;


                    case "auth/user-disabled":

                        errorMessage =
                            "❌ Ce compte a été désactivé.";

                        break;


                    default:

                        errorMessage =
                            "❌ " +
                            (error.message ||
                             "Une erreur est survenue.");

                        break;
                }


                showMessage(
                    errorMessage,
                    "error"
                );


                // -------------------------------------------------
                // RÉACTIVER LE BOUTON
                // -------------------------------------------------

                if (loginButton) {

                    loginButton.disabled = false;

                    loginButton.textContent =
                        "Se connecter";

                }

            }

        }
    );

} else {

    console.error(
        "Le formulaire #loginForm est introuvable."
    );
}
