import { HeaderView } from "./ui/header/index.js";
import { MapView } from "./ui/map/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import './index.css';

let M = {};

M.getLycees = async function(){
    const lyceesData = Lycees.getAll();
    return lyceesData;
};

M.getCandidats = async function(){
    const candidatsData = Candidats.getAll();
    return candidatsData;
};

M.filterLyceesWithCandidatures = async function(lyceesData) {

    let candidatsData = await M.getCandidats(); 
    let lyceesAvecCandidatures = new Set();

    for (let candidat of candidatsData) {
        // Vérifier si le candidate contient un array Scolarite et si le premier élément contient une propriété UAIEtablissementorigine
        if (candidat.Scolarite && candidat.Scolarite[0] && candidat.Scolarite[0].UAIEtablissementorigine) {
            // Ajouter la valeur UAIEtablissementorigine à lyceesAvecCandidatures
            lyceesAvecCandidatures.add(candidat.Scolarite[0].UAIEtablissementorigine);
        }
    }

    return lyceesData.filter(lycee => lyceesAvecCandidatures.has(lycee.numero_uai));
};

M.countCandidaturesByLycee = async function(candidatsData) {

    let candidaturesParLycee = {};

    // Parcourir chaque candidat dans le tableau candidatsData
    candidatsData.forEach(candidat => {
        // Vérifier si le candidat ontient un array Scolarite
        if (candidat.Scolarite && Array.isArray(candidat.Scolarite)) {
  
            let uniqueUAIs = new Set();

            // Parcourir chaque scolarite dans l'array Scolarite
            candidat.Scolarite.forEach(scolarite => {
                // Ajouter la valeur UAIEtablissementorigine si existant
                if (scolarite.UAIEtablissementorigine) {
                    uniqueUAIs.add(scolarite.UAIEtablissementorigine);
                }
            });

            // Parcourur les valeurs UAIEtablissementorigine
            uniqueUAIs.forEach(uai => {
                // Si l'UAI n'existe pas
                if (!candidaturesParLycee[uai]) {
                    candidaturesParLycee[uai] = 0;
                }
                //Incrémenter la valeur si existant
                candidaturesParLycee[uai]++;
            });
        }
    });

  
    return candidaturesParLycee;
};



let C = {};

C.init = async function(){
    const lyceesData = await M.getLycees();
    V.init(lyceesData);
    //console.log(Candidats.getAll());
    //console.log(Lycees.getAll());
    return lyceesData;
}

let V = {
    header: document.querySelector("#header"),
    map: document.querySelector("#map")
};

V.init = function(lyceesData){
    V.renderHeader();
    V.renderMap(lyceesData);
}

V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}

V.renderMap = async function(lyceesData) {
    const candidatsData = await M.getCandidats();
    const lyceesAvecCandidatures = await M.filterLyceesWithCandidatures(lyceesData); 
    const candidaturesParLycee = await M.countCandidaturesByLycee(candidatsData); 
    V.map = MapView.render(lyceesAvecCandidatures, candidaturesParLycee);
};

C.init();