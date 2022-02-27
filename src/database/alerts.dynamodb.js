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
            FilterExpression: "active = :active",
            ExpressionAttributeValues: {
                ":active": true
            }
        })
        .promise();

  return alerts.Items;
};

const getAlertsActiveByPair = async (coinPair) => {
    const alerts = await dynamoDB
        .scan({
            TableName,
            FilterExpression: "pair = :pair AND active = :active ",
            ExpressionAttributeValues: {
                ":pair": coinPair.pair,
                ":active": true,
            }
        })
        .promise();

  return alerts.Items;
};

const calculateNextPrice = (oldPrice, direction, coinPair) => {
    let newPrice = 0;

    if (direction === 1) {
        const variationToBuy = parseFloat(coinPair.variation_to_buy);
        newPrice = oldPrice - variationToBuy;
    }
    else if (direction === 2) {
        const variationToSell = parseFloat(coinPair.variation_to_sell);
        newPrice = oldPrice + variationToSell;
    }

    return newPrice;
}

const createNextAlert = async (alert, direction, coinPair) => {
    let Item = {
        id: uuidv4(),
        pair: alert.pair,
        direction: direction,
        price: calculateNextPrice(alert.price, direction, coinPair),
        active: true,
        createdAt: dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        updatedAt: dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }

	const alertNotExists = await validateIfAlertExists(Item);

	if (!alertNotExists) {
		await dynamoDB.put({ TableName, Item }).promise();
		return Item;
	}

	return null;
}

const validateIfAlertExists = async (alert) => {
    const alerts = await dynamoDB
        .scan({
            TableName,
            FilterExpression: "price = :price AND direction = :direction AND active = :active",
            ExpressionAttributeValues: {
                ":price": alert.price,
                ":direction": alert.direction,
                ":active": alert.active
            }
        })
        .promise();
	
	return alerts.Items.length;
};

const desactivateAlert = async (alertId) => {
	return dynamoDB.update({
		TableName,
		Key: { 
			id: alertId 
		},
		UpdateExpression: 'set active = :active, updatedAt = :date',
		ExpressionAttributeValues: {
			':active': false,
			':date': dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
		},
		ReturnValues: 'ALL_NEW',
	}).promise();
}

module.exports = {
  getAlerts,
  getAlertsActive,
  getAlertsActiveByPair,
  createNextAlert,
  desactivateAlert,
};
