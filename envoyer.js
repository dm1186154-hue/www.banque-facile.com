import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================
   CONFIGURATION FIREBASE
========================================= */

const firebaseConfig = {
    apiKey: "AIzaSyCedgq5K2ZR_cvvVnbLvUBKwTjAV_Mnc8U",
    authDomain: "banque-app-66bf9.firebaseapp.com",
    projectId: "banque-app-66bf9",
    storageBucket: "banque-app-66bf9.firebasestorage.app",
    messagingSenderId: "833823730245",
    appId: "1:833823730245:web:8141ce1171c93040f9912c"
};


/* =========================================
   INITIALISATION FIREBASE
========================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


/* =========================================
   ÉLÉMENTS HTML
========================================= */

const form = document.getElementById("sendMoneyForm");

const currentUserElement =
    document.getElementById("currentUser");

const recipientName =
    document.getElementById("recipientName");

const recipientPhone =
    document.getElementById("recipientPhone");

const amount =
    document.getElementById("amount");

const reason =
    document.getElementById("reason");

const sendMessage =
    document.getElementById("sendMessage");

const sendButton =
    document.getElementById("sendButton");


/* =========================================
   VARIABLES
========================================= */

let connectedUser = null;

let authReady = false;


/* =========================================
   AFFICHER UN MESSAGE
========================================= */

function showMessage(message, success = false) {

    sendMessage.textContent = message;

    sendMessage.style.display = "block";

    sendMessage.style.padding = "12px";

    sendMessage.style.marginBottom = "15px";

    sendMessage.style.borderRadius = "10px";

    sendMessage.style.fontWeight = "600";

    if (success) {

        sendMessage.style.background = "#ecfdf3";

        sendMessage.style.color = "#027a48";

    } else {

        sendMessage.style.background = "#fff1f0";

        sendMessage.style.color = "#b42318";
    }
}


/* =========================================
   VÉRIFICATION DES ÉLÉMENTS HTML
========================================= */

