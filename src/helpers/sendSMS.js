require('dotenv').config();
const twilio = require('twilio');

const sendSMS = async (message, phoneNumberDest) => {
    const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    return client.messages.create({
          body: message,
          to: phoneNumberDest,
          from: process.env.TWILIO_PHONE_NUMBER
    })
    .then((response) => response.sid)
    .catch((error) => error)
};

module.exports = sendSMS;