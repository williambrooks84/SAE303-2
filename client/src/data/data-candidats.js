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
            index[uai] = 0;
        }
        index[uai]++;
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
    return index;
};

export { Candidats };