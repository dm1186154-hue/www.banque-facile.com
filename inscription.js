import {
  auth,
  db,
  createUserWithEmailAndPassword,
  doc,
  setDoc
} from "./firebase.js";

const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.querySelector("#nom").value.trim();
    const email = document.querySelector("#email").value.trim();
    const telephone = document.querySelector("#telephone").value.trim();
    const password = document.querySelector("#password").value;
    const confirmation = document.querySelector("#confirmation").value;

    if (!nom || !email || !telephone || !password || !confirmation) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmation) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const utilisateur = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(
        doc(db, "utilisateurs", utilisateur.user.uid),
        {
          nom: nom,
          email: email,
          telephone: telephone,
          dateCreation: new Date().toISOString()
        }
      );

      alert("Compte Banque Facile créé avec succès !");

      window.location.href = "connexion.html";

    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        alert("Cette adresse e-mail est déjà utilisée.");
      } else if (error.code === "auth/invalid-email") {
        alert("Adresse e-mail invalide.");
      } else if (error.code === "auth/weak-password") {
        alert("Le mot de passe doit contenir au moins 6 caractères.");
      } else {
        alert("Erreur lors de la création du compte : " + error.message);
      }
    }
  });
}
