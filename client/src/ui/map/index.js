import L from 'leaflet';

let MapView = {};

MapView.render = function() {
    const map = L.map('map').setView([45.83, 1.26], 13);  // Coordonnées de Limoges

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return map;
};

export {MapView};