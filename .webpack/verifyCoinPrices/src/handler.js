/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/database/alerts.dynamodb.js":
/*!*****************************************!*\
  !*** ./src/database/alerts.dynamodb.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const dotenv = __webpack_require__(/*! dotenv */ \"dotenv\");\r\nconst AWS = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\r\nconst { v4: uuidv4 } = __webpack_require__(/*! uuid */ \"uuid\");\r\nconst dateFns = __webpack_require__(/*! date-fns */ \"date-fns\");\r\n\r\ndotenv.config();\r\nAWS.config.update({ region: \"us-east-1\" });\r\n\r\nconst dynamoDB = new AWS.DynamoDB.DocumentClient();\r\nconst TableName = \"AlertsTable\";\r\n\r\nconst getAlerts = async () => {\r\n  const alerts = await dynamoDB\r\n    .scan({\r\n        TableName, \r\n    })\r\n    .promise();\r\n\r\n  return alerts.Items;\r\n};\r\n\r\nconst getAlertsActive = async () => {\r\n    const alerts = await dynamoDB\r\n        .scan({\r\n            TableName,\r\n            FilterExpression: \"active = :active\",\r\n            ExpressionAttributeValues: {\r\n                \":active\": true\r\n            }\r\n        })\r\n        .promise();\r\n\r\n  return alerts.Items;\r\n};\r\n\r\nconst calculateNextPrice = (oldPrice, oldDirection) => {\r\n    const multipleBase = Math.pow(10, oldPrice.toString().length - 1);\r\n    const priceBase = parseInt(oldPrice / multipleBase) * multipleBase;\r\n    const priceOfVariation = priceBase / 100 * process.env.TRADING_PERCENTAGE_OF_VARIATION;\r\n\r\n    return oldDirection === 1 ? (oldPrice - priceOfVariation) : (oldPrice + priceOfVariation);\r\n}\r\n\r\nconst createNextAlert = async (alert, direction) => {\r\n    let Item = {\r\n        id: uuidv4(),\r\n        pair: alert.pair,\r\n        direction: direction,\r\n        price: calculateNextPrice(alert.price, direction),\r\n        active: true,\r\n        createdAt: dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss'),\r\n        updatedAt: dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss')\r\n    }\r\n\r\n\tconst alertNotExists = await validateIfAlertExists(Item);\r\n\r\n\tif (!alertNotExists) {\r\n\t\tawait dynamoDB.put({ TableName, Item }).promise();\r\n\t\treturn Item;\r\n\t}\r\n\r\n\treturn null;\r\n}\r\n\r\nconst validateIfAlertExists = async (alert) => {\r\n    const alerts = await dynamoDB\r\n        .scan({\r\n            TableName,\r\n            FilterExpression: \"price = :price AND direction = :direction AND active = :active\",\r\n            ExpressionAttributeValues: {\r\n                \":price\": alert.price,\r\n                \":direction\": alert.direction,\r\n                \":active\": alert.active\r\n            }\r\n        })\r\n        .promise();\r\n\t\r\n\treturn alerts.Items.length;\r\n};\r\n\r\nconst desactivateAlert = async (alertId) => {\r\n\treturn dynamoDB.update({\r\n\t\tTableName,\r\n\t\tKey: { \r\n\t\t\tid: alertId \r\n\t\t},\r\n\t\tUpdateExpression: 'set active = :active, updatedAt = :date',\r\n\t\tExpressionAttributeValues: {\r\n\t\t\t':active': false,\r\n\t\t\t':date': dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss')\r\n\t\t},\r\n\t\tReturnValues: 'ALL_NEW',\r\n\t}).promise();\r\n}\r\n\r\nmodule.exports = {\r\n  getAlerts,\r\n  getAlertsActive,\r\n  createNextAlert,\r\n  desactivateAlert,\r\n};\r\n\n\n//# sourceURL=webpack://cripto-alerts/./src/database/alerts.dynamodb.js?");

/***/ }),

