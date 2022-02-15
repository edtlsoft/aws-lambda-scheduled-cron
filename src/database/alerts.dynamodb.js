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

const calculateNextPrice = (oldPrice, oldDirection) => {
    const multipleBase = Math.pow(10, oldPrice.toString().length - 1);
    const priceBase = parseInt(oldPrice / multipleBase) * multipleBase;
    const priceOfVariation = priceBase / 100 * process.env.TRADING_PERCENTAGE_OF_VARIATION;

    return oldDirection === 1 ? (oldPrice - priceOfVariation) : (oldPrice + priceOfVariation);
}

const createNextAlert = async (alert, direction) => {
    let Item = {
        id: uuidv4(),
        pair: alert.pair,
        direction: direction,
        price: calculateNextPrice(alert.price, direction),
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
  createNextAlert,
  desactivateAlert,
};
