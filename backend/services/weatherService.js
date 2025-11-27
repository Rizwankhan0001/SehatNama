import axios from 'axios';
import WeatherData from '../models/WeatherData.js';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MAJOR_CITIES = [
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 }
];

export async function fetchWeatherData(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      rainfall: response.data.rain?.['1h'] || 0,
      windSpeed: response.data.wind.speed,
      pressure: response.data.main.pressure
    };
  } catch (error) {
    console.error('Weather API error:', error.message);
    return null;
  }
}

export async function updateWeatherData() {
  for (const city of MAJOR_CITIES) {
    const weather = await fetchWeatherData(city.lat, city.lon);
    if (weather) {
      const weatherData = new WeatherData({
        location: city,
        ...weather,
        riskScores: calculateRiskScores(weather)
      });
      await weatherData.save();
    }
  }
}

function calculateRiskScores(weather) {
  const { temperature, humidity, rainfall } = weather;
  
  const dengue = Math.min(100, 
    (temperature > 25 && temperature < 35 ? 40 : 0) +
    (humidity > 70 ? 40 : 0) +
    (rainfall > 5 ? 20 : 0)
  );
  
  const malaria = Math.min(100,
    (temperature > 20 && temperature < 30 ? 35 : 0) +
    (humidity > 60 ? 35 : 0) +
    (rainfall > 10 ? 30 : 0)
  );
  
  const flu = Math.min(100,
    (temperature < 20 ? 50 : 0) +
    (humidity > 50 && humidity < 80 ? 30 : 0) +
    (rainfall > 0 ? 20 : 0)
  );
  
  const cropDisease = Math.min(100,
    (humidity > 80 ? 50 : 0) +
    (rainfall > 15 ? 30 : 0) +
    (temperature > 28 ? 20 : 0)
  );
  
  return { dengue, malaria, flu, cropDisease };
}
