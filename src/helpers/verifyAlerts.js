const alertsDB = require('../database/alerts.dynamodb');

const asyncForEach = async (items, callback) => {
    for (let item of items) {
        await callback(item);
    }
}

const createNextAlerts = async (alert) => {
    const buyAlert = await alertsDB.createNextAlert(alert, 1);
    const sellAlert = await alertsDB.createNextAlert(alert, 2);
    await alertsDB.desactivateAlert(alert.id);
    return {
        buyAlert,
        sellAlert
    };
}

const verifyAlerts = async (alerts=[], coinPrices={}) => {
    let messageSMS = '';

    await asyncForEach(alerts, async (alert) => {
        // const coinPrice = coinPrices[alert.pair];
        const coinPrice = coinPrices;
        let alertSMSMessage = '';
    
        if (alert.direction === 1 && alert.price > coinPrice.min) {
          alertSMSMessage += `BTC comprado a ${alert.price} USDT`;
        }
        else if(alert.direction === 2 && alert.price < coinPrice.max) {
          alertSMSMessage += `BTC vendido a ${alert.price} USDT`;
        }

        if (alertSMSMessage != '') {
            const { buyAlert, sellAlert} = await createNextAlerts(alert);
            alertSMSMessage += `, nueva orden de compra ${buyAlert.price} USDT, nueva orden de venta ${sellAlert.price} USDT.`;
        }

        messageSMS += alertSMSMessage;
    });

    return messageSMS;
}

module.exports = verifyAlerts;
