const {describe, it} = require('mocha');
const {expect} = require('chai');

const {fetchCharacter} = require('../src/scrape');

describe('f-list.net tests', async function () {

    it('Should fetch a character', async function () {
        this.timeout(8000);
        const result = await fetchCharacter('ka-vi');

        expect(result).to.have.all.keys('tabs', 'kinks');
        expect(result.kinks).to.have.all.keys('Fave', 'Yes', 'Maybe', 'No');
        expect(result.tabs).to.have.all.keys('info', 'details', 'images');
    });

    it('Should exit early if a character is not found', async function () {
        this.timeout(8000);

        let error = null;

        try {
            await fetchCharacter('blarglenope');
        } catch (err) {
            error = err;
        }

        expect(error).to.not.be.null;
    });

});
