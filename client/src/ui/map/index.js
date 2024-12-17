import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

let MapView = {};

MapView.render = function(lyceesData, candidaturesParLycee) {
    const map = L.map('map').setView([45.83, 1.26], 6);  // Coordonnées de Limoges, zoom initial à l'échelle de la France

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    MapView.addMarkersForLycees(map, lyceesData, candidaturesParLycee); // Ajouter les pointeurs sur la carte

    return map;
};

MapView.addMarkersForLycees = function(map, lyceesData, candidaturesParLycee) {
    const markers = L.markerClusterGroup({
        zoomToBoundsOnClick: false // Désactiver le zoom automatique sur les clusters
    });

    if (Array.isArray(lyceesData)) {
        lyceesData.forEach(lycee => {
            const latitude = parseFloat(lycee.latitude);
            const longitude = parseFloat(lycee.longitude); // Convertir les valeurs dans des nombres décimaux utilisables
            if (!isNaN(latitude) && !isNaN(longitude)) {
                const nombreCandidatures = candidaturesParLycee[lycee.numero_uai] || 0;
                const marker = L.marker([latitude, longitude])
                    .bindPopup(`<b>${lycee.appellation_officielle}</b><br>Candidatures: ${nombreCandidatures}`); // Afficher la bulle
                marker.candidatures = nombreCandidatures; // Ajouter le nombre de candidatures à l'objet marker
                markers.addLayer(marker);
            }
        });
    }

    markers.on('clusterclick', function(event) {
        const cluster = event.propagatedFrom;
        let totalCandidatures = 0;

        cluster.getAllChildMarkers().forEach(marker => {
            totalCandidatures += marker.candidatures;
        });

        cluster.bindPopup(`Total Candidatures: ${totalCandidatures}`).openPopup();
    });

    map.addLayer(markers);
};

export { MapView };