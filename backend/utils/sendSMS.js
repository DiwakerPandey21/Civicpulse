const axios = require('axios');

const sendSMS = async (options) => {
    // Check if RapidAPI Key is provided
    if (!process.env.RAPIDAPI_KEY) {
        console.warn("RAPIDAPI_KEY is missing in .env. SMS skipped.");
        return;
    }

    const encodedParams = new URLSearchParams();
    encodedParams.set('content', options.message);
    encodedParams.set('from', 'CivicPulse');
    encodedParams.set('to', options.phone);

    const config = {
        method: 'POST',
        url: 'https://d7sms.p.rapidapi.com/secure/send',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'd7sms.p.rapidapi.com'
        },
        data: encodedParams,
    };

    try {
        const response = await axios.request(config);
        console.log(`SMS sent to ${options.phone}:`, response.data);
    } catch (error) {
        console.error("Error sending SMS via RapidAPI:", error.response ? error.response.data : error.message);
    }
};

module.exports = sendSMS;
