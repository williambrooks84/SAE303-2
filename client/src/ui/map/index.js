import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster'; 

let MapView = {};

MapView.render = function(lyceesData, candidaturesParLycee) {
    const map = L.map('map').setView([46.6, 2.2], 6);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Créer les clusters
    const regionCluster = L.markerClusterGroup();
    const departementCluster = L.markerClusterGroup();
    const communeCluster = L.markerClusterGroup();
    const lyceeCluster = L.markerClusterGroup();

    // Ajouter les marqueurs aux clusters
    MapView.addMarkersByRegion(regionCluster, lyceesData, candidaturesParLycee);
    MapView.addMarkersByDepartement(departementCluster, lyceesData, candidaturesParLycee);
    MapView.addMarkersByCommune(communeCluster, lyceesData, candidaturesParLycee);
    MapView.addMarkersForLycees(lyceeCluster, lyceesData, candidaturesParLycee);

    // Ajouter le cluster initial
    map.addLayer(regionCluster);

    // Dynamique des clusters selon le zoom
    map.on('zoomend', () => {
        const zoomLevel = map.getZoom();

        // Supprimer tous les clusters précédents
        map.eachLayer(layer => {
            if (layer instanceof L.MarkerClusterGroup) {
                map.removeLayer(layer);
            }
        });

        // Ajouter le cluster approprié selon le zoom
        if (zoomLevel < 6) {
            map.addLayer(regionCluster);       // Zoom faible : clusters régionaux
        } else if (zoomLevel < 10) {
            map.addLayer(departementCluster);  // Zoom moyen : clusters départementaux
        } else if (zoomLevel < 14) {
            map.addLayer(communeCluster);      // Zoom élevé : clusters communaux
        } else {
            map.addLayer(lyceeCluster);        // Zoom très élevé : clusters individuels
        }
    });

    return map;
};

MapView.addMarkersByRegion = function(cluster, lyceesData, candidaturesParLycee) {
    const regions = {};

    lyceesData.forEach(lycee => {
        const region = lycee.libelle_region;
        if (!regions[region]) {
            regions[region] = {
                latitude: parseFloat(lycee.latitude),
                longitude: parseFloat(lycee.longitude),
                candidatures: 0,
                count: 0
            };
        }
        if (!isNaN(regions[region].latitude) && !isNaN(regions[region].longitude)) {
            regions[region].candidatures += candidaturesParLycee[lycee.numero_uai] || 0;
            regions[region].count++;
        }
    });

    for (const [region, data] of Object.entries(regions)) {
        if (!isNaN(data.latitude) && !isNaN(data.longitude)) {
            const marker = L.marker([data.latitude, data.longitude])
                .bindPopup(`<b>${region}</b><br>Candidatures: ${data.candidatures}<br>Lycées: ${data.count}`);
            cluster.addLayer(marker); //Ajouter au cluster
        }
    }
};

MapView.addMarkersByDepartement = function(cluster, lyceesData, candidaturesParLycee) {
    const departements = {};

    lyceesData.forEach(lycee => {
        const departement = lycee.libelle_departement;
        if (!departements[departement]) {
            departements[departement] = {
                latitude: parseFloat(lycee.latitude),
                longitude: parseFloat(lycee.longitude),
                candidatures: 0,
                count: 0
            };
        }
        departements[departement].candidatures += candidaturesParLycee[lycee.numero_uai] || 0;
        departements[departement].count++;
    });

    for (const [departement, data] of Object.entries(departements)) {
        if (!isNaN(data.latitude) && !isNaN(data.longitude)) {
            const marker = L.marker([data.latitude, data.longitude])
                .bindPopup(`<b>${departement}</b><br>Candidatures: ${data.candidatures}<br>Lycées: ${data.count}`);
            cluster.addLayer(marker);
        }
    }
};

MapView.addMarkersByCommune = function(cluster, lyceesData, candidaturesParLycee) {
    const communes = {}; 

    lyceesData.forEach(lycee => {
        const commune = lycee.libelle_commune || 'Inconnue'; // Utiliser "Inconnue" si la commune est vide
        if (!communes[commune]) {
            communes[commune] = {
                latitude: parseFloat(lycee.latitude),
                longitude: parseFloat(lycee.longitude),
                candidatures: 0,
                count: 0
            };
        }
        communes[commune].candidatures += candidaturesParLycee[lycee.numero_uai] || 0;
        communes[commune].count++;
    });

    for (const [commune, data] of Object.entries(communes)) {
        if (!isNaN(data.latitude) && !isNaN(data.longitude)) {
            const marker = L.marker([data.latitude, data.longitude])
                .bindPopup(`<b>${commune}</b><br>Candidatures: ${data.candidatures}<br>Lycées: ${data.count}`);
            cluster.addLayer(marker); // Ajouter au cluster
        }
    }
};

MapView.addMarkersForLycees = function(cluster, lyceesData, candidaturesParLycee) {
    if (Array.isArray(lyceesData)) {
        lyceesData.forEach(lycee => {
            const latitude = parseFloat(lycee.latitude);
            const longitude = parseFloat(lycee.longitude);
            if (!isNaN(latitude) && !isNaN(longitude)) {
                const nombreCandidatures = candidaturesParLycee[lycee.numero_uai] || 0;
                const marker = L.marker([latitude, longitude])
                    .bindPopup(`<b>${lycee.appellation_officielle}</b><br>Candidatures: ${nombreCandidatures}`);
                cluster.addLayer(marker); // Ajouter les marqueurs au cluster
            }
        });
    }
};

export { MapView };