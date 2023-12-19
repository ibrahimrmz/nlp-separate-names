const fs = require('fs');
const { parse } = require('csv-parse');
const { NerManager, NlgManager, NlpManager } = require('node-nlp');

// Train and save the model.
(async () => {
    const manager = new NerManager({ threshold: 0.5 });
    //const manager = new NlpManager({ languages: ['es'] });

    // Load CSV data
    const csvData = fs.readFileSync('latam_names.csv', 'utf8');
    const records = parse(csvData, { columns: true });

    let names = [];
    let middleNames = [];
    let lastNames = [];
    let secondLastNames = [];

    await records.forEach(record => {
        const { FirstName, MiddleName, LastName, SecondLastName } = record;
        names.push(FirstName);
        middleNames.push(MiddleName);
        lastNames.push(LastName);
        secondLastNames.push(SecondLastName);

    });
    console.log("N. Names: " + names.length);
    // Agregar entidades personalizadas
    await manager.addNamedEntityText('name', 'name', ['es'], names);
    await manager.addNamedEntityText('midlleName', 'midlleName', ['es'], middleNames);
    await manager.addNamedEntityText('lastName', 'lastName', ['es'], lastNames);
    await manager.addNamedEntityText('secondLastName', 'secondLastName', ['es'], secondLastNames);

    /* await manager.train();
    await manager.save(); */
    const entities = manager.findEntities('PAULINA DE LA ROSA HERNANDEZ', 'es');
    console.log(entities)
    /* const response = await manager.process('MARIA DE LOURDES RAMIREZ HERNANDEZ');
    console.log(response); */
})();

