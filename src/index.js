const opt = require('optimist');
const {printColumns} = require('./print');
const {fetchCharacter} = require('./scrape');

const argv = opt.argv;


function main(character) {
    fetchCharacter(character).then(printColumns).catch(err => console.log(err));
}

if(argv._.length > 0) {
    const character = Array.from(argv._).join(' ');
    main(character);
} else {
    console.log('Need to provide a character name yo!');
}
