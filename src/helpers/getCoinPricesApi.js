const fetch = require('node-fetch-commonjs');
const dateFns = require('date-fns');

const apiKey = process.env.NOMICS_API_KEY;
const interval = process.env.NOMICS_INTERVAL;
const exchange = process.env.NOMICS_EXCHANGE;
const market = 'BTCUSDT';

const getCoinPricesApi = async () => {
    const currentDate = new Date();
    let startDate = dateFns.format(currentDate, 'yyyy-MM-dd') + 'T00:00:00Z';
    let finalDate = dateFns.format(dateFns.add(currentDate, { days: 1 }), 'yyyy-MM-dd') + 'T23:59:59Z';
    let url = `https://api.nomics.com/v1/exchange_candles?key=${apiKey}&interval=${interval}&exchange=${exchange}&market=${market}&start=${startDate}&end=${finalDate}`;

    let response = await fetch(url);
    let data = await response.json();

    const lastHour = data[data.length - 1];

    return {
        min: parseFloat(lastHour.low),
        max: parseFloat(lastHour.high)
    };
};

module.exports = getCoinPricesApi;