/***/ "./src/database/logs.dynamodb.js":
/*!***************************************!*\
  !*** ./src/database/logs.dynamodb.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const AWS = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\r\nconst dateFns = __webpack_require__(/*! date-fns */ \"date-fns\");\r\nconst { v4: uuidv4 } = __webpack_require__(/*! uuid */ \"uuid\");\r\n\r\nAWS.config.update({ region: \"us-east-1\" });\r\n\r\nconst dynamoDB = new AWS.DynamoDB.DocumentClient();\r\n\r\nconst TableName = \"LogsTable\";\r\n\r\nconst getLogs = async () => {\r\n  const alerts = await dynamoDB\r\n    .scan({\r\n        TableName, \r\n    })\r\n    .promise();\r\n\r\n  return alerts.Items;\r\n};\r\n\r\nconst createLog = async (payload='') => {\r\n    let Item = {\r\n        id: uuidv4(),\r\n        payload,\r\n\t\tcreatedAt: dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss')\r\n    }\r\n\r\n    await dynamoDB.put({\r\n\t\tTableName,\r\n\t\tItem,\r\n\t}).promise();\r\n\r\n    return Item;\r\n}\r\n\r\nmodule.exports = {\r\n  getLogs,\r\n  createLog,\r\n};\r\n\n\n//# sourceURL=webpack://cripto-alerts/./src/database/logs.dynamodb.js?");

/***/ }),

/***/ "./src/handler.js":
/*!************************!*\
  !*** ./src/handler.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nconst logsDB = __webpack_require__(/*! ./database/logs.dynamodb */ \"./src/database/logs.dynamodb.js\");\nconst alertsDB = __webpack_require__(/*! ./database/alerts.dynamodb */ \"./src/database/alerts.dynamodb.js\");\nconst verifyAlerts = __webpack_require__(/*! ./helpers/verifyAlerts */ \"./src/helpers/verifyAlerts.js\");\nconst getCoinPricesApi = __webpack_require__(/*! ./helpers/getCoinPricesApi */ \"./src/helpers/getCoinPricesApi.js\");\n\nmodule.exports.run = async (event, context) => {\n  let messageLog = `Cron running ${new Date().toString().substring(0, 24)}`;\n  const coinPrices = await getCoinPricesApi();\n  const alertsActive = await alertsDB.getAlertsActive();\n\n  const logsVerifyAlerts = await verifyAlerts(alertsActive, coinPrices);\n\n  messageLog += ` || coinPrices: ${JSON.stringify(coinPrices)} || logsVerifyAlerts: ${logsVerifyAlerts}`;\n\n  // await logsDB.createLog(messageLog);\n\n  console.log(messageLog);\n};\n\n\n//# sourceURL=webpack://cripto-alerts/./src/handler.js?");

/***/ }),

/***/ "./src/helpers/getCoinPricesApi.js":
/*!*****************************************!*\
  !*** ./src/helpers/getCoinPricesApi.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const fetch = __webpack_require__(/*! node-fetch-commonjs */ \"node-fetch-commonjs\");\r\nconst dateFns = __webpack_require__(/*! date-fns */ \"date-fns\");\r\n\r\nconst apiKey = process.env.NOMICS_API_KEY;\r\nconst interval = process.env.NOMICS_INTERVAL;\r\nconst exchange = process.env.NOMICS_EXCHANGE;\r\nconst market = 'BTCUSDT';\r\n\r\nconst getCoinPricesApi = async () => {\r\n    const currentDate = dateFns.sub(new Date(), { hours: 1 });\r\n    const dateAdd1hour = dateFns.add(new Date(), { hours: 5 });\r\n    let startDate = `${dateFns.format(currentDate, 'yyyy-MM-dd')}T${dateFns.format(currentDate, 'HH:mm:ss')}Z`;\r\n    let finalDate = `${dateFns.format(dateAdd1hour, 'yyyy-MM-dd')}T${dateFns.format(dateAdd1hour, 'HH:mm:ss')}Z`;\r\n    let url = `https://api.nomics.com/v1/exchange_candles?key=${apiKey}&interval=${interval}&exchange=${exchange}&market=${market}&start=${startDate}&end=${finalDate}`;\r\n    \r\n    let response = await fetch(url);\r\n    let data = await response.json();\r\n\r\n    const lastHour = data[data.length - 1];\r\n\r\n    return {\r\n        min: parseFloat(lastHour.low),\r\n        max: parseFloat(lastHour.high)\r\n    };\r\n};\r\n\r\nmodule.exports = getCoinPricesApi;\n\n//# sourceURL=webpack://cripto-alerts/./src/helpers/getCoinPricesApi.js?");

