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
    let candidatsData = await M.getCandidats(); // Assurez-vous que cette fonction retourne les données des candidats
    let lyceesAvecCandidatures = new Set();

    // Récupération des UAI avec candidatures pour l'année la plus récente
    for (let candidat of candidatsData) {
        if (candidat.Scolarite && Array.isArray(candidat.Scolarite)) {
            // Trouver l'année la plus récente
            let scolariteRecente = candidat.Scolarite.reduce((mostRecent, current) => {
                return (!mostRecent || current.AnneeScolaireLibelle > mostRecent.AnneeScolaireLibelle) 
                    ? current 
                    : mostRecent;
            }, null);

            // Ajouter le lycée d'origine si disponible
            if (scolariteRecente && scolariteRecente.UAIEtablissementorigine) {
                lyceesAvecCandidatures.add(scolariteRecente.UAIEtablissementorigine);
            }
        }
    }

    // Trier par ordre alphabétique
    let sortedLyceesAvecCandidatures = Array.from(lyceesAvecCandidatures).sort();

    console.log(`Lycees avec candidatures toutes années confondues (UAI triés) : `, sortedLyceesAvecCandidatures);
    console.log(`Nombre de lycées avec candidatures toutes années confondues : `, sortedLyceesAvecCandidatures.length);

    // Utilisation de binarySearch avec lyceesData
    return sortedLyceesAvecCandidatures
        .map(numero_uai => Lycees.binarySearch(numero_uai, lyceesData)) // Passer lyceesData ici
        .filter(lycee => lycee !== undefined); // Exclure les lycées non trouvés
};

M.countCandidaturesByLycee = async function(candidatsData) {
    let candidaturesParLycee = {};

    // Parcourir chaque candidat
    candidatsData.forEach(candidat => {
        if (candidat.Scolarite && Array.isArray(candidat.Scolarite)) {
            // Trouver l'année la plus récente
            let scolariteRecente = candidat.Scolarite.reduce((mostRecent, current) => {
                return (!mostRecent || current.AnneeScolaireLibelle > mostRecent.AnneeScolaireLibelle) 
                    ? current 
                    : mostRecent;
            }, null);

            // Mettre à jour le nombre de candidatures par UAI
            if (scolariteRecente && scolariteRecente.UAIEtablissementorigine) {
                let uai = scolariteRecente.UAIEtablissementorigine;

                if (!candidaturesParLycee[uai]) {
                    candidaturesParLycee[uai] = 0;
                }
                candidaturesParLycee[uai]++;
            }
        }
    });

    console.log(`Candidatures par lycée toutes années confondues:`, candidaturesParLycee);

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