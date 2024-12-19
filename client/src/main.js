import { HeaderView } from "./ui/header/index.js";
import { MapView } from "./ui/map/index.js";
import { BarView } from "./ui/bar/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import { Postaux } from "./data/data-postaux.js";
import './index.css';

let M = {
    candidats: Candidats,
    lycees: Lycees,
    postaux: Postaux
};

let C = {};

C.init = async function(){
    let lyceesData = M.lycees.getAll();
    let totalCandidats = M.candidats.getTotalCandidatesByLycee();
    let postBacsByDepartment = M.candidats.getPostBacsByDepartment();
    let totalCandidatsByDepartment = M.candidats.getTotalCandidatsByDepartment();
    V.init(lyceesData, totalCandidats, postBacsByDepartment, totalCandidatsByDepartment);
    //console.log(Candidats.getAll());
    //console.log(Lycees.getAll());
    //console.log(totalCandidats);
    //console.log(postBacsByDepartment);
}

let V = {
    header: document.querySelector("#header"),
    map: document.querySelector("#map"),
    bar: document.querySelector("#bar")
};

V.init = function(lyceesData, totalCandidats, postBacsByDepartment, totalCandidatsByDepartment){
    V.renderHeader();
    V.renderMap(lyceesData, totalCandidats, postBacsByDepartment);
    V.renderBar(totalCandidatsByDepartment);
}

V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}

V.renderMap = async function(lyceesData, totalCandidats, postBacsByDepartment){ 
    // Affichage de la carte avec les données
    V.map = MapView.render(lyceesData, totalCandidats, postBacsByDepartment);
};

V.renderBar = async function(totalCandidatsByDepartment){
    // Affichage du graphique
    V.bar = BarView.render("barchart", totalCandidatsByDepartment);
}

C.init();