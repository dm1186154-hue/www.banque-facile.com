import {
    auth,
    createUserWithEmailAndPassword
} from "./firebase.js";

const form = document.getElementById("registerForm");
const message = document.getElementById("registerMessage");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    message.textContent = "";
    message.style.color = "";

    if (password !== confirmPassword) {
        message.textContent =
            "❌ Les mots de passe ne correspondent pas.";
        message.style.color = "red";
        return;
    }

    if (password.length < 6) {
        message.textContent =
            "❌ Le mot de passe doit contenir au moins 6 caractères.";
        message.style.color = "red";
        return;
    }

    message.textContent =
        "⏳ Création de votre compte...";

    message.style.color = "#0066cc";

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        console.log("Utilisateur créé :", user.uid);

        message.textContent =
            "✅ Compte créé avec succès !";

        message.style.color = "green";

        /*
         * Pour le moment, nous ne faisons pas encore
         * l'enregistrement Firestore.
         *
         * Nous vérifions d'abord que Firebase
         * Authentication fonctionne correctement.
         */

        setTimeout(() => {
            window.location.href = "connexion.html";
        }, 2000);

    } catch (error) {

        console.error("Erreur Firebase :", error);

        if (error.code === "auth/email-already-in-use") {

            message.textContent =
                "❌ Cette adresse e-mail est déjà utilisée.";

        } else if (error.code === "auth/invalid-email") {

            message.textContent =
                "❌ L'adresse e-mail est invalide.";

        } else if (error.code === "auth/weak-password") {

            message.textContent =
                "❌ Le mot de passe est trop faible.";

        } else if (error.code === "auth/network-request-failed") {

            message.textContent =
                "❌ Problème de connexion Internet.";

        } else {

            message.textContent =
                "❌ Erreur Firebase : " + error.message;
        }

        message.style.color = "red";
    }
});
