require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHERSTACK_API_KEY;

app.get('/weather', async (req, res) => {
    const location = req.query.location;

    if (!location) {
        return res.status(400).send('Please provide a correct location');
    }

    try {
        const response = await axios.get(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${location}`);
        const data = response.data;

        if (data.error) {
            return res.status(404).send(data.error.info);
        }

        const weatherInfo = {
            location: data.location.name,
            region: data.location.region,
            country: data.location.country,
            temperature: data.current.temperature,
            weather_descriptions: data.current.weather_descriptions,
            wind_speed: data.current.wind_speed,
            humidity: data.current.humidity,
            observation_time: data.current.observation_time,
        };

        res.json(weatherInfo);
    } catch (error) {
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});