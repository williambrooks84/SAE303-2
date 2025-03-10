import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

const MapView = {};

// Fonction pour afficher la carte
MapView.render = function (lyceesData, candidaturesParLycee, postBacsData) {
    const map = L.map('map').setView([45.83, 1.26], 6); // Coordonnées de Limoges, zoom initial à l'échelle de la France

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Ajouter les marqueurs pour les lycées
    MapView.addMarkersForLycees(map, lyceesData, candidaturesParLycee);

    // Ajouter les marqueurs pour les établissements post-bac
    MapView.addMarkersForPostBacs(map, postBacsData);

    return map;
};

// Fonction pour ajouter les marqueurs des lycées sur la carte
MapView.addMarkersForLycees = function (map, lyceesData, totalCandidats) {
    const markers = L.markerClusterGroup({
        zoomToBoundsOnClick: false, // Désactiver le zoom automatique sur les clusters
        spiderfyOnMaxZoom: true, // Ouvrir les marqueurs individuellement lors d'un zoom élevé
        showCoverageOnHover: false // Ne pas afficher la couverture au survol
    });

    if (Array.isArray(lyceesData)) {
        lyceesData.forEach(lycee => {
            const latitude = parseFloat(lycee.latitude);
            const longitude = parseFloat(lycee.longitude); // Convertir les valeurs en nombres décimaux utilisables
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

    // Ajouter l'écouteur d'événement pour les clusters
    markers.on('clusterclick', function (event) {
        const cluster = event.propagatedFrom;
        const clusterMarkers = cluster.getAllChildMarkers(); // Récupérer les marqueurs contenus dans le cluster

        let totalStats = { total: 0, generale: 0, sti2d: 0, autre: 0 };

        clusterMarkers.forEach(marker => {
            const markerStats = marker.stats; // Récupérer les stats associées au marqueur
            totalStats.total += markerStats.total;
            totalStats.generale += markerStats.generale;
            totalStats.sti2d += markerStats.sti2d;
            totalStats.autre += markerStats.autre;
        });

        // Afficher les totaux dans le popup du cluster
        cluster.bindPopup(`
            <b>Total de candidatures:</b><br>
            - Total: ${totalStats.total}<br>
            - Générale: ${totalStats.generale}<br>
            - STI2D: ${totalStats.sti2d}<br>
            - Autre: ${totalStats.autre}
        `).openPopup(); // Ouvrir le popup du cluster
    });

    map.addLayer(markers);
};

// Fonction pour ajouter les marqueurs des établissements post-bac sur la carte
MapView.addMarkersForPostBacs = function (map, postBacsData) {
    const markers = L.markerClusterGroup({
        zoomToBoundsOnClick: false, // Désactiver le zoom automatique sur les clusters
        spiderfyOnMaxZoom: true, // Permet l'affichage des popups pour chaque marqueur lorsque le zoom est au max
        showCoverageOnHover: false // Ne pas afficher le contenu des clusters au survol
    });

    if (Array.isArray(postBacsData)) {
        postBacsData.forEach(postBac => {
            const latitude = parseFloat(postBac.lat);
            const longitude = parseFloat(postBac.lng);
            if (!isNaN(latitude) && !isNaN(longitude)) {
                const postBacsCount = postBac.postBacs || 0;

                const redIcon = new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                const marker = L.marker([latitude, longitude], { icon: redIcon })
                    .bindPopup(`
                        <b>Département:</b> ${postBac.deptCode}<br>
                        <b>Nombre de candidatures post-bac:</b> ${postBacsCount}
                    `);

                markers.addLayer(marker);
            }
        });
    }

    map.addLayer(markers);

    // Ajouter l'écouteur d'événement pour les clusters
    markers.on('clusterclick', function (event) {
        const cluster = event.propagatedFrom;
        map.fitBounds(cluster.getBounds()); // Zoom sur les limites du cluster
    });
};

export { MapView };
