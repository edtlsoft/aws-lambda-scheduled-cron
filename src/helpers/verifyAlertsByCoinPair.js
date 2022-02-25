const alertsDB = require('../database/alerts.dynamodb');
const verifyAlerts = require('./verifyAlerts');
const getCoinPricesApi = require('./getCoinPricesApi');

const asyncForEach = async (items, callback) => {
    let logsVerifyAlerts = '';

    for (let item of items) {
        logsVerifyAlerts += await callback(item);
    }

    return logsVerifyAlerts;
}

const verifyAlertsByPair = async (coinPair) => {
    const coinPrices = await getCoinPricesApi(coinPair);
    const alertsActive = await alertsDB.getAlertsActiveByPair(coinPair);
    const logsVerifyAlerts = await verifyAlerts(alertsActive, coinPrices, coinPair);

    return `coinPair: ${coinPair.pair} || coinPrices: ${JSON.stringify(coinPrices)} || logsVerifyAlerts: ${logsVerifyAlerts} \n=====\n`;
}

const verifyAlertsByCoinPair = async (coinPairs) => {
    return asyncForEach(coinPairs, verifyAlertsByPair);
}

module.exports = verifyAlertsByCoinPair;
