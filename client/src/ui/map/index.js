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

                // Récupérer les candidatures pour ce lycée
                const stats = totalCandidats[numeroUAI] || { total: 0, generale: 0, sti2d: 0, autre: 0 };

                // Création du marqueur avec les informations détaillées
                const marker = L.marker([latitude, longitude])
                    .bindPopup(`
                        <b>${lycee.appellation_officielle}</b><br>
                        <b>Nombre total de candidatures:</b> ${stats.total}<br>
                        <b>Détails par filière:</b><br>
                        - Générale: ${stats.generale}<br>
                        - STI2D: ${stats.sti2d}<br>
                        - Autre: ${stats.autre}
                    `); // Afficher les détails par filière pour ce lycée

                // Ajouter les statistiques au marqueur
                marker.stats = stats;

                markers.addLayer(marker);
            }
        });
    }

    // Ajouter un événement pour gérer le clic sur un cluster
    markers.on('clusterclick', function (event) {
        const cluster = event.layer;
        let totalCandidaturesCluster = 0;
        let totalGenerale = 0;
        let totalSTI2D = 0;
        let totalAutre = 0;

        // Calculer les totaux des candidatures dans le cluster
        cluster.getAllChildMarkers().forEach(marker => {
            totalCandidaturesCluster += marker.stats.total || 0;
            totalGenerale += marker.stats.generale || 0;
            totalSTI2D += marker.stats.sti2d || 0;
            totalAutre += marker.stats.autre || 0;
        });

        // Afficher le total des candidatures dans le cluster
        cluster.bindPopup(`
            <b>Nombre total de candidatures:</b> ${totalCandidaturesCluster}<br>
            <b>Détails par filière:</b><br>
            - Générale: ${totalGenerale}<br>
            - STI2D: ${totalSTI2D}<br>
            - Autre: ${totalAutre}
        `).openPopup();
    });

    map.addLayer(markers);
};

export { MapView };