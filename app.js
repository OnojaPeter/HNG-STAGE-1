require('dotenv').config();
const express = require('express');
const axios = require('axios');
const requestIp = require('request-ip');

const app = express();
const PORT = 3000;

app.use(requestIp.mw());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/hello', async function (req,res) {
    const visitorName = req.query.visitor_name;
    //  req.clientIp
    const visitorIp = "8.8.8.8";
    try {
        //REQUEST TO GET CITY
        const locationResponse = await axios.get(`http://ip-api.com/json/${visitorIp}`);
        const locationData = locationResponse.data;
        const city = locationData.city || 'Unknown location';

        //REQUEST TO GET TEMP
        const weatherApiKey = process.env.MY_WEATHER_API;
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`);
        const temperature = weatherResponse.data.main.temp;

        res.json({
            client_ip: visitorIp,
            location: city,
            greeting: `Hello, ${visitorName}!, The temperature is ${temperature} degrees Celsius in ${city}`
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});