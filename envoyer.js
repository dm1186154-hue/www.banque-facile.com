// ============================================
// BANQUE FACILE
// Envoi d'argent
// Firebase Authentication + Firestore
// ============================================

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
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ============================================
// CONFIGURATION FIREBASE
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyCedgq5K2ZR_cvvVnbLvUBKwTjAV_Mnc8U",
    authDomain: "banque-app-66bf9.firebaseapp.com",
    projectId: "banque-app-66bf9",
    storageBucket: "banque-app-66bf9.firebasestorage.app",
    messagingSenderId: "833823730245",
    appId: "1:833823730245:web:8141ce1171c93040f9912c"
};


// ============================================
// INITIALISATION
// ============================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// ============================================

const sendForm =
    document.getElementById("sendForm");

const sendMessage =
    document.getElementById("sendMessage");

const beneficiaryInput =
    document.getElementById("beneficiary");

const amountInput =
    document.getElementById("amount");

const descriptionInput =
    document.getElementById("description");


// ============================================
// UTILISATEUR CONNECTÉ
// ============================================

let currentUser = null;


// ============================================
// FONCTION MESSAGE
// ============================================

function showMessage(message, type = "error") {

    if (!sendMessage) {
        return;
    }

    sendMessage.textContent = message;

    if (type === "success") {

        sendMessage.style.color = "green";

    } else if (type === "info") {

        sendMessage.style.color = "#0d6efd";

    } else {

        sendMessage.style.color = "red";
    }
}


// ============================================
// VÉRIFICATION DE L'UTILISATEUR
// ============================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        console.log(
            "Utilisateur connecté :",
            user.uid
        );

    } else {

        currentUser = null;

        showMessage(
            "Vous devez être connecté pour envoyer de l'argent."
        );

        setTimeout(() => {

            window.location.href =
                "connexion.html";

        }, 1500);
    }
});


// ============================================
// ENVOI D'ARGENT
// ============================================

