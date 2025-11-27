import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import weatherRoutes from './routes/weather.js';
import predictionRoutes from './routes/predictions.js';
import { updateWeatherData } from './services/weatherService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prescure')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/api/weather', weatherRoutes);
app.use('/api/predictions', predictionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

cron.schedule('0 */6 * * *', () => {
  console.log('🔄 Updating weather data...');
  updateWeatherData();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
