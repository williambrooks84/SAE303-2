
import {Candidats} from './data-candidats.js';

let data = await fetch("./src/data/json/lycees.json");
data = await data.json();


let Lycees = {}

Lycees.getAll = function(){ 
    return data;
}

Lycees.binarySearch = function(numero_uai){
    let min = 0;
    let max = data.length - 1;
    let guess;

    while(min <= max){
        guess = Math.floor((min + max) / 2);
        if(data[guess].numero_uai === numero_uai){
            return data[guess];
        } else {
            if(data[guess].numero_uai < numero_uai){
                min = guess + 1;
            } else {
                max = guess - 1;
            }
        }
    }
}


let filterLyceesWithCandidatures = function() {
    let result = [];
    for (let lycee of data) {
        if (Candidats.uaiSearch(lycee.numero_uai) > 0) {
            result.push(lycee);
        }
    }
    return result;
};


let compare = function(a,b){
    if(a.numero_uai < b.numero_uai){
        return -1;
    }
    if(a.numero_uai > b.numero_uai){
        return 1;
    }
    return 0;
}



data.shift();

data = filterLyceesWithCandidatures();

data.sort(compare);


export { Lycees };