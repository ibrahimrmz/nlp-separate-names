// nameParser.js
const fs = require('fs');
const { NlpManager } = require('node-nlp');
const util = require('util');

// Function to parse Latin American names using the trained model
async function parseLatinAmericanName(fullName) {
    try {
        const data = fs.readFileSync('model.nlp', 'utf8');
        const manager = new NlpManager();
        await manager.import(data);

        const response = await manager.process('es', fullName);

        let firstName = '';
        let middleName = '';
        let lastName = '';
        let secondLastName = '';

        const entities = await response.entities;
        console.log(util.inspect(await response, false, null, true));

        // Customize the logic based on your training data and expected entities
        entities.forEach(entity => {
            if (entity.label === 'firstName') {
                firstName = entity.sourceText;
            } else if (entity.label === 'middleName') {
                middleName = entity.sourceText;
            } else if (entity.label === 'lastName') {
                lastName = entity.sourceText;
            } else if (entity.label === 'secondLastName') {
                secondLastName = entity.sourceText;
            }
        });

        return {
            firstName,
            middleName,
            lastName,
            secondLastName,
        };
    } catch (error) {
        return 'Error importing the model:', error.message;
    }
}

// Wrap your top-level code in an async function
async function main() {
    const inputName = "BETZABETH MENDEZ REYES";
    let parsedName = await parseLatinAmericanName(inputName);

    console.log('Input:', inputName);
    console.log('Parsed:', parsedName);
}

main();