if (
    !form ||
    !currentUserElement ||
    !recipientName ||
    !recipientPhone ||
    !amount ||
    !reason ||
    !sendMessage ||
    !sendButton
) {

    console.error(
        "Erreur : un ou plusieurs éléments HTML sont introuvables."
    );

} else {


    /* =====================================
       AUTHENTIFICATION
    ===================================== */

    onAuthStateChanged(
        auth,
        function (user) {

            authReady = true;


            /* =================================
               AUCUN UTILISATEUR
            ================================= */

            if (!user) {

                connectedUser = null;

                currentUserElement.textContent =
                    "Non connecté";

                showMessage(
                    "❌ Votre session n'est pas active."
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "connexion.html";

                    },
                    1500
                );

                return;
            }


            /* =================================
               UTILISATEUR CONNECTÉ
            ================================= */

            connectedUser = user;


            currentUserElement.textContent =
                user.email ||
                user.displayName ||
                "Compte connecté";


            sendButton.disabled = false;


            console.log(
                "Utilisateur connecté :",
                user.uid
            );
        }
    );


    /* =====================================
       FORMULAIRE
    ===================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =================================
               VÉRIFICATION AUTH
            ================================= */

            if (!authReady) {

                showMessage(
                    "⏳ Vérification de votre connexion..."
                );

                return;
            }


            if (!connectedUser) {

                showMessage(
                    "❌ Vous devez être connecté pour effectuer un envoi."
                );

                return;
            }


            /* =================================
               RÉCUPÉRATION DES INFORMATIONS
            ================================= */

            const name =
                recipientName.value.trim();

            const phone =
                recipientPhone.value.trim();

            const money =
                Number(amount.value);

            const transferReason =
                reason.value.trim();


            /* =================================
               VALIDATION NOM
            ================================= */

            if (name.length < 2) {

                showMessage(
                    "❌ Veuillez saisir le nom du bénéficiaire."
                );

                recipientName.focus();

                return;
            }


            /* =================================
               VALIDATION TÉLÉPHONE
            ================================= */

            const phonePattern =
                /^[0-9+\s()-]{8,20}$/;


            if (!phonePattern.test(phone)) {

                showMessage(
                    "❌ Veuillez saisir un numéro de téléphone valide."
                );

                recipientPhone.focus();

                return;
            }


            /* =================================
               VALIDATION MONTANT
            ================================= */

            if (
                !Number.isFinite(money) ||
                money <= 0
            ) {

                showMessage(
                    "❌ Veuillez saisir un montant valide."
                );

                amount.focus();

                return;
            }


            /* =================================
               MONTANT ENTIER
            ================================= */

            if (!Number.isInteger(money)) {

                showMessage(
                    "❌ Le montant doit être un nombre entier."
                );

                amount.focus();

                return;
            }


            /* =================================
               CONFIRMATION
            ================================= */

            const confirmation = confirm(
                "Confirmer l'envoi de " +
                money.toLocaleString("fr-FR") +
                " FCFA à " +
                name +
                " ?"
            );


            if (!confirmation) {

                return;
            }


            /* =================================
               BOUTON CHARGEMENT
            ================================= */

            sendButton.disabled = true;

            sendButton.textContent =
                "⏳ Traitement en cours...";


            try {


                /* =================================
                   RÉFÉRENCE DU COMPTE
                ================================= */

                const userRef =
                    doc(
                        db,
                        "users",
                        connectedUser.uid
                    );


                /* =================================
                   RÉCUPÉRER LE COMPTE
                ================================= */

                const userSnapshot =
                    await getDoc(userRef);


                console.log(
                    "Compte Firestore récupéré :",
                    userSnapshot.exists()
                );


                /* =================================
                   COMPTE INTROUVABLE
                ================================= */

                if (!userSnapshot.exists()) {

                    showMessage(
                        "❌ Votre compte bancaire est introuvable."
                    );

                    return;
                }


                /* =================================
                   DONNÉES DU COMPTE
                ================================= */

                const userData =
                    userSnapshot.data();


                console.log(
                    "Données du compte :",
                    userData
                );


                /* =================================
                   RÉCUPÉRATION DU SOLDE
                ================================= */

                const currentBalance =
                    Number(
                        userData.solde ??
                        userData.balance ??
                        0
                    );


                console.log(
                    "Solde actuel :",
                    currentBalance
                );


                /* =================================
                   SOLDE INVALIDE
                ================================= */

                if (
                    !Number.isFinite(
                        currentBalance
                    )
                ) {

                    showMessage(
                        "❌ Le solde de votre compte est invalide."
                    );

                    return;
                }


                /* =================================
                   SOLDE INSUFFISANT
                ================================= */

                if (
                    currentBalance < money
                ) {

                    showMessage(
                        "❌ Solde insuffisant."
                    );

                    return;
                }


                /* =================================
                   NOUVEAU SOLDE
                ================================= */

                const newBalance =
                    currentBalance - money;


                /* =================================
                   MISE À JOUR DU SOLDE
                ================================= */

                await updateDoc(
                    userRef,
                    {
                        solde: newBalance
                    }
                );


                /* =================================
                   ENREGISTREMENT TRANSACTION
                ================================= */

                await addDoc(
                    collection(
                        db,
                        "transactions"
                    ),
                    {

                        userId:
                            connectedUser.uid,

                        type:
                            "envoi",

                        beneficiary:
                            name,

                        beneficiaryPhone:
                            phone,

                        amount:
                            money,

                        reason:
                            transferReason,

                        previousBalance:
                            currentBalance,

                        newBalance:
                            newBalance,

                        status:
                            "completed",

                        createdAt:
                            serverTimestamp()
                    }
                );


                /* =================================
                   SUCCÈS
                ================================= */

                showMessage(
                    "✅ Transfert enregistré avec succès.",
                    true
                );


                /* =================================
                   VIDER LE FORMULAIRE
                ================================= */

                form.reset();


                /* =================================
                   RETOUR TABLEAU DE BORD
                ================================= */

                setTimeout(
                    function () {

                        window.location.href =
                            "tableau_de_bord.html";

                    },
                    2000
                );


            } catch (error) {


                /* =================================
                   AFFICHER L'ERREUR DANS CONSOLE
                ================================= */

                console.error(
                    "Erreur pendant le transfert :",
                    error
                );


                console.error(
                    "Code Firebase :",
                    error.code
                );


                console.error(
                    "Message Firebase :",
                    error.message
                );


                /* =================================
                   MESSAGE PAR DÉFAUT
                ================================= */

                let message =
                    "❌ Une erreur est survenue pendant le transfert.";


                /* =================================
                   PERMISSION FIRESTORE
                ================================= */

                if (
                    error.code ===
                    "permission-denied"
                ) {

                    message =
                        "❌ Permission refusée par Firebase.";

                }


                /* =================================
                   DOCUMENT INTROUVABLE
                ================================= */

                else if (
                    error.code ===
                    "not-found"
                ) {

                    message =
                        "❌ Compte bancaire introuvable.";

                }


                /* =================================
                   FIREBASE NON CONFIGURÉ
                ================================= */

                else if (
                    error.code ===
                    "failed-precondition"
                ) {

                    message =
                        "❌ Firebase nécessite une configuration supplémentaire.";

                }


                /* =================================
                   RÉSEAU
                ================================= */

                else if (
                    error.code ===
                    "unavailable"
                ) {

                    message =
                        "❌ Firebase est temporairement indisponible. Vérifiez votre connexion Internet.";

                }


                /* =================================
                   NON AUTORISÉ
                ================================= */

                else if (
                    error.code ===
                    "unauthenticated"
                ) {

                    message =
                        "❌ Votre session Firebase n'est plus valide.";

                }


                /* =================================
                   ERREUR FIREBASE GÉNÉRALE
                ================================= */

                else if (
                    error.code
                ) {

                    message =
                        "❌ Erreur Firebase : " +
                        error.code;
                }


                /* =================================
                   AFFICHAGE DU MESSAGE
                ================================= */

                showMessage(
                    message +
                    " Code : " +
                    (error.code || "inconnu")
                );


            } finally {


                /* =================================
                   RÉACTIVER LE BOUTON
                ================================= */

                sendButton.disabled = false;

                sendButton.textContent =
                    "💸 Envoyer l'argent";
            }

        }
    );
}
