'use strict';

const sendSMS = require('./helpers/sendSMS');
const alertsDB = require('./database/alerts.dynamodb');
const logsDB = require('./database/logs.dynamodb');
// const getCoinPrices = require('./helpers/getCoinPrices');
const getCoinPricesApi = require('./helpers/getCoinPricesApi');
const verifyAlerts = require('./helpers/verifyAlerts');

module.exports.run = async (event, context) => {
  console.time('lambda');

  let messageSMS = '';
  let messageLog = `Cron running ${new Date().toString().substring(0, 24)}`;
  // const coinPrices = await getCoinPrices();
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
  console.timeEnd('lambda');
};
