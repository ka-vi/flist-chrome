const puppeteer = require('puppeteer');
const path = require('path');


async function fetchCharacter(character) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let result = null;

    try {
        await page.goto(`https://www.f-list.net/c/${character}`, {waitUntil: 'networkidle2'});
        await page.click('#SplashWarningYes');
        await page.waitForSelector('#Character_FetishList', {timeout: 5000});

        const tabs = await page.$$('#tabs ul li a');
        const imageCount = await page.evaluate(() => {
            return parseInt(
                document
                .querySelector('a[href="#tabs-4"]')
                .textContent
                .match(/\((\d*)\)/)[1]
            );
        });

        // Images tab
        if (imageCount > 0) {
            await tabs[3].click();
            try {
                await page.waitForSelector('#tabs-4 div a', {timeout: 2000});
            } catch (err) {
                // TODO: Do we want to do something here?
            }
        }

        await page.addScriptTag({path: path.join(__dirname, 'inject.js')});

        result = await page.evaluate(async () => {
            return {
                tabs: fetchTabs(),
                kinks: fetchKinkLists(),
            };
        });
    } catch (err) {
        throw err;
    } finally {
        await browser.close();
    }

    return result;
}

module.exports = {
    fetchCharacter,
};
