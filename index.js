const fs = require('fs');
const { parse } = require('csv-parse');
const { NerManager } = require('node-nlp');

(async () => {
    try {
        const csvData = fs.readFileSync('latam_names.csv', 'utf8');
        const records = parse(csvData, { columns: true });

        const manager = new NerManager({ threshold: 0.5 });

        const names = [];
        const middleNames = [];
        const lastNames = [];
        const secondLastNames = [];

        await records.forEach(record => {
            const { FirstName, MiddleName, LastName, SecondLastName } = record;
            names.push(FirstName);
            middleNames.push(MiddleName);
            lastNames.push(LastName);
            secondLastNames.push(SecondLastName);
        });

        console.log("Number of Names: " + names.length);

        // Agregar entidades personalizadas
        await manager.addNamedEntityText('name', 'name', ['es'], names);
        await manager.addNamedEntityText('middleName', 'middleName', ['es'], middleNames);
        await manager.addNamedEntityText('lastName', 'lastName', ['es'], lastNames);
        await manager.addNamedEntityText('secondLastName', 'secondLastName', ['es'], secondLastNames);

        const textToProcess = 'MA. DEL CARMEN LEYVA RODRIGUEZ';
        if (textToProcess.split(' ').length <= 4) {
            console.log(separateSimpleNames(textToProcess));
        } else {
            const entities = await manager.findEntities(textToProcess, 'es');
            const splitedName = {
                fullName: textToProcess,
                firstName: entities[0].sourceText,
                middleName: entities[1].sourceText == entities[0].sourceText ? null : entities[1].sourceText,
                lastName: entities[2].sourceText,
                secondLastName: entities[3].sourceText
            }

            console.log(splitedName);

            console.log(increaseThreshold(textToProcess, splitedName));
        }
    } catch (error) {
        console.error('Error:', error);
    }
})();


function separateSimpleNames(name) {
    const separateName = name.split(' ');

    if (separateName.length === 4) {
        return {
            fullName: name,
            firstName: separateName[0],
            middleName: separateName[1],
            lastName: separateName[2],
            secondLastName: separateName[3]
        }
    }

    return {
        fullName: name,
        firstName: separateName[0],
        middleName: null,
        lastName: separateName[1],
        secondLastName: separateName[2]
    }
}

function quitarPuntos(palabra) {
    // Elimina los puntos de la palabra
    return palabra.replace(/\./g, '');
  }
  
  function manejarCasosEspeciales(palabra) {
    // Maneja casos especiales como "DEL", "DE", "DE LOS", "DE LAS", "DE LA"
    const casosEspeciales = ['DEL', 'DE', 'DE LOS', 'DE LAS', 'DE LA'];
    const palabraMayusculas = palabra.toUpperCase();
  
    if (casosEspeciales.includes(palabraMayusculas)) {
      return '';
    }
  
    return palabra;
  }
  
  function increaseThreshold(stringCompleto, objetoNombres) {
    // Divide el string en palabras
    const palabras = stringCompleto.split(' ');
  
    // Compara cada palabra (sin puntos y manejando casos especiales) con las propiedades del objeto
    for (const palabra of palabras) {
      const palabraSinPuntos = quitarPuntos(palabra);
      const palabraTratada = manejarCasosEspeciales(palabraSinPuntos);
  
      if (
        palabraTratada !== objetoNombres.firstName &&
        palabraTratada !== objetoNombres.middleName &&
        palabraTratada !== objetoNombres.lastName &&
        palabraTratada !== objetoNombres.secondLastName
      ) {
        // La palabra que no coincide con ninguna propiedad es la palabra faltante
        return palabraTratada;
      }
    }
  
    // Si no se encontró ninguna palabra faltante
    return null;
  }