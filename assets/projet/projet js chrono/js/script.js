// Variables
var sp, btn_start, btn_stop, t, ms, s, mn, h;
var btn_theme;

// Initialisation des variables
window.onload = function () {
    sp = document.getElementsByTagName('span');
    btn_start = document.getElementById('start');
    btn_stop = document.getElementById('stop');
    btn_theme = document.getElementById('toggle-theme');
    t;
    ms = 0, s = 0, mn = 0, h = 0;

    // Appliquer le mode enregistré
    loadTheme();
}

// Fonction compteur
function update_chrono() {
    ms += 1;
    if (ms == 10) {
        ms = 0;
        s += 1;
    }
    if (s == 60) {
        s = 0;
        mn += 1;
    }
    if (mn == 60) {
        mn = 0;
        h += 1;
    }

    // Mise à jour de l'affichage
    sp[0].innerHTML = h + " h";
    sp[1].innerHTML = mn + " min";
    sp[2].innerHTML = s + " s";
    sp[3].innerHTML = ms + " ms";
}

// Fonction Start
function start() {
    t = setInterval(update_chrono, 100);
    btn_start.disabled = true;
}

// Fonction Stop
function stop() {
    clearInterval(t);
    btn_start.disabled = false;
}

// Fonction Reset
function reset() {
    clearInterval(t);
    btn_start.disabled = false;
    ms = 0, s = 0, mn = 0, h = 0;
    sp[0].innerHTML = "0 h";
    sp[1].innerHTML = "0 min";
    sp[2].innerHTML = "0 s";
    sp[3].innerHTML = "0 ms";
}

// Fonction pour basculer entre mode clair et sombre
function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    // Vérifier et changer l'icône du bouton
    if (document.body.classList.contains("dark-mode")) {
        btn_theme.innerHTML = "☀️ Mode clair";
        localStorage.setItem("theme", "dark");
    } else {
        btn_theme.innerHTML = "🌙 Mode sombre";
        localStorage.setItem("theme", "light");
    }
}

// Ajouter l'événement au bouton mode
document.getElementById("toggle-theme").addEventListener("click", toggleTheme);
