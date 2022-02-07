const dotenv = require('dotenv');
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const dateFns = require('date-fns');

dotenv.config();
AWS.config.update({ region: "us-east-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TableName = "AlertsTable";

const getAlerts = async () => {
  const alerts = await dynamoDB
    .scan({
        TableName, 
    })
    .promise();

  return alerts.Items;
};

const getAlertsActive = async () => {
    const alerts = await dynamoDB
        .scan({
            TableName,
            FilterExpression: "active = :val",
            ExpressionAttributeValues: {
                ":val": true
            }
        })
        .promise();

  return alerts.Items;
};

const calculateNextPrice = (oldPrice, oldDirection) => {
    const multipleBase = Math.pow(10, oldPrice.toString().length - 1);
    const priceBase = parseInt(oldPrice / multipleBase) * multipleBase;
    const priceOfVariation = priceBase / 100 * process.env.TRADING_PERCENTAGE_OF_VARIATION;

    return oldDirection === 1 ? (oldPrice - priceOfVariation) : (oldPrice + priceOfVariation);
}

const createNextAlert = async (oldAlert) => {
    let Item = {
        id: uuidv4(),
        pair: oldAlert.pair,
        direction: oldAlert.direction,
        price: calculateNextPrice(oldAlert.price, oldAlert.direction),
        active: true,
		createdAt: dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }

    await dynamoDB.put({
		TableName,
		Item,
	}).promise();

    return Item;
}

const desactivateAlert = async (alertId) => {
	return dynamoDB.update({
		TableName,
		Key: { 
			id: alertId 
		},
		UpdateExpression: 'set active = :val',
		ExpressionAttributeValues: {
			':val': false
		},
		ReturnValues: 'ALL_NEW',
	}).promise();
}

module.exports = {
  getAlerts,
  getAlertsActive,
  createNextAlert,
  desactivateAlert,
};