if (sendForm) {

    sendForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ----------------------------------------
            // VÉRIFICATION DE CONNEXION
            // ----------------------------------------

            if (!currentUser) {

                showMessage(
                    "Vous devez être connecté."
                );

                return;
            }


            // ----------------------------------------
            // RÉCUPÉRATION DES DONNÉES
            // ----------------------------------------

            const beneficiary =
                beneficiaryInput
                    ? beneficiaryInput.value.trim()
                    : "";

            const amountValue =
                amountInput
                    ? amountInput.value.trim()
                    : "";

            const description =
                descriptionInput
                    ? descriptionInput.value.trim()
                    : "";


            // ----------------------------------------
            // CONVERSION DU MONTANT
            // ----------------------------------------

            const amount =
                Number(amountValue);


            // ----------------------------------------
            // VALIDATION DU BÉNÉFICIAIRE
            // ----------------------------------------

            if (!beneficiary) {

                showMessage(
                    "Veuillez saisir le numéro ou l'identifiant du bénéficiaire."
                );

                if (beneficiaryInput) {
                    beneficiaryInput.focus();
                }

                return;
            }


            // ----------------------------------------
            // VALIDATION DU MONTANT
            // ----------------------------------------

            if (
                !amountValue ||
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                showMessage(
                    "Veuillez saisir un montant valide supérieur à 0."
                );

                if (amountInput) {
                    amountInput.focus();
                }

                return;
            }


            // ----------------------------------------
            // LIMITE DE DÉCIMALES
            // ----------------------------------------

            if (
                Math.round(amount * 100) / 100 !== amount
            ) {

                showMessage(
                    "Le montant ne peut pas dépasser deux décimales."
                );

                return;
            }


            // ----------------------------------------
            // EMPÊCHER L'ENVOI À SOI-MÊME
            // ----------------------------------------

            if (
                beneficiary === currentUser.uid ||
                beneficiary === currentUser.email
            ) {

                showMessage(
                    "Vous ne pouvez pas envoyer de l'argent à votre propre compte."
                );

                return;
            }


            // ----------------------------------------
            // ÉTAT DE CHARGEMENT
            // ----------------------------------------

            const submitButton =
                sendForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.dataset.originalText =
                    submitButton.textContent;

                submitButton.textContent =
                    "Traitement en cours...";
            }

            showMessage(
                "Vérification de l'opération...",
                "info"
            );


            try {

                // ====================================
                // RÉCUPÉRATION DU COMPTE EXPÉDITEUR
                // ====================================

                const senderRef =
                    doc(
                        db,
                        "users",
                        currentUser.uid
                    );

                const senderSnapshot =
                    await getDoc(senderRef);


                if (!senderSnapshot.exists()) {

                    throw new Error(
                        "Compte utilisateur introuvable."
                    );
                }


                const senderData =
                    senderSnapshot.data();


                // ====================================
                // RECHERCHE DU BÉNÉFICIAIRE
                // ====================================
                //
                // Cette partie recherche uniquement
                // par UID si le bénéficiaire correspond
                // à un UID Firebase.
                //
                // Pour une recherche par numéro de
                // téléphone, il faudra mettre en place
                // une requête Firestore sécurisée.
                // ====================================

                let receiverUser = null;

                try {

                    const receiverRef =
                        doc(
                            db,
                            "users",
                            beneficiary
                        );

                    const receiverSnapshot =
                        await getDoc(receiverRef);


                    if (
                        receiverSnapshot.exists()
                    ) {

                        receiverUser = {
                            uid: beneficiary,
                            ...receiverSnapshot.data()
                        };
                    }

                } catch (receiverError) {

                    console.warn(
                        "Recherche du bénéficiaire impossible :",
                        receiverError
                    );
                }


                // ====================================
                // INFORMATIONS DESTINATAIRE
                // ====================================

                const receiverUid =
                    receiverUser
                        ? receiverUser.uid
                        : beneficiary;


                const receiverName =
                    receiverUser
                        ? (
                            receiverUser.nomComplet ||
                            receiverUser.displayName ||
                            "Bénéficiaire"
                        )
                        : "Bénéficiaire";


                // ====================================
                // CRÉATION DE L'OPÉRATION
                // ====================================

                const transactionData = {

                    // Expéditeur
                    expediteurUid:
                        currentUser.uid,

                    expediteurNom:
                        senderData.nomComplet ||
                        currentUser.displayName ||
                        "",

                    expediteurEmail:
                        currentUser.email || "",


                    // Destinataire
                    beneficiaire:
                        beneficiary,

                    beneficiaireUid:
                        receiverUid,

                    beneficiaireNom:
                        receiverName,


                    // Montant
                    montant:
                        amount,


                    // Description
                    description:
                        description || "",


                    // Type
                    type:
                        "envoi",


                    // Statut
                    statut:
                        "en_attente",


                    // Date
                    date:
                        serverTimestamp(),


                    // Informations techniques
                    devise:
                        "XOF"
                };


                // ====================================
                // ENREGISTREMENT DANS FIRESTORE
                // ====================================

                const transactionRef =
                    await addDoc(
                        collection(
                            db,
                            "transactions"
                        ),
                        transactionData
                    );


                console.log(
                    "Transaction créée :",
                    transactionRef.id
                );


                // ====================================
                // SUCCÈS
                // ====================================

                showMessage(
                    "Demande d'envoi enregistrée avec succès.",
                    "success"
                );


                // ====================================
                // RÉINITIALISATION DU FORMULAIRE
                // ====================================

                sendForm.reset();


                // ====================================
                // REDIRECTION
                // ====================================

                setTimeout(() => {

                    window.location.href =
                        "tableau_de_bord.html";

                }, 1800);


            } catch (error) {

                console.error(
                    "Erreur lors de l'envoi :",
                    error
                );


                // ====================================
                // MESSAGES D'ERREUR
                // ====================================

                let message =
                    "Impossible d'effectuer l'opération. Veuillez réessayer.";


                if (
                    error.code ===
                    "permission-denied"
                ) {

                    message =
                        "Vous n'avez pas l'autorisation d'effectuer cette opération.";

                }

                else if (
                    error.code ===
                    "unavailable"
                ) {

                    message =
                        "Le service est temporairement indisponible.";

                }

                else if (
                    error.message ===
                    "Compte utilisateur introuvable."
                ) {

                    message =
                        "Votre compte Banque Facile est introuvable.";

                }


                showMessage(
                    message,
                    "error"
                );


            } finally {

                // ====================================
                // RÉACTIVER LE BOUTON
                // ====================================

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        submitButton.dataset.originalText ||
                        "Envoyer";
                }
            }
        }
    );
}
