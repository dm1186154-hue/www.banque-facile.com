// =====================================================
// BANQUE FACILE
// CONNEXION AVEC FIREBASE AUTHENTICATION
// =====================================================

// Import Firebase
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
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
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// =====================================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const togglePassword =
    document.getElementById("togglePassword");


// =====================================================
// FONCTION POUR AFFICHER UN MESSAGE
// =====================================================

function showMessage(message, type) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;

    loginMessage.className =
        "form-message " + type;
}


// =====================================================
// AFFICHER / MASQUER LE MOT DE PASSE
// =====================================================

if (togglePassword && passwordInput) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type === "password"
            ) {

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

        }
    );

}


// =====================================================
// VÉRIFICATION DES CHAMPS
// =====================================================

function validateForm(email, password) {

    if (!email) {

        showMessage(
            "⚠️ Veuillez entrer votre adresse e-mail.",
            "error"
        );

        emailInput.focus();

        return false;
    }


    if (!email.includes("@")) {

        showMessage(
            "⚠️ Veuillez entrer une adresse e-mail valide.",
            "error"
        );

        emailInput.focus();

        return false;
    }


    if (!password) {

        showMessage(
            "⚠️ Veuillez entrer votre mot de passe.",
            "error"
        );

        passwordInput.focus();

        return false;
    }


    return true;
}


// =====================================================
// CONNEXION
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            // Empêche le navigateur
            // d'envoyer le formulaire dans l'URL
            event.preventDefault();


            // -------------------------------------------------
            // RÉCUPÉRATION DES INFORMATIONS
            // -------------------------------------------------

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (
                !validateForm(
                    email,
                    password
                )
            ) {

                return;
            }


            // -------------------------------------------------
            // BOUTON EN CHARGEMENT
            // -------------------------------------------------

            loginButton.disabled = true;

            loginButton.textContent =
                "Connexion en cours...";


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


                // =============================================
                // UTILISATEUR CONNECTÉ
                // =============================================

                const user =
                    userCredential.user;


                console.log(
                    "Utilisateur connecté :",
                    user.uid
                );


                // =============================================
                // STOCKAGE DES INFORMATIONS NON SENSIBLES
                // =============================================

                localStorage.setItem(
                    "banqueFacileEmail",
                    user.email || ""
                );


                localStorage.setItem(
                    "banqueFacileUID",
                    user.uid || ""
                );


                localStorage.setItem(
                    "banqueFacileFullname",
                    user.displayName || ""
                );


                // =============================================
                // MESSAGE DE SUCCÈS
                // =============================================

                showMessage(
                    "✅ Connexion réussie !",
                    "success"
                );


                // =============================================
                // REDIRECTION
                // =============================================

                setTimeout(
                    function () {

                        window.location.href =
                            "tableau_de_bord.html";

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Erreur Firebase :",
                    error
                );


                // =============================================
                // MESSAGE D'ERREUR
                // =============================================

                let message =
                    "❌ Impossible de vous connecter.";


                switch (error.code) {

                    case "auth/invalid-email":

                        message =
                            "❌ L'adresse e-mail n'est pas valide.";

                        break;


                    case "auth/invalid-credential":

                        message =
                            "❌ E-mail ou mot de passe incorrect.";

                        break;


                    case "auth/user-not-found":

                        message =
                            "❌ Aucun compte ne correspond à cette adresse e-mail.";

                        break;


                    case "auth/wrong-password":

                        message =
                            "❌ Mot de passe incorrect.";

                        break;


                    case "auth/user-disabled":

                        message =
                            "❌ Ce compte a été désactivé.";

                        break;


                    case "auth/too-many-requests":

                        message =
                            "⚠️ Trop de tentatives. Veuillez réessayer plus tard.";

                        break;


                    case "auth/network-request-failed":

                        message =
                            "❌ Problème de connexion Internet.";

                        break;


                    default:

                        message =
                            "❌ Une erreur est survenue. Veuillez réessayer.";

                        break;
                }


                showMessage(
                    message,
                    "error"
                );


                // -------------------------------------------------
                // RÉACTIVER LE BOUTON
                // -------------------------------------------------

                loginButton.disabled = false;

                loginButton.textContent =
                    "Se connecter";

            }

        }
    );

} else {

    console.error(
        "❌ Le formulaire #loginForm est introuvable."
    );

}


// =====================================================
// SURVEILLANCE DE LA SESSION FIREBASE
// =====================================================

onAuthStateChanged(
    auth,
    function (user) {

        if (user) {

            console.log(
                "Session Firebase active :",
                user.email
            );

        } else {

            console.log(
                "Aucun utilisateur connecté."
            );

        }

    }
);
