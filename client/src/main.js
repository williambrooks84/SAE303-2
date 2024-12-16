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
    let candidatsData = await M.getCandidats(); // Assurez-vous que les candidats sont chargés ici
    let lyceesAvecCandidatures = new Set();
    
    for (let candidat of candidatsData) {
        if (candidat.Scolarite && candidat.Scolarite[0] && candidat.Scolarite[0].UAIEtablissementorigine) {
            lyceesAvecCandidatures.add(candidat.Scolarite[0].UAIEtablissementorigine);
        }
    }

    return lyceesData.filter(lycee => lyceesAvecCandidatures.has(lycee.numero_uai)); // Retourne directement le tableau filtré
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
    console.log('Lycées Data:', lyceesData);
    const lyceesAvecCandidatures = await M.filterLyceesWithCandidatures(lyceesData); // Await ici
    console.log('Filtered Lycées with candidatures:', lyceesAvecCandidatures);
    V.map = MapView.render(lyceesAvecCandidatures); 
};


C.init();