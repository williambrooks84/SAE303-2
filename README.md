# Carte des Candidatures MMI  

Ce projet présente une **carte interactive** affichant les **candidatures pour la formation MMI** selon :  
- **Filière** : Générale, Technologique, Autres  
- **Département** (optionnel)  

## Technologies utilisées  

- **Leaflet.js** ([leafletjs.com](https://leafletjs.com)) : Librairie JavaScript pour l'affichage et l'interaction avec des cartes.  
- **Fichiers JSON** : Contiennent les données des candidatures.  
- **Vite** : Utilisé pour le développement et le build du projet.  
- **HTML, CSS, JavaScript** : Structure et interactivité du projet.  

## Installation et Exécution  

### 1. Cloner le projet
```bash
git clone https://github.com/williambrooks84/SAE303-2.git
```

### 2. Installation des dépendances  
```bash
npm install vite
```

### 3. Lancement du projet en local  
```bash
npm run dev
```
Cela démarre un serveur de développement pour tester le projet en local.  

### 4. Génération des fichiers pour production  
```bash
npm run build
```
Cette commande génère les fichiers optimisés pour un déploiement sur un serveur.  

## Fonctionnalités  

- Affichage des candidatures sur une **carte interactive**.  
- Filtrage des données par **filière** et **département**.  
- Utilisation de **Leaflet.js** pour la gestion des marqueurs et de l'affichage dynamique.  
- Données stockées dans des **fichiers JSON** pour éviter la nécessité d'un backend.  

---

Ce projet permet de visualiser facilement la répartition des candidatures à la formation MMI de manière interactive et dynamique. 🚀  
