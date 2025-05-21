import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './weather-page.css';

const WeatherPage = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [recentCities, setRecentCities] = useState([]);

  const fetchWeather = async () => {
    try {
      const res = await axios.post('http://localhost:5000/weather', { city });
      setWeather(res.data);
      fetchRecent();
    } catch (err) {
      alert('City not found or server error');
    }
  };
  const fetchWeatherByCity = async (cityName) => {
  try {
    const res = await axios.post('http://localhost:5000/weather', { city: cityName });
    setWeather(res.data);
  } catch (err) {
    alert('City not found or server error');
  }
};


  const fetchRecent = async () => {
    const res = await axios.get('http://localhost:5000/recent');
    setRecentCities(res.data);
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  return (
    <div className="weather-page">
      <h1>Weather App</h1>
      <div className="search-bar">
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name" />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temp: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}

      <div className="recent-section">
        <h3>Recent Searches</h3>
       <ul>
  {recentCities.map((c) => (
    <li key={c.id}>
      <button
        className="recent-btn"
        onClick={() => {
          setCity(c.city_name);
          fetchWeatherByCity(c.city_name);
        }}
      >
        {c.city_name}
      </button>
    </li>
  ))}
</ul>

      </div>
    </div>
  );
};

export default WeatherPage;
