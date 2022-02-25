const fetch = require('node-fetch-commonjs');
const dateFns = require('date-fns');

const apiKey = process.env.NOMICS_API_KEY;
const interval = process.env.NOMICS_INTERVAL;
const exchange = process.env.NOMICS_EXCHANGE;

const getCoinPricesApi = async (coinPair) => {
    const currentDate = dateFns.sub(new Date(), { hours: 1 });
    const dateAdd1hour = dateFns.add(new Date(), { hours: 5 });
    let startDate = `${dateFns.format(currentDate, 'yyyy-MM-dd')}T${dateFns.format(currentDate, 'HH:mm:ss')}Z`;
    let finalDate = `${dateFns.format(dateAdd1hour, 'yyyy-MM-dd')}T${dateFns.format(dateAdd1hour, 'HH:mm:ss')}Z`;
    let url = `https://api.nomics.com/v1/exchange_candles?key=${apiKey}&interval=${interval}&exchange=${exchange}&market=${coinPair.pair}&start=${startDate}&end=${finalDate}`;
    
    const response = await fetch(url);

    if (response.status != 200) {
        throw new Error(`Nomics API: ${response.statusText}`);
    }
    
    const data = await response.json();

    if (data.length === 0) {
        throw new Error('Nomics API: Response JSON is empty');
    }

    const lastHour = data[data.length - 1];

    return {
        min: parseFloat(lastHour.low),
        max: parseFloat(lastHour.high)
    };
};

module.exports = getCoinPricesApi;