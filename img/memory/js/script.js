// === VARIABLES GLOBALES ===

const plateau = document.getElementById('plateau');
const boutonStart = document.getElementById('startbtn');
const boutonRejouer = document.getElementById('rejouerbtn');

const chronoRestant = document.getElementById('tempsrestant');
const chronoEcoule = document.getElementById('tempsecoule');
const compteurTrouvees = document.getElementById('pairetrouvees');
const compteurRestantes = document.getElementById('pairesrestantes');
const compteurRetournements = document.getElementById('retournees');
const zoneCartesTrouvees = document.getElementById('zone-cartes-trouvees');

const symboles = ['cerise', 'snake', 'poire', 'moto', 'voiture', 'de', 'laptop', 'pomme'];
let cartesMelangees = [];
let premiereCarte = null;
let deuxiemeCarte = null;
let verrouillage = false;
let gameOn = false;

let tempsTotal = 60;
let secondesRestantes = tempsTotal;
let chronoInterval;

let pairesTrouvees = 0;
const totalPaires = 8;
let nbRetournements = 0;


// === FONCTIONS ===

// Mélange
function melangerCartes() {
  cartesMelangees = [...symboles, ...symboles];
  for (let i = cartesMelangees.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartesMelangees[i], cartesMelangees[j]] = [cartesMelangees[j], cartesMelangees[i]];
  }
}

// Création des cartes
function creerCartes() {
  plateau.innerHTML = "";

  for (let i = 0; i < 16; i++) {
    const carte = document.createElement('div');
    carte.classList.add('carte');
    carte.setAttribute('data-symbole', cartesMelangees[i]);
    carte.innerHTML = '<img src="img/dos.png" alt="?" class="image-carte">';

    carte.addEventListener('click', function () {
      if (!gameOn || verrouillage || carte === premiereCarte) return;

      const symbole = carte.getAttribute('data-symbole');
      afficherImageCarte(carte, symbole);

      nbRetournements++;
      compteurRetournements.textContent = nbRetournements;

      if (!premiereCarte) {
        premiereCarte = carte;
        return;
      }

      deuxiemeCarte = carte;
      verrouillage = true;

      const symbole1 = premiereCarte.getAttribute('data-symbole');
      const symbole2 = deuxiemeCarte.getAttribute('data-symbole');

      if (symbole1 === symbole2) {
        premiereCarte.style.pointerEvents = "none";
        deuxiemeCarte.style.pointerEvents = "none";

        pairesTrouvees++;
        compteurTrouvees.textContent = pairesTrouvees;
        compteurRestantes.textContent = totalPaires - pairesTrouvees;

        afficherCarteTrouvee(symbole1);

        if (pairesTrouvees === totalPaires) {
          stopChrono();
          setTimeout(() => {
            alert("🎉 Bravo, vous avez trouvé toutes les paires !");
            afficherBoutonRejouer();
          }, 300);
        }

        resetCartes();
      } else {
        setTimeout(() => {
          carteFaceCachee(premiereCarte);
          carteFaceCachee(deuxiemeCarte);
          resetCartes();
        }, 1000);
      }
    });

    plateau.appendChild(carte);
  }
}

// Afficher l'image d'une carte retournée
function afficherImageCarte(carte, symbole) {
  carte.innerHTML = `<img src="img/${symbole}.png" alt="${symbole}" class="image-carte">`;
}

// Afficher le dos (carte cachée)
function carteFaceCachee(carte) {
  carte.innerHTML = '<img src="img/dos.png" alt="?" class="image-carte">';
}

// Ajouter une image dans la section "cartes trouvées"
function afficherCarteTrouvee(symbole) {
  const div = document.createElement('div');
  div.classList.add('trouvee');

  const img = document.createElement('img');
  img.src = `img/${symbole}.png`;
  img.alt = symbole;
  img.classList.add('image-trouvee');

  div.appendChild(img);
  zoneCartesTrouvees.appendChild(div);
}

// Réinitialisation des cartes
function resetCartes() {
  premiereCarte = null;
  deuxiemeCarte = null;
  verrouillage = false;
}

// Chronomètre
function lancerChrono() {
  secondesRestantes = tempsTotal;
  chronoRestant.textContent = secondesRestantes;
  chronoEcoule.textContent = 0;

  chronoInterval = setInterval(() => {
    secondesRestantes--;
    chronoRestant.textContent = secondesRestantes;
    chronoEcoule.textContent = tempsTotal - secondesRestantes;

    if (secondesRestantes <= 0) {
      clearInterval(chronoInterval);
      verrouillage = true;
      gameOn = false;
      setTimeout(() => {
        alert("⏱️ Temps écoulé ! Partie perdue.");
        afficherBoutonRejouer();
      }, 300);
    }
  }, 1000);
}

function stopChrono() {
  clearInterval(chronoInterval);
}

// Affichage du bouton "Rejouer"
function afficherBoutonRejouer() {
  boutonRejouer.style.display = "inline-block";
  boutonRejouer.disabled = false;
  boutonStart.style.display = "none";
}


// === ÉVÉNEMENTS ===

// Bouton Commencer
boutonStart.addEventListener('click', () => {
  if (gameOn) return;

  boutonStart.disabled = true;
  boutonStart.style.cursor = "not-allowed";
  boutonRejouer.style.display = "none";
  zoneCartesTrouvees.innerHTML = "";

  gameOn = true;
  verrouillage = false;
  pairesTrouvees = 0;
  nbRetournements = 0;

  compteurTrouvees.textContent = "0";
  compteurRestantes.textContent = totalPaires;
  compteurRetournements.textContent = "0";

  melangerCartes();
  creerCartes();
  lancerChrono();
});

// Bouton Rejouer
boutonRejouer.addEventListener('click', () => {
  boutonRejouer.disabled = true;
  boutonRejouer.style.display = "none";
  boutonStart.style.display = "inline-block";
  boutonStart.disabled = true;
  boutonStart.style.cursor = "not-allowed";
  zoneCartesTrouvees.innerHTML = "";

  gameOn = true;
  verrouillage = false;
  pairesTrouvees = 0;
  nbRetournements = 0;

  compteurTrouvees.textContent = "0";
  compteurRestantes.textContent = totalPaires;
  compteurRetournements.textContent = "0";

  melangerCartes();
  creerCartes();
  lancerChrono();
});
