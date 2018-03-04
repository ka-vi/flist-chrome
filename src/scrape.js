const puppeteer = require('puppeteer');
const path = require('path');


async function fetchCharacter(character) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let response = null;

    await page.goto(`https://www.f-list.net/c/${character}`, {waitUntil: 'networkidle2'});
    await page.click('#SplashWarningYes');
    await page.waitForSelector('#Character_FetishList');
    await page.addScriptTag({path: path.join(__dirname, 'inject.js')});

    const result = await page.evaluate(async () => {
        return fetchKinkLists();
    });

    await browser.close();

    return {
        kinks: result,
    };
}

module.exports = {
    fetchCharacter,
};
