

let data = await fetch("./src/data/json/postaux.json");
data = await data.json();

let compare = function(a,b){
    if(a.code_postal < b.code_postal){
        return -1;
    }
    if(a.code_postal > b.code_postal){
        return 1;
    }
    return 0;
}

data.sort(compare);

let Postaux = {}

Postaux.getAll = function(){
    return data;
}

Postaux.getByCodePostal = function(code_postal){
    return data.find(postal => postal.code_postal === code_postal);
}

Postaux.binarySearch = function(code_postal){
    let min = 0;
    let max = data.length - 1;
    let guess;

    while(min <= max){
        guess = Math.floor((min + max) / 2);
        if(data[guess].code_postal === code_postal){
            return data[guess];
        } else {
            if(data[guess].code_postal < code_postal){
                min = guess + 1;
            } else {
                max = guess - 1;
            }
        }
    }
}

export { Postaux };