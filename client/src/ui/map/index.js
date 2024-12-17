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
MapView.addMarkersForLycees = function (map, lyceesData, candidaturesParLycee) {
    const markers = L.markerClusterGroup({
        zoomToBoundsOnClick: false // Désactiver le zoom automatique sur les clusters
    });

    if (Array.isArray(lyceesData)) {
        lyceesData.forEach(lycee => {
            const latitude = parseFloat(lycee.latitude);
            const longitude = parseFloat(lycee.longitude); // Convertir les valeurs dans des nombres décimaux utilisables
            if (!isNaN(latitude) && !isNaN(longitude)) {
                const numeroUAI = lycee.numero_uai;

                const nombreCandidatures = candidaturesParLycee[numeroUAI] || { generale: 0, sti2d: 0, autres: 0 };
                const detailFiliere = nombreCandidatures || { generale: 0, sti2d: 0, autres: 0 };

                // Création du marqueur avec les informations détaillées
                const marker = L.marker([latitude, longitude])
                    .bindPopup(`
                        <b>${lycee.appellation_officielle}</b><br>
                        Candidatures totales: ${Object.values(detailFiliere).reduce((sum, val) => sum + val, 0)}<br>
                        Générale: ${detailFiliere.generale}<br>
                        STI2D: ${detailFiliere.sti2d}<br>
                        Autre: ${detailFiliere.autres}
                    `); // Afficher les détails par filière

                marker.candidaturesFiliere = detailFiliere; // Ajouter le détail des candidatures par filière à l'objet marker
                markers.addLayer(marker);
            }
        });
    }

    markers.on('clusterclick', function (event) {
        const cluster = event.propagatedFrom;
        let totalCandidaturesGenerale = 0;
        let totalCandidaturesSTI2D = 0;
        let totalCandidaturesAutres = 0;

        cluster.getAllChildMarkers().forEach(marker => {
            totalCandidaturesGenerale += marker.candidaturesFiliere.generale || 0;
            totalCandidaturesSTI2D += marker.candidaturesFiliere.sti2d || 0;
            totalCandidaturesAutres += marker.candidaturesFiliere.autres || 0;
        });

        cluster.bindPopup(`
            Total Candidatures: ${totalCandidaturesGenerale + totalCandidaturesSTI2D + totalCandidaturesAutres}<br>
            Détails par filière:<br>
            Générale: ${totalCandidaturesGenerale}<br>
            STI2D: ${totalCandidaturesSTI2D}<br>
            Autre: ${totalCandidaturesAutres}
        `).openPopup();
    });

    map.addLayer(markers);
};

export { MapView };