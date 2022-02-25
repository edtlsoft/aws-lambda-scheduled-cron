'use strict';

const coinPairsDB = require('./database/coinPairs.dynamodb');
const verifyAlertsByCoinPair = require('./helpers/verifyAlertsByCoinPair');

module.exports.run = async (event, context) => {
  let messageLog = `Cron running ${new Date().toString().substring(0, 24)}\n`;
  const coinPairs = await coinPairsDB.getCoinPairsActive();
  const logsVerifyAlerts = await verifyAlertsByCoinPair(coinPairs);

  messageLog += `logsVerifyAlerts: \n${logsVerifyAlerts}`;

  console.log(messageLog);
};
