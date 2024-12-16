import L from 'leaflet';

let MapView = {};

MapView.render = function(lyceesData, candidaturesParLycee) {
    const map = L.map('map').setView([45.83, 1.26], 13);  // Coordonnées de Limoges

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    MapView.addMarkersForLycees(map, lyceesData, candidaturesParLycee); //Ajouter les pointeurs sur la carte

    return map;
};

MapView.addMarkersForLycees = function(map, lyceesData, candidaturesParLycee) {
    if (Array.isArray(lyceesData)) {
        lyceesData.forEach(lycee => {
            const latitude = parseFloat(lycee.latitude);
            const longitude = parseFloat(lycee.longitude); //Convertir les valeurs dans des nombres décimaux utilisables
            if (!isNaN(latitude) && !isNaN(longitude)) {
                const nombreCandidatures = candidaturesParLycee[lycee.numero_uai] || 0;
                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup(`<b>${lycee.appellation_officielle}</b><br>Candidatures: ${nombreCandidatures}`); //Afficher la bulle
            }
        });
    }
};


export {MapView};