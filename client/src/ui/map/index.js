import L from 'leaflet';

let MapView = {};

MapView.render = function(lyceesData) {
    const map = L.map('map').setView([45.83, 1.26], 13);  // Coordonnées de Limoges

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    MapView.addMarkersForLycees(map, lyceesData);

    return map;
};

MapView.addMarkersForLycees = function(map, lyceesData) {
    if (Array.isArray(lyceesData)) {
        lyceesData.forEach(lycee => {
            // Convertir latitude et longitude en nombres utilisables
            const latitude = parseFloat(lycee.latitude);
            const longitude = parseFloat(lycee.longitude);
            if (!isNaN(latitude) && !isNaN(longitude)) {  // Vérifier si les valeurs sont des nombres valides
                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup(`<b>${lycee.appellation_officielle}</b><br>${lycee.adresse_uai}`);
            }
        });
    }
};


export {MapView};