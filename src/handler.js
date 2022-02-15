'use strict';

const logsDB = require('./database/logs.dynamodb');
const alertsDB = require('./database/alerts.dynamodb');
const verifyAlerts = require('./helpers/verifyAlerts');
const getCoinPricesApi = require('./helpers/getCoinPricesApi');

module.exports.run = async (event, context) => {
  let messageLog = `Cron running ${new Date().toString().substring(0, 24)}`;
  const coinPrices = await getCoinPricesApi();
  const alertsActive = await alertsDB.getAlertsActive();

  const logsVerifyAlerts = await verifyAlerts(alertsActive, coinPrices);

  messageLog += ` || coinPrices: ${JSON.stringify(coinPrices)} || logsVerifyAlerts: ${logsVerifyAlerts}`;

  // await logsDB.createLog(messageLog);

  console.log(messageLog);
};
