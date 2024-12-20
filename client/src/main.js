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
    let seuil = parseFloat(sliderBar.getAttribute('value'));
    let rayon = parseFloat(sliderMap.getAttribute('value'));

    // Vérifiez les valeurs initiales
    if (isNaN(seuil) || seuil <= 0) seuil = 170; // Seuil par défaut
    if (isNaN(rayon) || rayon <= 0) rayon = 50;  // Rayon par défaut

    // Initialisation des données pour la carte et le graphique
    let lyceesData = M.lycees.getAll();
    let totalCandidats = M.candidats.getTotalCandidatesByLycee();
    let postBacsByDepartment = M.candidats.getPostBacsByDepartment();
    let totalCandidatsByDepartment = M.candidats.getTotalCandidatsByDepartment(seuil);

    // Écouteurs pour les sliders
    sliderBar.addEventListener('change', async function () {
        seuil = this.value;
        if (isNaN(seuil) || seuil <= 0) seuil = 170;

        let totalCandidatsByDepartment = M.candidats.getTotalCandidatsByDepartment(seuil);
        V.renderBar(totalCandidatsByDepartment);
    });

    sliderMap.addEventListener('change', async function () {
      rayon = parseFloat(this.value);
  
      // Ensure the radius value is valid
      if (isNaN(rayon) || rayon <= 0) rayon = 50;
  
      // Update map view with the new radius
      let totalCandidats = M.candidats.getTotalCandidatesByLycee();
      V.renderMap(lyceesData, totalCandidats, postBacsByDepartment, rayon);
  
      // Recalculate the department data based on the new radius
      let totalCandidatsByDepartment = M.candidats.getTotalCandidatsByDepartment(seuil);
  
      // Update the bar chart with the new data
      V.renderBar(totalCandidatsByDepartment);
  });

    console.log(rayon);

    // Appel à l'initialisation de la vue avec les valeurs récupérées
    V.init(lyceesData, totalCandidats, postBacsByDepartment, totalCandidatsByDepartment, rayon);
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
  V.renderBar(totalCandidatsByDepartment);
};

V.renderHeader = function () {
  V.header.innerHTML = HeaderView.render();
  
};

V.renderMap = async function (lyceesData, totalCandidats, postBacsByDepartment, rayon) {
  // Affichage de la carte avec les données
  V.map = MapView.render(lyceesData, totalCandidats, postBacsByDepartment, rayon);
};

V.renderBar = async function (totalCandidatsByDepartment) {
  // Affichage du graphique
  V.bar = BarView.render("barchart", totalCandidatsByDepartment);
};

C.init();
