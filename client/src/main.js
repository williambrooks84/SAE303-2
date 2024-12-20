import { HeaderView } from "./ui/header/index.js";
import { MapView } from "./ui/map/index.js";
import { BarView } from "./ui/bar/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import { Postaux } from "./data/data-postaux.js";
import "./index.css";

let M = {
  candidats: Candidats,
  lycees: Lycees,
  postaux: Postaux,
};

let C = {};

C.init = async function () {
  // Référence aux sliders
  let sliderBar = document.getElementById('sliderbar');
  let sliderMap = document.getElementById('slidermap');

  // Récupérer les valeurs par défaut définies dans le HTML
  let seuil = parseFloat(sliderBar.value);  // On utilise 'value' directement
  let rayon = parseFloat(sliderMap.value);   // On utilise 'value' directement

  // Vérifiez les valeurs initiales
  if (isNaN(seuil) || seuil <= 0) seuil = 170; // Seuil par défaut
  if (isNaN(rayon) || rayon <= 0) rayon = 50;  // Rayon par défaut

  // Initialisation des données pour la carte et le graphique
  let lyceesData = M.lycees.getAll();
  let totalCandidats = M.candidats.getTotalCandidatesByLycee();
  let postBacsByDepartment = M.candidats.getPostBacsByDepartment();
  let totalCandidatsByDepartment = M.candidats.getTotalCandidatsByDepartment(seuil);

  // Appel à l'initialisation de la vue avec les valeurs récupérées
  V.init(lyceesData, totalCandidats, postBacsByDepartment, totalCandidatsByDepartment, rayon);

  // Écouteurs pour les sliders
  sliderBar.addEventListener('change', async function () {
      seuil = parseFloat(this.value);
      if (isNaN(seuil) || seuil <= 0) seuil = 170;

      // Mettre à jour les données
      totalCandidatsByDepartment = M.candidats.getTotalCandidatsByDepartment(seuil);

      // Met à jour la barre
      V.renderBar(totalCandidatsByDepartment);
  });

  sliderMap.addEventListener('change', async function () {
      rayon = parseFloat(this.value);
      if (isNaN(rayon) || rayon <= 0) rayon = 50;

      // Met à jour la carte
      let totalCandidats = M.candidats.getTotalCandidatesByLycee();
      V.renderMap(lyceesData, totalCandidats, postBacsByDepartment, rayon);

      // Met à jour la barre
      totalCandidatsByDepartment = M.candidats.getTotalCandidatsByDepartment(seuil);
      V.renderBar(totalCandidatsByDepartment);
  });

  // Initialisation du graphique Bar sur le chargement
  V.renderBar(totalCandidatsByDepartment);  // Assurer que le graphique s'affiche au chargement avec les valeurs par défaut
};


let V = {
  header: document.querySelector("#header"),
  map: document.querySelector("#map"),
  bar: document.querySelector("#bar"),
};

V.init = function (lyceesData, totalCandidats, postBacsByDepartment, totalCandidatsByDepartment, rayon
) {
  V.renderHeader();
  V.renderMap(lyceesData, totalCandidats, postBacsByDepartment, rayon);
  V.renderBar(totalCandidatsByDepartment, rayon);
};

V.renderHeader = function () {
  V.header.innerHTML = HeaderView.render();
  
};

V.renderMap = async function (lyceesData, totalCandidats, postBacsByDepartment, rayon) {
  // Affichage de la carte avec les données
  V.map = MapView.render(lyceesData, totalCandidats, postBacsByDepartment, rayon);
};

V.renderBar = async function (totalCandidatsByDepartment, rayon) {
  // Affichage du graphique
  V.bar = BarView.render("barchart", totalCandidatsByDepartment, rayon);
};

C.init();