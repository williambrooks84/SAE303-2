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

    result = result.filter(dept => dept.postBacs > 0);

    return result;
};

// Fonction pour fusionner les données de candidats par département
Candidats.getTotalCandidatsByDepartment = function(seuil) {
    let index = {};
    let postBacs = Candidats.getPostBacsByDepartment();
    
    for (let candidate of data) {
        let uai = candidate.Scolarite?.[0]?.UAIEtablissementorigine; 
        let codePostal = candidate.Scolarite?.[0]?.CommuneEtablissementOrigineCodePostal || 
                         candidate.Scolarite?.[1]?.CommuneEtablissementOrigineCodePostal;

        if (codePostal && uai) {
            let deptCode = codePostal.slice(0, 2); 
            if (!index[deptCode]) {
                index[deptCode] = { total: 0, generale: 0, sti2d: 0, autre: 0, postBacs: 0 };
            }
            index[deptCode].total++;
            let filiere = candidate.Baccalaureat.SerieDiplomeLibelle;
            if (filiere === "Série Générale") {
                index[deptCode].generale++;
            } else if (filiere === "Sciences et Technologies de l'Industrie et du Développement Durable") {
                index[deptCode].sti2d++;
            } else {
                index[deptCode].autre++;
            }
        }
    }

    for (let deptData of postBacs) {
        if (index[deptData.deptCode]) {
            index[deptData.deptCode].postBacs += deptData.postBacs; 
            index[deptData.deptCode].total += deptData.postBacs; // Add postBacs to total
        }
    }

    let departments = Postaux.getDepartements();
    let result = [];
    let autresDepartements = { department: "Autres départements", total: 0, generale: 0, sti2d: 0, autre: 0, postBacs: 0 };

    for (let dept of departments) {
        let deptCode = dept.code_postal.slice(0, 2);
        let deptData = {
            department: deptCode,
            ...dept,
            total: index[deptCode]?.total || 0,
            generale: index[deptCode]?.generale || 0,
            sti2d: index[deptCode]?.sti2d || 0,
            autre: index[deptCode]?.autre || 0,
            postBacs: index[deptCode]?.postBacs || 0
        };

        if (deptData.total < seuil) {
            autresDepartements.total += deptData.total;
            autresDepartements.generale += deptData.generale;
            autresDepartements.sti2d += deptData.sti2d;
            autresDepartements.autre += deptData.autre;
            autresDepartements.postBacs += deptData.postBacs;
        } else {
            result.push(deptData);
        }
    }

    if (autresDepartements.total > 0) {
        result.push(autresDepartements);
    }

    result = result.filter(dept => dept.total > 0);

    result.sort((a, b) => a.total - b.total);

    return result;
};

export { Candidats };