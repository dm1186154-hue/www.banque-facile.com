// =====================================================
// BANQUE FACILE
// CONNEXION AVEC FIREBASE AUTHENTICATION
// =====================================================


// =====================================================
// IMPORT FIREBASE
// =====================================================

import {
    initializeApp
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// =====================================================
// CONFIGURATION FIREBASE
// =====================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyCedgq5K2ZR_cvvVnbLvUBKwTjAV_Mnc8U",

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


// =====================================================
// INITIALISATION
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// =====================================================
// ÉLÉMENTS HTML
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
// MESSAGE
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
// AFFICHER / MASQUER LE MOT DE PASSE
// =====================================================

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.textContent =
                    "🙈";

                togglePassword.setAttribute(
                    "aria-label",
                    "Masquer le mot de passe"
                );

            } else {

                passwordInput.type = "password";

                togglePassword.textContent =
                    "👁️";

                togglePassword.setAttribute(
                    "aria-label",
                    "Afficher le mot de passe"
                );
            }

        }
    );
}


// =====================================================
// VÉRIFIER SI UN UTILISATEUR EST DÉJÀ CONNECTÉ
// =====================================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log(
            "Utilisateur déjà connecté :",
            user.email
        );

    }

});


// =====================================================
// CONNEXION
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // -------------------------------------------------
            // RÉCUPÉRATION
            // -------------------------------------------------

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            // -------------------------------------------------
            // VALIDATION EMAIL
            // -------------------------------------------------

            if (!email) {

                showMessage(
                    "⚠️ Veuillez entrer votre adresse e-mail.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            // -------------------------------------------------
            // VALIDATION FORMAT EMAIL
            // -------------------------------------------------

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailRegex.test(email)) {

                showMessage(
                    "⚠️ Veuillez entrer une adresse e-mail valide.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            // -------------------------------------------------
            // VALIDATION MOT DE PASSE
            // -------------------------------------------------

            if (!password) {

                showMessage(
                    "⚠️ Veuillez entrer votre mot de passe.",
                    "error"
                );

                passwordInput.focus();

                return;
            }


            // -------------------------------------------------
            // CHARGEMENT
            // -------------------------------------------------

            loginButton.disabled = true;

            loginButton.textContent =
                "Connexion en cours...";


            showMessage(
                "⏳ Connexion à votre espace Banque Facile...",
                "loading"
            );


            try {

                // -------------------------------------------------
                // FIREBASE LOGIN
                // -------------------------------------------------

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                // -------------------------------------------------
                // SAUVEGARDE DES INFORMATIONS
                // -------------------------------------------------

                localStorage.setItem(
                    "banqueFacileEmail",
                    user.email || email
                );


                localStorage.setItem(
                    "banqueFacileUid",
                    user.uid
                );


                if (user.displayName) {

                    localStorage.setItem(
                        "banqueFacileFullname",
                        user.displayName
                    );

                }


                // -------------------------------------------------
                // SUCCÈS
                // -------------------------------------------------

                showMessage(
                    "✅ Connexion réussie ! Redirection...",
                    "success"
                );


                // -------------------------------------------------
                // REDIRECTION
                // -------------------------------------------------

                setTimeout(() => {

                    window.location.href =
                        "tableau_de_bord.html";

                }, 800);


            } catch (error) {

                console.error(
                    "Erreur Firebase :",
                    error
                );


                // -------------------------------------------------
                // ERREURS FIREBASE
                // -------------------------------------------------

                let errorMessage =
                    "❌ Impossible de vous connecter.";


                switch (error.code) {

                    case "auth/invalid-credential":

                        errorMessage =
                            "❌ Adresse e-mail ou mot de passe incorrect.";

                        break;


                    case "auth/invalid-email":

                        errorMessage =
                            "❌ Adresse e-mail invalide.";

                        break;


                    case "auth/user-disabled":

                        errorMessage =
                            "❌ Ce compte a été désactivé.";

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
                            "❌ Problème de connexion Internet.";

                        break;


                    default:

                        errorMessage =
                            "❌ Erreur de connexion. Vérifiez vos informations et réessayez.";

                }


                showMessage(
                    errorMessage,
                    "error"
                );


                // -------------------------------------------------
                // RÉACTIVER LE BOUTON
                // -------------------------------------------------

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "🔐 Se connecter";

            }

        }
    );

}
