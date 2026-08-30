// =====================================================
// BANQUE FACILE
// INSCRIPTION AVEC FIREBASE AUTHENTICATION
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
// INITIALISATION FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// =====================================================
// ÉLÉMENTS DU FORMULAIRE
// =====================================================

const registerForm =
    document.getElementById("registerForm");

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

const registerButton =
    document.getElementById("registerButton");

const registerMessage =
    document.getElementById("registerMessage");


// =====================================================
// MESSAGE
// =====================================================

function showMessage(message, type) {

    if (!registerMessage) {
        console.error(message);
        return;
    }

    registerMessage.textContent = message;

    registerMessage.className =
        "form-message " + type;
}


// =====================================================
// AFFICHER / MASQUER MOT DE PASSE
// =====================================================

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "🙈";

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "👁️";

        }

    });
}


if (toggleConfirmPassword && confirmPasswordInput) {

    toggleConfirmPassword.addEventListener("click", () => {

        if (confirmPasswordInput.type === "password") {

            confirmPasswordInput.type = "text";
            toggleConfirmPassword.textContent = "🙈";

        } else {

            confirmPasswordInput.type = "password";
            toggleConfirmPassword.textContent = "👁️";

        }

    });
}


// =====================================================
// INSCRIPTION
// =====================================================

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        // IMPORTANT :
        // Empêche le navigateur de recharger la page
        // et d'afficher les informations dans l'URL.
        event.preventDefault();


        // -------------------------------------------------
        // RÉCUPÉRATION DES DONNÉES
        // -------------------------------------------------

        const fullname =
            fullnameInput ? fullnameInput.value.trim() : "";

        const email =
            emailInput ? emailInput.value.trim() : "";

        const phone =
            phoneInput ? phoneInput.value.trim() : "";

        const password =
            passwordInput ? passwordInput.value : "";

        const confirmPassword =
            confirmPasswordInput
                ? confirmPasswordInput.value
                : "";


        // -------------------------------------------------
        // VALIDATION DU NOM
        // -------------------------------------------------

        if (!fullname) {

            showMessage(
                "⚠️ Veuillez entrer votre nom complet.",
                "error"
            );

            if (fullnameInput) {
                fullnameInput.focus();
            }

            return;
        }


        if (fullname.length < 2) {

            showMessage(
                "⚠️ Votre nom doit contenir au moins 2 caractères.",
                "error"
            );

            return;
        }


        // -------------------------------------------------
        // VALIDATION E-MAIL
        // -------------------------------------------------

        if (!email) {

            showMessage(
                "⚠️ Veuillez entrer votre adresse e-mail.",
                "error"
            );

            if (emailInput) {
                emailInput.focus();
            }

            return;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            showMessage(
                "⚠️ Veuillez entrer une adresse e-mail valide.",
                "error"
            );

            if (emailInput) {
                emailInput.focus();
            }

            return;
        }


        // -------------------------------------------------
        // VALIDATION TÉLÉPHONE
        // -------------------------------------------------

        if (phone && phone.length < 8) {

            showMessage(
                "⚠️ Veuillez entrer un numéro de téléphone valide.",
                "error"
            );

            if (phoneInput) {
                phoneInput.focus();
            }

            return;
        }


        // -------------------------------------------------
        // VALIDATION MOT DE PASSE
        // -------------------------------------------------

        if (!password) {

            showMessage(
                "⚠️ Veuillez entrer un mot de passe.",
                "error"
            );

            if (passwordInput) {
                passwordInput.focus();
            }

            return;
        }


        if (password.length < 6) {

            showMessage(
                "⚠️ Le mot de passe doit contenir au moins 6 caractères.",
                "error"
            );

            if (passwordInput) {
                passwordInput.focus();
            }

            return;
        }


        // -------------------------------------------------
        // CONFIRMATION MOT DE PASSE
        // -------------------------------------------------

        if (!confirmPassword) {

            showMessage(
                "⚠️ Veuillez confirmer votre mot de passe.",
                "error"
            );

            if (confirmPasswordInput) {
                confirmPasswordInput.focus();
            }

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "❌ Les deux mots de passe ne correspondent pas.",
                "error"
            );

            if (confirmPasswordInput) {
                confirmPasswordInput.focus();
            }

            return;
        }


        // -------------------------------------------------
        // BOUTON
        // -------------------------------------------------

        if (registerButton) {

            registerButton.disabled = true;

            registerButton.textContent =
                "Création du compte...";

        }


        showMessage(
            "⏳ Création de votre compte...",
            "loading"
        );


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


            const user =
                userCredential.user;


            // =================================================
            // ENREGISTRER LE NOM DANS FIREBASE
            // =================================================

            await updateProfile(user, {
                displayName: fullname
            });


            // =================================================
            // INFORMATIONS NON SENSIBLES
            // =================================================

            localStorage.setItem(
                "banqueFacileEmail",
                email
            );

            localStorage.setItem(
                "banqueFacileFullname",
                fullname
            );

            localStorage.setItem(
                "banqueFacileUID",
                user.uid
            );

            localStorage.setItem(
                "banqueFacilePhone",
                phone
            );


            // =================================================
            // SUCCÈS
            // =================================================

            showMessage(
                "✅ Compte créé avec succès ! Redirection...",
                "success"
            );


            // =================================================
            // REDIRECTION
            // =================================================

            setTimeout(() => {

                window.location.href =
                    "tableau_de_bord.html";

            }, 1200);


        } catch (error) {

            console.error(
                "Erreur inscription Firebase :",
                error
            );


            let message =
                "❌ Impossible de créer le compte.";


            // =================================================
            // ERREURS FIREBASE
            // =================================================

            switch (error.code) {

                case "auth/email-already-in-use":

                    message =
                        "❌ Cette adresse e-mail possède déjà un compte.";

                    break;


                case "auth/invalid-email":

                    message =
                        "❌ L'adresse e-mail n'est pas valide.";

                    break;


                case "auth/weak-password":

                    message =
                        "❌ Le mot de passe est trop faible. Utilisez au moins 6 caractères.";

                    break;


                case "auth/network-request-failed":

                    message =
                        "❌ Problème de connexion Internet.";

                    break;


                case "auth/operation-not-allowed":

                    message =
                        "❌ L'inscription par e-mail/mot de passe n'est pas activée dans Firebase.";

                    break;


                case "auth/too-many-requests":

                    message =
                        "⚠️ Trop de tentatives. Réessayez plus tard.";

                    break;


                default:

                    message =
                        "❌ " +
                        (
                            error.message ||
                            "Une erreur est survenue."
                        );

                    break;
            }


            showMessage(
                message,
                "error"
            );


            // -------------------------------------------------
            // RÉACTIVER LE BOUTON
            // -------------------------------------------------

            if (registerButton) {

                registerButton.disabled = false;

                registerButton.textContent =
                    "Créer mon compte";

            }

        }

    });

} else {

    console.error(
        "❌ Le formulaire #registerForm est introuvable."
    );

}
