const fs = require('fs');
const { parse } = require('csv-parse');
const { NerManager } = require('node-nlp');

// Train and save the model.
(async () => {
    const manager = new NerManager({ threshold: 0.8 });

    // Load CSV data
    try {
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
        await manager.addNamedEntityText('middleName', 'middleName', ['es'], middleNames);
        await manager.addNamedEntityText('lastName', 'lastName', ['es'], lastNames);
        await manager.addNamedEntityText('secondLastName', 'secondLastName', ['es'], secondLastNames);

        const entities = await manager.findEntities('MARIA DE ROSA ESCUTIA', 'es');
        console.log(entities);
    } catch (error) {
        console.error('Error:', error);
    }
})();
