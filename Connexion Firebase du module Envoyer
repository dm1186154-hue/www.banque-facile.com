import {
    initializeApp
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


import {
    getAuth,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================
   CONFIGURATION FIREBASE
========================================= */

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


/* =========================================
   INITIALISATION
========================================= */

const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


/* =========================================
   ÉLÉMENTS HTML
========================================= */

const form =
    document.getElementById(
        "sendMoneyForm"
    );


const currentUserElement =
    document.getElementById(
        "currentUser"
    );


const recipientName =
    document.getElementById(
        "recipientName"
    );


const recipientPhone =
    document.getElementById(
        "recipientPhone"
    );


const amount =
    document.getElementById(
        "amount"
    );


const reason =
    document.getElementById(
        "reason"
    );


const sendMessage =
    document.getElementById(
        "sendMessage"
    );


const sendButton =
    document.getElementById(
        "sendButton"
    );


let connectedUser = null;


/* =========================================
   AFFICHER UN MESSAGE
========================================= */

function showMessage(
    message,
    success = false
) {

    sendMessage.textContent =
        message;


    sendMessage.style.display =
        "block";


    if (success) {

        sendMessage.style.background =
            "#ecfdf3";

        sendMessage.style.color =
            "#027a48";

    } else {

        sendMessage.style.background =
            "#fff1f0";

        sendMessage.style.color =
            "#b42318";
    }

}


/* =========================================
   UTILISATEUR CONNECTÉ
========================================= */

onAuthStateChanged(
    auth,
    function (user) {

        if (!user) {

            window.location.href =
                "connexion.html";

            return;
        }


        connectedUser =
            user;


        currentUserElement.textContent =
            user.email ||
            "Compte connecté";

    }
);


/* =========================================
   FORMULAIRE
========================================= */

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* =================================
           VÉRIFICATION CONNEXION
        ================================= */

        if (!connectedUser) {

            showMessage(
                "❌ Aucun utilisateur connecté."
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
            Number(
                amount.value
            );


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

        const confirmation =
            confirm(
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

        sendButton.disabled =
            true;


        sendButton.textContent =
            "⏳ Traitement en cours...";


        try {


            /* =================================
               RÉFÉRENCE UTILISATEUR
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
                await getDoc(
                    userRef
                );


            if (!userSnapshot.exists()) {

                throw new Error(
                    "Compte utilisateur introuvable."
                );
            }


            const userData =
                userSnapshot.data();


            /* =================================
               SOLDE ACTUEL
            ================================= */

            const currentBalance =
                Number(
                    userData.solde ??
                    userData.balance ??
                    0
                );


            if (
                !Number.isFinite(
                    currentBalance
                )
            ) {

                throw new Error(
                    "Solde du compte invalide."
                );
            }


            /* =================================
               VÉRIFICATION SOLDE
            ================================= */

            if (
                currentBalance <
                money
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
                currentBalance -
                money;


            /* =================================
               MISE À JOUR DU SOLDE
            ================================= */

            await updateDoc(
                userRef,
                {
                    solde:
                        newBalance
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


            form.reset();


        } catch (error) {

            console.error(
                "Erreur pendant l'envoi :",
                error
            );


            showMessage(
                "❌ Une erreur est survenue pendant le transfert."
            );


        } finally {

            sendButton.disabled =
                false;


            sendButton.textContent =
                "💸 Envoyer l'argent";

        }

    }
);
