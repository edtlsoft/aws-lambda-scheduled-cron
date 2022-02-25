const dotenv = require('dotenv');
const AWS = require("aws-sdk");
const dateFns = require('date-fns');

dotenv.config();
AWS.config.update({ region: "us-east-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TableName = "CoinPairsTable";

const getCoinPairs = async () => {
  const coinPairs = await dynamoDB
    .scan({
        TableName, 
    })
    .promise();

  return coinPairs.Items;
};

const getCoinPairsActive = async () => {
    const coinPairs = await dynamoDB
        .scan({
            TableName,
            FilterExpression: "active = :active",
            ExpressionAttributeValues: {
                ":active": true
            }
        })
        .promise();

  return coinPairs.Items;
};

const desactivateCoinPair = async (alertId) => {
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
  getCoinPairs,
  getCoinPairsActive,
  desactivateCoinPair,
};
