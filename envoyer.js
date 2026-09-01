// ============================================================
// BANQUE FACILE
// MODULE : ENVOYER DE L'ARGENT
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


// ============================================================
// CONFIGURATION FIREBASE
// ============================================================

const firebaseConfig = {
    apiKey: "TON_API_KEY",
    authDomain: "TON_PROJET.firebaseapp.com",
    projectId: "TON_PROJECT_ID",
    storageBucket: "TON_PROJET.firebasestorage.app",
    messagingSenderId: "TON_SENDER_ID",
    appId: "TON_APP_ID"
};


// ============================================================
// INITIALISATION
// ============================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// ============================================================
// ELEMENTS HTML
// ============================================================

const form = document.getElementById("sendForm");

const beneficiaryInput =
    document.getElementById("beneficiary");

const phoneInput =
    document.getElementById("phone");

const amountInput =
    document.getElementById("amount");

const reasonInput =
    document.getElementById("reason");

const message =
    document.getElementById("sendMessage");

const sendButton =
    document.getElementById("sendButton");


// ============================================================
// UTILITAIRE : MESSAGE
// ============================================================

function showMessage(text, type = "error") {

    if (!message) {
        alert(text);
        return;
    }

    message.textContent = text;

    message.className = "form-message " + type;
}


// ============================================================
// UTILITAIRE : BOUTON
// ============================================================

function setLoading(loading) {

    if (!sendButton) return;

    sendButton.disabled = loading;

    if (loading) {
        sendButton.textContent = "Traitement...";
    } else {
        sendButton.textContent = "Envoyer l'argent";
    }
}


// ============================================================
// UTILITAIRE : NETTOYAGE
// ============================================================

function cleanText(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");
}


// ============================================================
// UTILITAIRE : MONTANT
// ============================================================

function getAmount(value) {

    // Autorise :
    // 1000
    // 1 000
    // 1.000
    // 1000.50

    const cleaned = String(value)
        .replace(/\s/g, "")
        .replace(",", ".");

    return Number(cleaned);
}


// ============================================================
// VERIFICATION UTILISATEUR CONNECTE
// ============================================================

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {

        currentUser = null;

        showMessage(
            "⚠️ Vous devez être connecté pour effectuer un transfert.",
            "error"
        );

        if (sendButton) {
            sendButton.disabled = true;
        }

        return;
    }

    currentUser = user;

    if (sendButton) {
        sendButton.disabled = false;
    }

    console.log(
        "Utilisateur connecté :",
        user.uid
    );
});


// ============================================================
// VALIDATION DU FORMULAIRE
// ============================================================

function validateForm() {

    const beneficiary =
        cleanText(beneficiaryInput?.value);

    const phone =
        cleanText(phoneInput?.value);

    const amount =
        getAmount(amountInput?.value);

    const reason =
        cleanText(reasonInput?.value);


    // Nom du bénéficiaire

    if (!beneficiary) {

        showMessage(
            "⚠️ Veuillez entrer le nom du bénéficiaire.",
            "error"
        );

        beneficiaryInput?.focus();

        return null;
    }


    if (beneficiary.length < 2) {

        showMessage(
            "⚠️ Le nom du bénéficiaire est trop court.",
            "error"
        );

        beneficiaryInput?.focus();

        return null;
    }


    // Téléphone

    if (!phone) {

        showMessage(
            "⚠️ Veuillez entrer le numéro du bénéficiaire.",
            "error"
        );

        phoneInput?.focus();

        return null;
    }


    const phoneClean =
        phone.replace(/[\s\-+()]/g, "");


    if (!/^\d{8,15}$/.test(phoneClean)) {

        showMessage(
            "⚠️ Veuillez entrer un numéro de téléphone valide.",
            "error"
        );

        phoneInput?.focus();

        return null;
    }


    // Montant

    if (!Number.isFinite(amount)) {

        showMessage(
            "⚠️ Veuillez entrer un montant valide.",
            "error"
        );

        amountInput?.focus();

        return null;
    }


    if (amount <= 0) {

        showMessage(
            "⚠️ Le montant doit être supérieur à 0 FCFA.",
            "error"
        );

        amountInput?.focus();

        return null;
    }


    // Limite de sécurité

    if (amount > 100000000) {

        showMessage(
            "⚠️ Le montant demandé est trop élevé.",
            "error"
        );

        amountInput?.focus();

        return null;
    }


    // Motif facultatif

    if (reason.length > 200) {

        showMessage(
            "⚠️ Le motif ne doit pas dépasser 200 caractères.",
            "error"
        );

        reasonInput?.focus();

        return null;
    }


    return {
        beneficiary,
        phone: phoneClean,
        amount,
        reason
    };
}


