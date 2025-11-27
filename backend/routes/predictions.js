import express from 'express';
import Prediction from '../models/Prediction.js';
import WeatherData from '../models/WeatherData.js';
import { generatePredictions } from '../services/predictionService.js';

const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const predictions = await Prediction.find({
      validUntil: { $gte: new Date() }
    }).sort({ timestamp: -1 });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/disease/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const predictions = await Prediction.find({
      diseaseType: type,
      validUntil: { $gte: new Date() }
    }).sort({ riskScore: -1 });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    let latestWeather = await WeatherData.find()
      .sort({ timestamp: -1 })
      .limit(5);
    
    // If no weather data exists, create mock data
    if (latestWeather.length === 0) {
      const mockCities = [
        // Metro Cities
        { name: 'Mumbai', lat: 19.0760, lon: 72.8777, temp: 32, humidity: 75, rainfall: 8 },
        { name: 'Delhi', lat: 28.7041, lon: 77.1025, temp: 28, humidity: 65, rainfall: 3 },
        { name: 'Bangalore', lat: 12.9716, lon: 77.5946, temp: 26, humidity: 70, rainfall: 5 },
        { name: 'Kolkata', lat: 22.5726, lon: 88.3639, temp: 30, humidity: 80, rainfall: 12 },
        { name: 'Chennai', lat: 13.0827, lon: 80.2707, temp: 31, humidity: 78, rainfall: 6 },
        { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, temp: 29, humidity: 68, rainfall: 4 },
        { name: 'Pune', lat: 18.5204, lon: 73.8567, temp: 27, humidity: 72, rainfall: 7 },
        { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, temp: 33, humidity: 60, rainfall: 2 },
        
        // North India
        { name: 'Jaipur', lat: 26.9124, lon: 75.7873, temp: 30, humidity: 55, rainfall: 3 },
        { name: 'Lucknow', lat: 26.8467, lon: 80.9462, temp: 29, humidity: 68, rainfall: 5 },
        { name: 'Kanpur', lat: 26.4499, lon: 80.3319, temp: 30, humidity: 66, rainfall: 4 },
        { name: 'Agra', lat: 27.1767, lon: 78.0081, temp: 31, humidity: 62, rainfall: 3 },
        { name: 'Varanasi', lat: 25.3176, lon: 82.9739, temp: 32, humidity: 70, rainfall: 6 },
        { name: 'Chandigarh', lat: 30.7333, lon: 76.7794, temp: 27, humidity: 60, rainfall: 4 },
        { name: 'Amritsar', lat: 31.6340, lon: 74.8723, temp: 28, humidity: 58, rainfall: 3 },
        { name: 'Dehradun', lat: 30.3165, lon: 78.0322, temp: 25, humidity: 65, rainfall: 8 },
        { name: 'Shimla', lat: 31.1048, lon: 77.1734, temp: 18, humidity: 70, rainfall: 10 },
        { name: 'Srinagar', lat: 34.0837, lon: 74.7973, temp: 20, humidity: 55, rainfall: 5 },
        
        // South India
        { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, temp: 28, humidity: 72, rainfall: 6 },
        { name: 'Madurai', lat: 9.9252, lon: 78.1198, temp: 30, humidity: 75, rainfall: 5 },
        { name: 'Kochi', lat: 9.9312, lon: 76.2673, temp: 29, humidity: 82, rainfall: 12 },
        { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366, temp: 30, humidity: 80, rainfall: 10 },
        { name: 'Mysore', lat: 12.2958, lon: 76.6394, temp: 27, humidity: 68, rainfall: 6 },
        { name: 'Mangalore', lat: 12.9141, lon: 74.8560, temp: 29, humidity: 85, rainfall: 15 },
        { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, temp: 30, humidity: 76, rainfall: 7 },
        { name: 'Vijayawada', lat: 16.5062, lon: 80.6480, temp: 31, humidity: 74, rainfall: 6 },
        { name: 'Warangal', lat: 17.9689, lon: 79.5941, temp: 30, humidity: 65, rainfall: 5 },
        
        // East India
        { name: 'Patna', lat: 25.5941, lon: 85.1376, temp: 31, humidity: 72, rainfall: 8 },
        { name: 'Ranchi', lat: 23.3441, lon: 85.3096, temp: 28, humidity: 68, rainfall: 9 },
        { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, temp: 30, humidity: 78, rainfall: 10 },
        { name: 'Guwahati', lat: 26.1445, lon: 91.7362, temp: 29, humidity: 82, rainfall: 14 },
        { name: 'Imphal', lat: 24.8170, lon: 93.9368, temp: 26, humidity: 75, rainfall: 11 },
        { name: 'Shillong', lat: 25.5788, lon: 91.8933, temp: 22, humidity: 80, rainfall: 16 },
        { name: 'Siliguri', lat: 26.7271, lon: 88.3953, temp: 27, humidity: 76, rainfall: 12 },
        
        // West India
        { name: 'Surat', lat: 21.1702, lon: 72.8311, temp: 32, humidity: 68, rainfall: 5 },
        { name: 'Vadodara', lat: 22.3072, lon: 73.1812, temp: 31, humidity: 65, rainfall: 4 },
        { name: 'Rajkot', lat: 22.3039, lon: 70.8022, temp: 30, humidity: 62, rainfall: 3 },
        { name: 'Nashik', lat: 19.9975, lon: 73.7898, temp: 29, humidity: 66, rainfall: 6 },
        { name: 'Nagpur', lat: 21.1458, lon: 79.0882, temp: 32, humidity: 64, rainfall: 5 },
        { name: 'Aurangabad', lat: 19.8762, lon: 75.3433, temp: 30, humidity: 60, rainfall: 4 },
        { name: 'Indore', lat: 22.7196, lon: 75.8577, temp: 29, humidity: 63, rainfall: 5 },
        { name: 'Bhopal', lat: 23.2599, lon: 77.4126, temp: 28, humidity: 67, rainfall: 6 },
        { name: 'Gwalior', lat: 26.2183, lon: 78.1828, temp: 30, humidity: 64, rainfall: 4 },
        { name: 'Jabalpur', lat: 23.1815, lon: 79.9864, temp: 29, humidity: 68, rainfall: 7 },
        
        // Central India
        { name: 'Raipur', lat: 21.2514, lon: 81.6296, temp: 31, humidity: 70, rainfall: 8 },
        { name: 'Bilaspur', lat: 22.0797, lon: 82.1409, temp: 30, humidity: 68, rainfall: 7 },
        { name: 'Rourkela', lat: 22.2604, lon: 84.8536, temp: 29, humidity: 72, rainfall: 9 },
        
        // Tier 2 Cities
        { name: 'Jodhpur', lat: 26.2389, lon: 73.0243, temp: 33, humidity: 52, rainfall: 2 },
        { name: 'Udaipur', lat: 24.5854, lon: 73.7125, temp: 29, humidity: 58, rainfall: 4 },
        { name: 'Kota', lat: 25.2138, lon: 75.8648, temp: 31, humidity: 60, rainfall: 3 },
        { name: 'Ajmer', lat: 26.4499, lon: 74.6399, temp: 30, humidity: 56, rainfall: 3 },
        { name: 'Bikaner', lat: 28.0229, lon: 73.3119, temp: 34, humidity: 48, rainfall: 2 },
        { name: 'Allahabad', lat: 25.4358, lon: 81.8463, temp: 31, humidity: 68, rainfall: 5 },
        { name: 'Meerut', lat: 28.9845, lon: 77.7064, temp: 29, humidity: 64, rainfall: 4 },
        { name: 'Bareilly', lat: 28.3670, lon: 79.4304, temp: 30, humidity: 66, rainfall: 5 },
        { name: 'Aligarh', lat: 27.8974, lon: 78.0880, temp: 30, humidity: 65, rainfall: 4 },
        { name: 'Moradabad', lat: 28.8389, lon: 78.7378, temp: 29, humidity: 67, rainfall: 5 },
        { name: 'Gorakhpur', lat: 26.7606, lon: 83.3732, temp: 31, humidity: 70, rainfall: 6 },
        { name: 'Saharanpur', lat: 29.9680, lon: 77.5460, temp: 28, humidity: 66, rainfall: 5 },
        { name: 'Ghaziabad', lat: 28.6692, lon: 77.4538, temp: 29, humidity: 65, rainfall: 4 },
        { name: 'Faridabad', lat: 28.4089, lon: 77.3178, temp: 29, humidity: 64, rainfall: 4 },
        { name: 'Noida', lat: 28.5355, lon: 77.3910, temp: 29, humidity: 65, rainfall: 4 },
        { name: 'Gurgaon', lat: 28.4595, lon: 77.0266, temp: 29, humidity: 63, rainfall: 4 },
        { name: 'Panipat', lat: 29.3909, lon: 76.9635, temp: 28, humidity: 64, rainfall: 4 },
        { name: 'Rohtak', lat: 28.8955, lon: 76.6066, temp: 29, humidity: 62, rainfall: 3 },
        { name: 'Karnal', lat: 29.6857, lon: 76.9905, temp: 28, humidity: 65, rainfall: 4 },
        { name: 'Hisar', lat: 29.1492, lon: 75.7217, temp: 30, humidity: 58, rainfall: 3 },
        { name: 'Ambala', lat: 30.3782, lon: 76.7767, temp: 28, humidity: 62, rainfall: 4 },
        { name: 'Patiala', lat: 30.3398, lon: 76.3869, temp: 28, humidity: 63, rainfall: 4 },
        { name: 'Jalandhar', lat: 31.3260, lon: 75.5762, temp: 28, humidity: 64, rainfall: 4 },
        { name: 'Ludhiana', lat: 30.9010, lon: 75.8573, temp: 28, humidity: 65, rainfall: 4 },
        { name: 'Bathinda', lat: 30.2110, lon: 74.9455, temp: 29, humidity: 60, rainfall: 3 },
        { name: 'Jammu', lat: 32.7266, lon: 74.8570, temp: 26, humidity: 62, rainfall: 5 },
        { name: 'Dharamshala', lat: 32.2190, lon: 76.3234, temp: 22, humidity: 68, rainfall: 9 },
        { name: 'Manali', lat: 32.2432, lon: 77.1892, temp: 18, humidity: 65, rainfall: 8 },
        { name: 'Haridwar', lat: 29.9457, lon: 78.1642, temp: 27, humidity: 68, rainfall: 6 },
        { name: 'Rishikesh', lat: 30.0869, lon: 78.2676, temp: 26, humidity: 70, rainfall: 7 },
        { name: 'Nainital', lat: 29.3803, lon: 79.4636, temp: 20, humidity: 72, rainfall: 10 },
        { name: 'Mussoorie', lat: 30.4598, lon: 78.0644, temp: 19, humidity: 70, rainfall: 11 },
        { name: 'Tirupati', lat: 13.6288, lon: 79.4192, temp: 30, humidity: 74, rainfall: 6 },
        { name: 'Guntur', lat: 16.3067, lon: 80.4365, temp: 31, humidity: 72, rainfall: 5 },
        { name: 'Nellore', lat: 14.4426, lon: 79.9865, temp: 31, humidity: 76, rainfall: 6 },
        { name: 'Kakinada', lat: 16.9891, lon: 82.2475, temp: 30, humidity: 78, rainfall: 7 },
        { name: 'Rajahmundry', lat: 17.0005, lon: 81.8040, temp: 30, humidity: 75, rainfall: 7 },
        { name: 'Tirunelveli', lat: 8.7139, lon: 77.7567, temp: 31, humidity: 76, rainfall: 5 },
        { name: 'Salem', lat: 11.6643, lon: 78.1460, temp: 29, humidity: 70, rainfall: 5 },
        { name: 'Vellore', lat: 12.9165, lon: 79.1325, temp: 30, humidity: 72, rainfall: 6 },
        { name: 'Trichy', lat: 10.7905, lon: 78.7047, temp: 30, humidity: 74, rainfall: 5 },
        { name: 'Erode', lat: 11.3410, lon: 77.7172, temp: 29, humidity: 68, rainfall: 5 },
        { name: 'Thanjavur', lat: 10.7870, lon: 79.1378, temp: 30, humidity: 76, rainfall: 6 },
        { name: 'Dindigul', lat: 10.3673, lon: 77.9803, temp: 29, humidity: 70, rainfall: 5 },
        { name: 'Kollam', lat: 8.8932, lon: 76.6141, temp: 30, humidity: 82, rainfall: 11 },
        { name: 'Thrissur', lat: 10.5276, lon: 76.2144, temp: 29, humidity: 80, rainfall: 10 },
        { name: 'Kozhikode', lat: 11.2588, lon: 75.7804, temp: 29, humidity: 81, rainfall: 12 },
        { name: 'Kannur', lat: 11.8745, lon: 75.3704, temp: 29, humidity: 79, rainfall: 11 },
        { name: 'Palakkad', lat: 10.7867, lon: 76.6548, temp: 28, humidity: 75, rainfall: 8 },
        { name: 'Alappuzha', lat: 9.4981, lon: 76.3388, temp: 30, humidity: 83, rainfall: 13 },
        { name: 'Hubli', lat: 15.3647, lon: 75.1240, temp: 28, humidity: 66, rainfall: 6 },
        { name: 'Belgaum', lat: 15.8497, lon: 74.4977, temp: 27, humidity: 70, rainfall: 8 },
        { name: 'Gulbarga', lat: 17.3297, lon: 76.8343, temp: 29, humidity: 64, rainfall: 5 },
        { name: 'Shimoga', lat: 13.9299, lon: 75.5681, temp: 27, humidity: 72, rainfall: 9 },
        { name: 'Tumkur', lat: 13.3392, lon: 77.1006, temp: 27, humidity: 68, rainfall: 6 },
        { name: 'Davangere', lat: 14.4644, lon: 75.9218, temp: 28, humidity: 66, rainfall: 6 }
      ];
      
      for (const city of mockCities) {
        let aqi = Math.floor(50 + Math.random() * 200);
        
        // Fetch real AQI data
        try {
          const aqiResponse = await fetch(`https://api.waqi.info/feed/${city.name}/?token=${process.env.AQI_API_TOKEN || 'demo'}`);
          const aqiData = await aqiResponse.json();
          if (aqiData.status === 'ok' && aqiData.data?.aqi) {
            aqi = aqiData.data.aqi;
          }
        } catch (err) {
          console.log(`AQI fetch failed for ${city.name}, using mock data`);
        }
        
        const riskScores = {
          dengue: Math.min(100, 
            (city.temp > 25 && city.temp < 35 ? 40 : 0) +
            (city.humidity > 70 ? 40 : 0) +
            (city.rainfall > 5 ? 20 : 0)
          ),
          malaria: Math.min(100,
            (city.temp > 20 && city.temp < 30 ? 35 : 0) +
            (city.humidity > 60 ? 35 : 0) +
            (city.rainfall > 10 ? 30 : 0)
          ),
          flu: Math.min(100,
            (city.temp < 20 ? 50 : 0) +
            (city.humidity > 50 && city.humidity < 80 ? 30 : 0) +
            (city.rainfall > 0 ? 20 : 0)
          ),
          cropDisease: Math.min(100,
            (city.humidity > 80 ? 50 : 0) +
            (city.rainfall > 15 ? 30 : 0) +
            (city.temp > 28 ? 20 : 0)
          )
        };
        
        const weatherData = new WeatherData({
          location: { name: city.name, lat: city.lat, lon: city.lon },
          temperature: city.temp,
          humidity: city.humidity,
          rainfall: city.rainfall,
          windSpeed: 5 + Math.random() * 10,
          pressure: 1010 + Math.random() * 20,
          aqi: aqi,
          riskScores
        });
        await weatherData.save();
        latestWeather.push(weatherData);
      }
    }
    
    const allPredictions = [];
    for (const weather of latestWeather) {
      const predictions = await generatePredictions(weather);
      allPredictions.push(...predictions);
    }
    
    res.json(allPredictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/high-risk-zones', async (req, res) => {
  try {
    const highRiskZones = await Prediction.aggregate([
      { $match: { riskLevel: { $in: ['high', 'critical'] } } },
      { $group: {
        _id: '$location.name',
        location: { $first: '$location' },
        diseases: { $push: { type: '$diseaseType', score: '$riskScore' } },
        maxRisk: { $max: '$riskScore' }
      }},
      { $sort: { maxRisk: -1 } }
    ]);
    res.json(highRiskZones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
