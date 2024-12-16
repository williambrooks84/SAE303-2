import { HeaderView } from "./ui/header/index.js";
import { MapView } from "./ui/map/index.js";
import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";
import './index.css';

let M = {};

M.getLycees = async function(){
    const lyceesData = Lycees.getAll();
    return lyceesData;
};

let C = {};

C.init = async function(){
    const lyceesData = await M.getLycees();
    V.init(lyceesData);
    console.log(Candidats.getAll());
    console.log(Lycees.getAll());
    return lyceesData;
}

let V = {
    header: document.querySelector("#header"),
    map: document.querySelector("#map")
};

V.init = function(lyceesData){
    V.renderHeader();
    V.renderMap(lyceesData);
}

V.renderHeader= function(){
    V.header.innerHTML = HeaderView.render();
}

V.renderMap = function(lyceesData){
    V.map = MapView.render(lyceesData);
};


C.init();