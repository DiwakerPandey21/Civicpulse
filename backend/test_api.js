const https = require('https');

const apiKey = '579b464db66ec23bdd0000017808648a43d646f7606b27a16aa32b9a';
const resourceId = 'f1087af2-2f87-44f1-9782-a94aa46207cb';
const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=5`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(JSON.parse(data));
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
