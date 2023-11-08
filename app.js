
'use strict';
let fs = require('fs');
const lineReader = require('line-reader');
let jsonFile = '[]';

let jsonFileObject = JSON.parse(jsonFile);
let iteration = 0;
let municipiscopiat = 0;

lineReader.eachLine('./dades/MunicipiosSIGPAC_20231106.csv', function(line, last) {
//lineReader.eachLine('./dades/prova.csv', function(line, last) {
    try {  
        console.log(`Line ${iteration} from file: ${line}`);
        if (iteration != 0 || iteration != 1) {
            // Son les linies de la 2 a la última. No són capçaleres
            let camps = line.split(";")
            if (camps[0] == 8 || camps[0] == 17 || camps[0] == 25 || camps[0] == 43) {            
                // Províncies de Barcelona, Girona, LLeida i Tarragona
                               
                // El codi de provincia ha de tenir dos digits i el de municipi 3
                // Província
                if (camps[0].length == 1) {
                    camps[0] = `0${camps[0]}`;
                }
                // Municipi
                if (camps[1].length == 1) {
                    camps[1] = `00${camps[1]}`;
                } else if (camps[1].length == 2){
                    camps[1] = `0${camps[1]}`;
                }
                let municipi = {
                    MUNICIPI:`${camps[0]}${camps[1]}`,
                    NOM_MUNICIPI:`${camps[2]}`
                }
                jsonFileObject.push(municipi);
                municipiscopiat++;
                    
            }
        }
        
        if(last) {
            console.log('Last line printed.');
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
            console.log("////////////////// RESULTAT Conversió a JSON ////////////////////")            
            console.log(JSON.stringify(jsonFileObject));
            console.log(`NUMERO DE MUNICIPIS PASSATS A JSON: ${municipiscopiat}`);
            fs.writeFile("./dades/MunicipisSIGPAC.json", JSON.stringify(jsonFileObject), function(err) {
                if (err) {
                    console.group(`Error en l'escriptura del fitxer resultat ${err}`);
                }
            })

        }
        iteration++;
    } catch (e) {
        console.log(`*************************************************** `)
        console.log(`Error a la línia ${iteration},  ${line} `)
        console.log(e);
        console.log(`*************************************************** `)
    }
});