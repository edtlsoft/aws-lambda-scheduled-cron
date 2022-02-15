const sendSMS = require('./sendSMS');
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
    let logsVerifyAlerts = '';

    await asyncForEach(alerts, async (alert) => {
        // const coinPrice = coinPrices[alert.pair];
        const coinPrice = coinPrices;
        let messageSMS = '';
    
        if (alert.direction === 1 && alert.price > coinPrice.min) {
          messageSMS += `BTC comprado a ${alert.price} USDT`;
        }
        else if(alert.direction === 2 && alert.price < coinPrice.max) {
          messageSMS += `BTC vendido a ${alert.price} USDT`;
        }

        if (messageSMS != '') {
            const { buyAlert, sellAlert} = await createNextAlerts(alert);
            messageSMS += buyAlert  ? `, nueva orden de compra ${buyAlert.price} USDT` : '';
            messageSMS += sellAlert ? `, nueva orden de venta ${sellAlert.price} USDT.` : '';
            const sendAlertSMS = await sendSMS(messageSMS, process.env.MY_PHONE_NUMBER);
            messageSMS += ` || SMS: ${sendAlertSMS}`;
        }

        logsVerifyAlerts += messageSMS;
    });

    return logsVerifyAlerts;
}

module.exports = verifyAlerts;
