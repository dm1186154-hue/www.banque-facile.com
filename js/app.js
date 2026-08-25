// =====================================================
// BANQUE FACILE
// Fonctions générales
// =====================================================


// Année automatique dans les pieds de page

const currentYear =
    new Date().getFullYear();


document
    .querySelectorAll(".footer-bottom p")
    .forEach(function (element) {

        element.textContent =
            element.textContent.replace(
                "2026",
                currentYear
            );

    });


// ================= CONTACT =================

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const result =
                document.getElementById("contactResult");


            result.textContent =
                "Votre message a été enregistré.";

            contactForm.reset();

        }
    );
}
