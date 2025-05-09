// Fonction pour générer un mot de passe
function generatePassword() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    const length = 12; // Longueur du mot de passe

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    document.getElementById("password").value = password;
}

// Fonction pour copier le mot de passe
function copyPassword() {
    const passwordField = document.getElementById("password");

    if (passwordField.value === "") {
        alert("Aucun mot de passe à copier !");
        return;
    }

    passwordField.select();
    document.execCommand("copy");

    // Changer temporairement le texte du bouton
    const copyBtn = document.getElementById("copy-btn");
    copyBtn.textContent = "✅";
    setTimeout(() => (copyBtn.textContent = "📋"), 1000);

    // Afficher une alerte pour informer l'utilisateur
    alert("Mot de passe copié !");
}

// Ajouter les événements aux boutons
document.getElementById("generate-btn").addEventListener("click", generatePassword);
document.getElementById("copy-btn").addEventListener("click", copyPassword);
