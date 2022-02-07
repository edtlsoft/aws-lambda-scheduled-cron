const puppeteer = require('puppeteer');
const coinPairs = process.env.BINANCE_COIN_PAIRS.split(',') || [];

const getPricesFromWebSite = async (page, pair) => {
    await page.goto(`https://www.binance.com/es/trade/${pair}?layout=pro`);
    await page.waitForSelector('div.css-e2pgpg', { active: true });

    await page.evaluate(() => {
        return document.querySelector('div.css-e2pgpg').querySelector("div#\\31h").click();
    });

    await page.waitForFunction(() => !document.querySelector('.css-1i6ydsq'));

    return page.evaluate(() => {
        const indicators = document.querySelector('div.chart-title-indicator-container').querySelectorAll('span');

        return {
            max: parseFloat(indicators[4].innerText),
            min: parseFloat(indicators[6].innerText)
        };
    });
}

const getCoinPrices = async () => {
    const pricesPairs = {};
    const browser = await puppeteer.launch({ /*headless: false*/ });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768});

        for(let coinPair of coinPairs) {
            pricesPairs[coinPair] = await getPricesFromWebSite(page, coinPair);
        }

        return pricesPairs;
    } catch (error) {
        return error.message;
    } finally {
        await browser.close();
    }
};

module.exports = getCoinPrices;