// =====================================================
// BANQUE FACILE
// Authentification
// =====================================================

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from
"https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
    auth
} from "./firebase.js";


// ================= INSCRIPTION =================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const fullname =
                document.getElementById("fullname").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;


            const message =
                document.getElementById("registerMessage");


            if (password !== confirmPassword) {

                message.textContent =
                    "Les mots de passe ne correspondent pas.";

                return;
            }


            try {

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                console.log(
                    "Utilisateur créé :",
                    userCredential.user.uid
                );


                message.textContent =
                    "Compte créé avec succès.";

                registerForm.reset();


            } catch (error) {

                console.error(error);

                message.textContent =
                    "Impossible de créer le compte.";

            }

        }
    );
}


// ================= CONNEXION =================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;


            const message =
                document.getElementById("loginMessage");


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                message.textContent =
                    "Connexion réussie.";

                window.location.href =
                    "tableau-de-bord.html";


            } catch (error) {

                console.error(error);

                message.textContent =
                    "E-mail ou mot de passe incorrect.";

            }

        }
    );
}


// ================= DECONNEXION =================

window.logoutUser = async function () {

    try {

        await signOut(auth);

        window.location.href =
            "index.html";

    } catch (error) {

        console.error(error);

    }

};
