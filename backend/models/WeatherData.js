import mongoose from 'mongoose';

const weatherDataSchema = new mongoose.Schema({
  location: {
    name: String,
    lat: Number,
    lon: Number
  },
  temperature: Number,
  humidity: Number,
  rainfall: Number,
  windSpeed: Number,
  pressure: Number,
  aqi: Number,
  timestamp: { type: Date, default: Date.now },
  riskScores: {
    dengue: Number,
    malaria: Number,
    flu: Number,
    cropDisease: Number
  }
});

export default mongoose.model('WeatherData', weatherDataSchema);
