const axios = require('axios');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Use an IIFE (Immediately Invoked Function Expression) to run async code
(async () => {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'weather'
  });

  // Fetch weather and store city
  app.post('/weather', async (req, res) => {
    const { city } = req.body;
    const apiKey = '1e55f540d125a04f0fd7b6141fced381';

    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      // Store city
      await db.execute('INSERT INTO recent_cities (city_name) VALUES (?)', [city]);

      res.json(weatherRes.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch weather' });
    }
  });

  // Get recent cities
  app.get('/recent', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM recent_cities ORDER BY searched_at DESC LIMIT 5');
    res.json(rows);
  });

  app.listen(5000, () => console.log('Server running on port 5000'));
})();