/***/ }),

/***/ "./src/helpers/sendSMS.js":
/*!********************************!*\
  !*** ./src/helpers/sendSMS.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("(__webpack_require__(/*! dotenv */ \"dotenv\").config)();\r\nconst twilio = __webpack_require__(/*! twilio */ \"twilio\");\r\n\r\nconst sendSMS = async (message, phoneNumberDest) => {\r\n    const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);\r\n\r\n    return client.messages.create({\r\n          body: message,\r\n          to: phoneNumberDest,\r\n          from: process.env.TWILIO_PHONE_NUMBER\r\n    })\r\n    .then((response) => response.sid)\r\n    .catch((error) => error)\r\n};\r\n\r\nmodule.exports = sendSMS;\n\n//# sourceURL=webpack://cripto-alerts/./src/helpers/sendSMS.js?");

/***/ }),

/***/ "./src/helpers/verifyAlerts.js":
/*!*************************************!*\
  !*** ./src/helpers/verifyAlerts.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const sendSMS = __webpack_require__(/*! ./sendSMS */ \"./src/helpers/sendSMS.js\");\r\nconst alertsDB = __webpack_require__(/*! ../database/alerts.dynamodb */ \"./src/database/alerts.dynamodb.js\");\r\n\r\nconst asyncForEach = async (items, callback) => {\r\n    for (let item of items) {\r\n        await callback(item);\r\n    }\r\n}\r\n\r\nconst createNextAlerts = async (alert) => {\r\n    const buyAlert = await alertsDB.createNextAlert(alert, 1);\r\n    const sellAlert = await alertsDB.createNextAlert(alert, 2);\r\n    await alertsDB.desactivateAlert(alert.id);\r\n    return {\r\n        buyAlert,\r\n        sellAlert\r\n    };\r\n}\r\n\r\nconst verifyAlerts = async (alerts=[], coinPrices={}) => {\r\n    let logsVerifyAlerts = '';\r\n\r\n    await asyncForEach(alerts, async (alert) => {\r\n        // const coinPrice = coinPrices[alert.pair];\r\n        const coinPrice = coinPrices;\r\n        let messageSMS = '';\r\n    \r\n        if (alert.direction === 1 && alert.price > coinPrice.min) {\r\n          messageSMS += `BTC comprado a ${alert.price} USDT`;\r\n        }\r\n        else if(alert.direction === 2 && alert.price < coinPrice.max) {\r\n          messageSMS += `BTC vendido a ${alert.price} USDT`;\r\n        }\r\n\r\n        if (messageSMS != '') {\r\n            const { buyAlert, sellAlert} = await createNextAlerts(alert);\r\n            messageSMS += buyAlert  ? `, nueva orden de compra ${buyAlert.price} USDT` : '';\r\n            messageSMS += sellAlert ? `, nueva orden de venta ${sellAlert.price} USDT.` : '';\r\n            const sendAlertSMS = await sendSMS(messageSMS, process.env.MY_PHONE_NUMBER);\r\n            messageSMS += ` || SMS: ${sendAlertSMS}`;\r\n        }\r\n\r\n        logsVerifyAlerts += messageSMS;\r\n    });\r\n\r\n    return logsVerifyAlerts;\r\n}\r\n\r\nmodule.exports = verifyAlerts;\r\n\n\n//# sourceURL=webpack://cripto-alerts/./src/helpers/verifyAlerts.js?");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("aws-sdk");

/***/ }),

/***/ "date-fns":
/*!***************************!*\
  !*** external "date-fns" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("date-fns");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "node-fetch-commonjs":
/*!**************************************!*\
  !*** external "node-fetch-commonjs" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node-fetch-commonjs");

/***/ }),

/***/ "twilio":
/*!*************************!*\
  !*** external "twilio" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("twilio");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/handler.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;