'use strict';

const coinPairsDB = require('./database/coinPairs.dynamodb');
const verifyAlertsByCoinPair = require('./helpers/verifyAlertsByCoinPair');

module.exports.run = async (event, context) => {
  let messageLog = `Cron running ${new Date().toString().substring(0, 24)}`;
  const coinPairs = await coinPairsDB.getCoinPairsActive();
  const logsVerifyAlerts = await verifyAlertsByCoinPair(coinPairs);

  messageLog += ` || logsVerifyAlerts: ${logsVerifyAlerts}`;

  console.log(messageLog);
};
