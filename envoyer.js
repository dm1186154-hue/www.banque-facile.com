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
   UTILISATEUR CONNECTÉ
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
       AUTHENTIFICATION FIREBASE
    ===================================== */

    onAuthStateChanged(
        auth,
        function (user) {

            authReady = true;

            if (!user) {

                connectedUser = null;

                currentUserElement.textContent =
                    "Non connecté";

                showMessage(
                    "❌ Votre session a expiré. Veuillez vous reconnecter."
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


            /* ==============================
               UTILISATEUR TROUVÉ
            ============================== */

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
       FORMULAIRE D'ENVOI
    ===================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =================================
               VÉRIFICATION AUTHENTIFICATION
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
               RÉCUPÉRATION DES DONNÉES
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
               VALIDATION DU NOM
            ================================= */

            if (name.length < 2) {

                showMessage(
                    "❌ Veuillez saisir le nom du bénéficiaire."
                );

                recipientName.focus();

                return;
            }


            /* =================================
               VALIDATION DU TÉLÉPHONE
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
               VALIDATION DU MONTANT
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
               CHARGEMENT
            ================================= */

            sendButton.disabled = true;

            sendButton.textContent =
                "⏳ Traitement en cours...";


            try {


                /* =================================
                   RÉFÉRENCE DU COMPTE UTILISATEUR
                ================================= */

                const userRef =
                    doc(
                        db,
                        "users",
                        connectedUser.uid
                    );


                /* =================================
                   RÉCUPÉRATION DU COMPTE
                ================================= */

                const userSnapshot =
                    await getDoc(userRef);


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


                /* =================================
                   RÉCUPÉRATION DU SOLDE
                ================================= */

                const currentBalance =
                    Number(
                        userData.solde ??
                        userData.balance ??
                        0
                    );


                /* =================================
                   VÉRIFICATION DU SOLDE
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
                   CALCUL NOUVEAU SOLDE
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
                   MESSAGE DE SUCCÈS
                ================================= */

                showMessage(
                    "✅ Transfert enregistré avec succès.",
                    true
                );


                /* =================================
                   RÉINITIALISATION FORMULAIRE
                ================================= */

                form.reset();


                /* =================================
                   RETOUR AU TABLEAU DE BORD
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
                   GESTION DES ERREURS
                ================================= */

                console.error(
                    "Erreur pendant l'envoi :",
                    error
                );


                let message =
                    "❌ Une erreur est survenue pendant le transfert.";


                if (
                    error.code ===
                    "permission-denied"
                ) {

                    message =
                        "❌ Permission refusée par Firebase. Vérifiez les règles Firestore.";

                } else if (
                    error.code ===
                    "not-found"
                ) {

                    message =
                        "❌ Compte bancaire introuvable.";

                } else if (
                    error.code ===
                    "failed-precondition"
                ) {

                    message =
                        "❌ Firebase nécessite une configuration supplémentaire.";

                }


                showMessage(message);


            } finally {


                /* =================================
                   RÉACTIVATION DU BOUTON
                ================================= */

                sendButton.disabled = false;

                sendButton.textContent =
                    "💸 Envoyer l'argent";

            }

        }
    );
}
