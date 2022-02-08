'use strict';

const logsDB = require('./database/logs.dynamodb');
const sendSMS = require('./helpers/sendSMS');
const alertsDB = require('./database/alerts.dynamodb');
const verifyAlerts = require('./helpers/verifyAlerts');
const getCoinPricesApi = require('./helpers/getCoinPricesApi');

module.exports.run = async (event, context) => {
  let messageSMS = '';
  let messageLog = `Cron running ${new Date().toString().substring(0, 24)}`;
  const coinPrices = await getCoinPricesApi();
  console.log('coinPrices', coinPrices);
  const alertsActive = await alertsDB.getAlertsActive();

  messageSMS = await verifyAlerts(alertsActive, coinPrices);

  if (messageSMS != '') {
    const sendAlert = await sendSMS(messageSMS, process.env.MY_PHONE_NUMBER);
    console.log('sendAlert', sendAlert);
  }

  messageLog += ` || ${JSON.stringify(coinPrices)} || ${messageSMS}`;

  await logsDB.createLog(messageLog);

  console.log(messageLog);
};
