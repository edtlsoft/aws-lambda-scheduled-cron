const AWS = require("aws-sdk");
const dateFns = require('date-fns');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({ region: "us-east-1" });

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TableName = "LogsTable";

const getLogs = async () => {
  const alerts = await dynamoDB
    .scan({
        TableName, 
    })
    .promise();

  return alerts.Items;
};

const createLog = async (payload='') => {
    let Item = {
        id: uuidv4(),
        payload,
		createdAt: dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }

    await dynamoDB.put({
		TableName,
		Item,
	}).promise();

    return Item;
}

module.exports = {
  getLogs,
  createLog,
};
