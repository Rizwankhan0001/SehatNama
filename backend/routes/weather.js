import express from 'express';
import WeatherData from '../models/WeatherData.js';
import { fetchWeatherData } from '../services/weatherService.js';

const router = express.Router();

router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (lat && lon) {
      const weather = await fetchWeatherData(parseFloat(lat), parseFloat(lon));
      return res.json(weather);
    }
    
    const latestData = await WeatherData.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(latestData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { location, days = 7 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const query = location ? { 'location.name': location } : {};
    const history = await WeatherData.find({
      ...query,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
