import { Postaux } from "./data-postaux.js";

let data = await fetch("./src/data/json/candidatures.json");
data = await data.json();

let Candidats = {}

Candidats.getAll = function(){
    return data;
}

Candidats.uaiSearch = function(numero_uai) {
    let count = 0;
    for (let candidat of data) {
        if (candidat.Scolarite[0].UAIEtablissementorigine === numero_uai) {
            count++;
        }
    }
    return count;
}

Candidats.getTotalCandidatesByLycee = function() {
    let index = {};
    for (let candidat of data) {
        let uai = candidat.Scolarite[0].UAIEtablissementorigine;
        if (!index[uai]) {
            index[uai] = { total: 0, generale: 0, sti2d: 0, autre: 0 };
        }
        index[uai].total++;
        let filiere = candidat.Baccalaureat.SerieDiplomeLibelle;
        if (filiere === "Série Générale") {
            index[uai].generale++;
        } else if (filiere === "Sciences et Technologies de l'Industrie et du Développement Durable") {
            index[uai].sti2d++;
        } else {
            index[uai].autre++;
        }
    }
    return index;
}

Candidats.getPostBacs = function() {
    let postBacs = [];
    for (let candidat of data) {
        if (candidat.Baccalaureat.TypeDiplomeLibelle == "Baccalauréat obtenu") {
            postBacs.push(candidat);
        }
    }
    return postBacs;
}

Candidats.getPostBacsByDepartment = function() {
    let index = {};
    let postBacs = Candidats.getPostBacs();
    for (let candidate of postBacs) {
        // Fallback for the codePostal
        let codePostal = candidate.Scolarite?.[0]?.CommuneEtablissementOrigineCodePostal || 
                         candidate.Scolarite?.[1]?.CommuneEtablissementOrigineCodePostal;
        if (codePostal) {
            let departement = codePostal.slice(0, 2);
            if (!index[departement]) {
                index[departement] = 0;
            }
            index[departement]++;
        }
    }

    // Associate with departments from Postaux
    let departments = Postaux.getDepartements();
    let result = [];
    for (let dept of departments) {
        let deptCode = dept.code_postal.slice(0, 2);
        result.push({
            deptCode: deptCode,
            ...dept,
            postBacs: index[deptCode] || 0
        });
    }

    // Exclude departments with 0 postBacs
    result = result.filter(dept => dept.postBacs > 0);

    return result;
};

export { Candidats };