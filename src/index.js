const opt = require('optimist');
const {printColumns} = require('./print');
const {fetchCharacter} = require('./scrape');

const argv = opt.argv;


function main(character) {
    fetchCharacter(character).then(printColumns).catch(err => console.log(err));
}

if(argv._.length > 0) {
        main.apply(null, argv._);
} else {
        console.log('Need to provide a character name yo!');
}
