const alertsDB = require('../database/alerts.dynamodb');

const asyncForEach = async (items, callback) => {
    for (let item of items) {
        await callback(item);
    }
}

const createNextAlert = async (alert) => {
    const newAlert = await alertsDB.createNextAlert(alert);
    await alertsDB.desactivateAlert(alert.id);
    return newAlert;
}

const verifyAlerts = async (alerts=[], coinPrices={}) => {
    let messageSMS = '';

    await asyncForEach(alerts, async (alert) => {
        // const coinPrice = coinPrices[alert.pair];
        const coinPrice = coinPrices;
    
        if (alert.direction === 1 && alert.price > coinPrice.min) {
          const newAlert = await createNextAlert(alert);
          messageSMS += `BTC comprado a ${alert.price} USDT, debes generar una nueva orden de compra por ${newAlert.price} USDT.`;
        }
        else if(alert.direction === 2 && alert.price < coinPrice.max) {
          const newAlert = await createNextAlert(alert);
          messageSMS += `BTC vendido a ${alert.price} USDT, debes generar una nueva orden de venta por ${newAlert.price} USDT.`;
        }
    });

    return messageSMS;
}

module.exports = verifyAlerts;
