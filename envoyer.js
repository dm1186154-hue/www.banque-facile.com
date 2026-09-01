// =====================================================
// BANQUE FACILE
// PAGE : ENVOYER DE L'ARGENT
// =====================================================

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
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
// INITIALISATION FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// =====================================================
// ÉLÉMENTS HTML
// =====================================================

const form =
    document.getElementById("sendMoneyForm");

const currentUser =
    document.getElementById("currentUser");

const message =
    document.getElementById("sendMessage");

const sendButton =
    document.getElementById("sendButton");


// =====================================================
// UTILISATEUR CONNECTÉ
// =====================================================

let connectedUser = null;


onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "connexion.html";

        return;
    }


    connectedUser = user;


    const name =
        user.displayName ||
        localStorage.getItem(
            "banqueFacileFullname"
        ) ||
        user.email ||
        "Utilisateur";


    if (currentUser) {

        currentUser.textContent =
            name;

    }

});


// =====================================================
// AFFICHER UN MESSAGE
// =====================================================

function showMessage(text, type) {

    if (!message) {
        return;
    }


    message.textContent = text;

    message.className =
        "message " + type;

}


// =====================================================
// VALIDATION DU FORMULAIRE
// =====================================================

if (form) {

    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // -------------------------------------------------
            // RÉCUPÉRATION
            // -------------------------------------------------

            const recipientName =
                document
                    .getElementById("recipientName")
                    .value
                    .trim();


            const recipientPhone =
                document
                    .getElementById("recipientPhone")
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById("amount")
                        .value
                );


            const reason =
                document
                    .getElementById("reason")
                    .value
                    .trim();


            // -------------------------------------------------
            // VÉRIFICATION UTILISATEUR
            // -------------------------------------------------

            if (!connectedUser) {

                showMessage(
                    "❌ Votre session n'est pas encore prête. Réessayez.",
                    "error"
                );

                return;
            }


            // -------------------------------------------------
            // VALIDATION NOM
            // -------------------------------------------------

            if (recipientName.length < 2) {

                showMessage(
                    "❌ Veuillez entrer le nom du bénéficiaire.",
                    "error"
                );

                return;
            }


            // -------------------------------------------------
            // VALIDATION TÉLÉPHONE
            // -------------------------------------------------

            const cleanPhone =
                recipientPhone.replace(
                    /[\s\-().]/g,
                    ""
                );


            if (
                !/^\+?[0-9]{8,15}$/.test(
                    cleanPhone
                )
            ) {

                showMessage(
                    "❌ Veuillez entrer un numéro de téléphone valide.",
                    "error"
                );

                return;
            }


            // -------------------------------------------------
            // VALIDATION MONTANT
            // -------------------------------------------------

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                showMessage(
                    "❌ Veuillez entrer un montant valide.",
                    "error"
                );

                return;
            }


            if (amount > 100000000) {

                showMessage(
                    "❌ Le montant est trop élevé.",
                    "error"
                );

                return;
            }


            // -------------------------------------------------
            // CONFIRMATION
            // -------------------------------------------------

            const confirmation =
                confirm(
                    "Confirmer la préparation du transfert ?\n\n" +
                    "Bénéficiaire : " +
                    recipientName +
                    "\n" +
                    "Téléphone : " +
                    recipientPhone +
                    "\n" +
                    "Montant : " +
                    amount.toLocaleString("fr-FR") +
                    " FCFA"
                );


            if (!confirmation) {

                return;

            }


            // -------------------------------------------------
            // CHARGEMENT
            // -------------------------------------------------

            if (sendButton) {

                sendButton.disabled = true;

                sendButton.textContent =
                    "Préparation...";

            }


            showMessage(
                "⏳ Vérification des informations...",
                "loading"
            );


            // -------------------------------------------------
            // IMPORTANT
            // -------------------------------------------------
            //
            // Pour le moment, cette étape ne débite PAS
            // de solde et ne transfère PAS réellement
            // d'argent.
            //
            // Un vrai transfert bancaire doit être validé
            // côté serveur et protégé contre les modifications
            // effectuées depuis le navigateur.
            // -------------------------------------------------

            setTimeout(() => {

                showMessage(
                    "✅ Les informations du transfert sont valides. Le système de transfert sécurisé sera connecté à Firebase dans l'étape suivante.",
                    "success"
                );


                if (sendButton) {

                    sendButton.disabled =
                        false;

                    sendButton.textContent =
                        "💸 Continuer le transfert";

                }


            }, 1000);

        }
    );

}
