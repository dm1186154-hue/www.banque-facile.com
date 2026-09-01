// ============================================================
// BANQUE FACILE
// MODULE : ENVOYER DE L'ARGENT
// ============================================================

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


// ============================================================
// CONFIGURATION FIREBASE
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCedgq5K2ZR_cvvVnbLvUBKwTjAV_Mnc8U",
    authDomain: "banque-app-66bf9.firebaseapp.com",
    projectId: "banque-app-66bf9",
    storageBucket: "banque-app-66bf9.firebasestorage.app",
    messagingSenderId: "833823730245",
    appId: "1:833823730245:web:8141ce1171c93040f9912c"
};


// ============================================================
// INITIALISATION FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ============================================================
// ELEMENTS HTML
// ============================================================

const form = document.getElementById("sendMoneyForm");

const currentUserElement =
    document.getElementById("currentUser");

const beneficiaryInput =
    document.getElementById("recipientName");

const phoneInput =
    document.getElementById("recipientPhone");

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
    message.className = type;
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
// NETTOYAGE DU TEXTE
// ============================================================

function cleanText(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");
}


// ============================================================
// CONVERSION DU MONTANT
// ============================================================

function getAmount(value) {

    const cleaned = String(value || "")
        .replace(/\s/g, "")
        .replace(",", ".");

    return Number(cleaned);
}


// ============================================================
// UTILISATEUR CONNECTÉ
// ============================================================

let currentUser = null;

onAuthStateChanged(auth, (user) => {

    if (!user) {

        currentUser = null;

        if (currentUserElement) {
            currentUserElement.textContent =
                "Aucun utilisateur connecté";
        }

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

    if (currentUserElement) {

        currentUserElement.textContent =
            user.email || "Utilisateur connecté";
    }

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


    // ----------------------------------------------------------
    // BENEFICIAIRE
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // TELEPHONE
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // MONTANT
    // ----------------------------------------------------------

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


    if (amount > 100000000) {

        showMessage(
            "⚠️ Le montant demandé est trop élevé.",
            "error"
        );

        amountInput?.focus();

        return null;
    }


    // ----------------------------------------------------------
    // MOTIF
    // ----------------------------------------------------------

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
// RECUPERATION DU COMPTE
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


    // ----------------------------------------------------------
    // RECUPERATION DU COMPTE
    // ----------------------------------------------------------

    const account =
        await getUserAccount(currentUser.uid);

    const userData =
        account.data;


    // ----------------------------------------------------------
    // RECUPERATION DU SOLDE
    // ----------------------------------------------------------

    let balance = 0;


    if (typeof userData.solde === "number") {

        balance = userData.solde;

    } else if (typeof userData.balance === "number") {

        balance = userData.balance;

    } else if (typeof userData.solde === "string") {

        balance =
            Number(
                userData.solde
                    .replace(/\s/g, "")
                    .replace(",", ".")
            );

    } else if (typeof userData.balance === "string") {

        balance =
            Number(
                userData.balance
                    .replace(/\s/g, "")
                    .replace(",", ".")
            );
    }


    if (!Number.isFinite(balance)) {

        throw new Error(
            "Impossible de déterminer le solde de votre compte."
        );
    }


    // ----------------------------------------------------------
    // VERIFICATION DU SOLDE
    // ----------------------------------------------------------

    if (data.amount > balance) {

        throw new Error(
            `Solde insuffisant. Votre solde disponible est de ${balance.toLocaleString("fr-FR")} FCFA.`
        );
    }


    // ----------------------------------------------------------
    // CALCUL DU NOUVEAU SOLDE
    // ----------------------------------------------------------

    const newBalance =
        balance - data.amount;


    // ----------------------------------------------------------
    // ENREGISTREMENT DE LA TRANSACTION
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // MISE A JOUR DU SOLDE
    // ----------------------------------------------------------

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


        // Nettoyage du message précédent

        if (message) {

            message.textContent = "";
            message.className = "";
        }


        // Vérification de connexion

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


            // --------------------------------------------------
            // SUCCES
            // --------------------------------------------------

            showMessage(
                `✅ Transfert effectué avec succès ! ${data.amount.toLocaleString("fr-FR")} FCFA ont été envoyés à ${data.beneficiary}. Nouveau solde : ${result.newBalance.toLocaleString("fr-FR")} FCFA.`,
                "success"
            );


            // Nettoyage du formulaire

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


            showMessage(
                "❌ " + (error.message ||
                "Une erreur est survenue pendant le transfert."),
                "error"
            );


        } finally {

            setLoading(false);
        }

    });

} else {

    console.error(
        "❌ Le formulaire #sendMoneyForm est introuvable."
    );
}
