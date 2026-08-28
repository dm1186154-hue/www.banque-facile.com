// ======================================================
// BANQUE FACILE - SCRIPT.JS
// Fonctions générales de l'application
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Banque Facile : script.js chargé");


    // ==================================================
    // MENU MOBILE
    // ==================================================

    const menuButton =
        document.querySelector(".menu-button");

    const navigation =
        document.querySelector(".navigation");

    if (menuButton && navigation) {

        menuButton.addEventListener("click", () => {

            navigation.classList.toggle("active");

        });
    }


    // ==================================================
    // FERMER LE MENU APRÈS UN CLIC
    // ==================================================

    const liensMenu =
        document.querySelectorAll(".navigation a");

    liensMenu.forEach(lien => {

        lien.addEventListener("click", () => {

            if (navigation) {
                navigation.classList.remove("active");
            }

        });

    });


    // ==================================================
    // ANNÉE AUTOMATIQUE DU FOOTER
    // ==================================================

    const annee =
        document.querySelectorAll("[data-year]");

    const anneeActuelle =
        new Date().getFullYear();

    annee.forEach(element => {
        element.textContent = anneeActuelle;
    });


    // ==================================================
    // BOUTONS AVEC CONFIRMATION
    // ==================================================

    const boutonsConfirmation =
        document.querySelectorAll("[data-confirm]");

    boutonsConfirmation.forEach(bouton => {

        bouton.addEventListener("click", event => {

            const message =
                bouton.dataset.confirm ||
                "Voulez-vous vraiment continuer ?";

            const confirmation =
                window.confirm(message);

            if (!confirmation) {
                event.preventDefault();
            }

        });

    });


    // ==================================================
    // AFFICHAGE DES MESSAGES
    // ==================================================

    window.afficherMessage = function (
        elementId,
        message,
        type = "success"
    ) {

        const element =
            document.getElementById(elementId);

        if (!element) return;

        element.textContent = message;

        element.className =
            "form-message " + type;

        element.style.display = "block";

    };


    // ==================================================
    // EFFACER UN MESSAGE
    // ==================================================

    window.effacerMessage = function (elementId) {

        const element =
            document.getElementById(elementId);

        if (!element) return;

        element.textContent = "";

        element.style.display = "none";

    };


    // ==================================================
    // AFFICHER / MASQUER UN MOT DE PASSE
    // ==================================================

    const passwordButtons =
        document.querySelectorAll("[data-password-toggle]");

    passwordButtons.forEach(button => {

        button.addEventListener("click", () => {

            const inputId =
                button.dataset.passwordToggle;

            const input =
                document.getElementById(inputId);

            if (!input) return;

            if (input.type === "password") {

                input.type = "text";

                button.textContent = "🙈";

            } else {

                input.type = "password";

                button.textContent = "👁️";

            }

        });

    });


    // ==================================================
    // VALIDATION DES FORMULAIRES
    // ==================================================

    const forms =
        document.querySelectorAll("form");

    forms.forEach(form => {

        form.addEventListener("submit", event => {

            const champs =
                form.querySelectorAll(
                    "input[required], select[required], textarea[required]"
                );

            let valide = true;

            champs.forEach(champ => {

                if (!champ.value.trim()) {

                    valide = false;

                    champ.classList.add("input-error");

                } else {

                    champ.classList.remove("input-error");

                }

            });

            if (!valide) {

                event.preventDefault();

                console.log(
                    "Veuillez remplir tous les champs obligatoires."
                );

            }

        });

    });


    // ==================================================
    // SUPPRESSION AUTOMATIQUE DES ERREURS
    // ==================================================

    const inputs =
        document.querySelectorAll("input, textarea, select");

    inputs.forEach(input => {

        input.addEventListener("input", () => {

            input.classList.remove("input-error");

        });

    });


    // ==================================================
    // LIENS DE DÉCONNEXION
    // ==================================================

    const logoutButtons =
        document.querySelectorAll("[data-logout]");

    logoutButtons.forEach(button => {

        button.addEventListener("click", () => {

            // Firebase gère la vraie déconnexion
            // dans le fichier d'authentification.

            localStorage.removeItem("banqueFacileUser");

            window.location.href =
                "connexion.html";

        });

    });

});