// ============================================================
// RECHERCHE DU COMPTE UTILISATEUR
// ============================================================

async function getUserAccount(uid) {

    const userRef =
        doc(db, "users", uid);

    const userSnapshot =
        await getDoc(userRef);


    if (!userSnapshot.exists()) {

        throw new Error(
            "Votre compte bancaire n'a pas été trouvé."
        );
    }


    return {
        ref: userRef,
        data: userSnapshot.data()
    };
}


// ============================================================
// ENVOI DE L'ARGENT
// ============================================================

async function sendMoney(data) {

    if (!currentUser) {

        throw new Error(
            "Vous devez être connecté."
        );
    }


    // Récupération du compte

    const account =
        await getUserAccount(currentUser.uid);


    const userData =
        account.data;


    // ========================================================
    // RECUPERATION DU SOLDE
    // ========================================================

    let balance = 0;


    if (typeof userData.solde === "number") {

        balance = userData.solde;

    } else if (typeof userData.balance === "number") {

        balance = userData.balance;

    } else if (typeof userData.solde === "string") {

        balance =
            Number(
                userData.solde.replace(/\s/g, "")
            );

    } else if (typeof userData.balance === "string") {

        balance =
            Number(
                userData.balance.replace(/\s/g, "")
            );
    }


    if (!Number.isFinite(balance)) {

        throw new Error(
            "Impossible de déterminer le solde de votre compte."
        );
    }


    // ========================================================
    // VERIFICATION DU SOLDE
    // ========================================================

    if (data.amount > balance) {

        throw new Error(
            `Solde insuffisant. Votre solde disponible est de ${balance.toLocaleString("fr-FR")} FCFA.`
        );
    }


    // ========================================================
    // NOUVEAU SOLDE
    // ========================================================

    const newBalance =
        balance - data.amount;


    // ========================================================
    // ENREGISTREMENT DE LA TRANSACTION
    // ========================================================

    const transaction = {

        userId: currentUser.uid,

        type: "transfert",

        operation: "envoi",

        beneficiary: data.beneficiary,

        beneficiaryPhone: data.phone,

        amount: data.amount,

        reason: data.reason || "",

        status: "effectue",

        previousBalance: balance,

        newBalance: newBalance,

        createdAt: serverTimestamp()
    };


    await addDoc(
        collection(db, "transactions"),
        transaction
    );


    // ========================================================
    // MISE A JOUR DU SOLDE
    // ========================================================

    if ("solde" in userData) {

        await updateDoc(
            account.ref,
            {
                solde: newBalance
            }
        );

    } else {

        await updateDoc(
            account.ref,
            {
                balance: newBalance
            }
        );
    }


    return {
        newBalance
    };
}


// ============================================================
// SOUMISSION DU FORMULAIRE
// ============================================================

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        // Nettoyage ancien message

        if (message) {

            message.textContent = "";

            message.className =
                "form-message";
        }


        // Vérification connexion

        if (!currentUser) {

            showMessage(
                "⚠️ Veuillez vous connecter avant d'effectuer un transfert.",
                "error"
            );

            return;
        }


        // Validation

        const data =
            validateForm();


        if (!data) {
            return;
        }


        // Confirmation

        const confirmation =
            confirm(
                `Confirmer l'envoi de ${data.amount.toLocaleString("fr-FR")} FCFA à ${data.beneficiary} ?`
            );


        if (!confirmation) {
            return;
        }


        try {

            setLoading(true);


            showMessage(
                "⏳ Traitement du transfert en cours...",
                "loading"
            );


            const result =
                await sendMoney(data);


            // ==================================================
            // SUCCES
            // ==================================================

            showMessage(
                `✅ Transfert effectué avec succès ! ${data.amount.toLocaleString("fr-FR")} FCFA ont été envoyés à ${data.beneficiary}. Nouveau solde : ${result.newBalance.toLocaleString("fr-FR")} FCFA.`,
                "success"
            );


            // Nettoyage

            if (beneficiaryInput)
                beneficiaryInput.value = "";

            if (phoneInput)
                phoneInput.value = "";

            if (amountInput)
                amountInput.value = "";

            if (reasonInput)
                reasonInput.value = "";


        } catch (error) {

            console.error(
                "Erreur transfert :",
                error
            );


            let errorMessage =
                "❌ Une erreur est survenue pendant le transfert.";


            if (error.message) {
                errorMessage =
                    "❌ " + error.message;
            }


            showMessage(
                errorMessage,
                "error"
            );


        } finally {

            setLoading(false);
        }

    });

} else {

    console.error(
        "❌ Le formulaire #sendForm est introuvable."
    );
}
