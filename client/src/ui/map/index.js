import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

const MapView = {};

// Fonction pour afficher la carte
MapView.render = function (lyceesData, candidaturesParLycee) {
    const map = L.map('map').setView([45.83, 1.26], 6);  // Coordonnées de Limoges, zoom initial à l'échelle de la France

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajouter les marqueurs
    MapView.addMarkersForLycees(map, lyceesData, candidaturesParLycee);

    return map;
};

// Fonction pour ajouter les marqueurs sur la carte
MapView.addMarkersForLycees = function (map, lyceesData, totalCandidats) {
    const markers = L.markerClusterGroup({
        zoomToBoundsOnClick: false // Désactiver le zoom automatique sur les clusters
    });

    if (Array.isArray(lyceesData)) {
        lyceesData.forEach(lycee => {
            const latitude = parseFloat(lycee.latitude);
            const longitude = parseFloat(lycee.longitude); // Convertir les valeurs dans des nombres décimaux utilisables
            if (!isNaN(latitude) && !isNaN(longitude)) {
                const numeroUAI = lycee.numero_uai;

                // Récupérer le total des candidatures pour ce lycée
                const total = totalCandidats[numeroUAI] || 0;

                // Création du marqueur avec les informations
                const marker = L.marker([latitude, longitude])
                    .bindPopup(`
                        <b>${lycee.appellation_officielle}</b><br>
                        Nombre de candidatures: ${total}
                    `); // Afficher les détails totaux pour ce lycée

                // Ajouter le nombre de candidatures au marqueur
                marker.totalCandidatures = total;

                markers.addLayer(marker);
            }
        });
    }

    // Ajouter un événement pour gérer le clic sur un cluster
    markers.on('clusterclick', function (event) {
        const cluster = event.layer;
        let totalCandidaturesCluster = 0;

        // Calculer le total des candidatures dans le cluster
        cluster.getAllChildMarkers().forEach(marker => {
            totalCandidaturesCluster += marker.totalCandidatures || 0;
        });

        // Afficher le total des candidatures dans le cluster
        cluster.bindPopup(`
            Nombre de candidatures: ${totalCandidaturesCluster}
        `).openPopup();
    });

    map.addLayer(markers);
};

export { MapView };