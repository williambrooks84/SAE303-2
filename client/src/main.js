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
        if (candidat.Scolarite && Array.isArray(candidat.Scolarite)) {
            let scolariteRecente = candidat.Scolarite.reduce((mostRecent, current) => {
                return (!mostRecent || current.AnneeScolaireLibelle > mostRecent.AnneeScolaireLibelle) 
                    ? current 
                    : mostRecent;
            }, null);

            if (scolariteRecente && scolariteRecente.UAIEtablissementorigine) {
                lyceesAvecCandidatures.add(scolariteRecente.UAIEtablissementorigine);
            }
        }
    }

    let sortedLyceesAvecCandidatures = Array.from(lyceesAvecCandidatures).sort();
    return sortedLyceesAvecCandidatures
        .map(numero_uai => Lycees.binarySearch(numero_uai, lyceesData))
        .filter(lycee => lycee !== undefined);
};

M.countCandidaturesByLycee = async function(candidatsData) {
    let candidaturesParLycee = {};

    candidatsData.forEach(candidat => {
        if (candidat.Scolarite && Array.isArray(candidat.Scolarite)) {
            // Trouver l'année la plus récente
            let scolariteRecente = candidat.Scolarite.reduce((mostRecent, current) => {
                return (!mostRecent || current.AnneeScolaireLibelle > mostRecent.AnneeScolaireLibelle) 
                    ? current 
                    : mostRecent;
            }, null);

            if (scolariteRecente && scolariteRecente.UAIEtablissementorigine) {
                let uai = scolariteRecente.UAIEtablissementorigine;

                // Normaliser la série de baccalauréat
                let serieDiplomeCode = candidat.Baccalaureat?.SerieDiplomeCode
                    ?.toLowerCase()                             // Convertir en minuscules
                    .normalize("NFD")                          // Décomposer les accents
                    .replace(/[\u0300-\u036f]/g, '') || 'autres'; // Enlever les accents et fallback sur 'autres'

                // Initialiser les compteurs si l'UAI n'existe pas encore
                if (!candidaturesParLycee[uai]) {
                    candidaturesParLycee[uai] = { generale: 0, sti2d: 0, autres: 0 };
                }

                // Incrémenter les compteurs selon la série de diplôme
                if (serieDiplomeCode === 'generale') {
                    candidaturesParLycee[uai].generale++;
                } else if (serieDiplomeCode === 'sti2d') {
                    candidaturesParLycee[uai].sti2d++;
                } else {
                    candidaturesParLycee[uai].autres++;
                }
            }
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

V.init = function(lyceesData, candidatsData){
    V.renderHeader();
    V.renderMap(lyceesData, candidatsData);
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