import 'dotenv/config';
import mongoose from 'mongoose';
import { writeFile } from 'fs/promises';
import path from 'path';
import Prediction from '../backend/models/Prediction.js';
import WeatherData from '../backend/models/WeatherData.js';

const OUTPUT_FILE = path.resolve(process.cwd(), 'prediction_status.json');

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const predictionCount = await Prediction.countDocuments();
  const weatherCount = await WeatherData.countDocuments();
  await writeFile(
    OUTPUT_FILE,
    JSON.stringify({ predictionCount, weatherCount }, null, 2),
    'utf8'
  );
} catch (error) {
  await writeFile(
    OUTPUT_FILE,
    JSON.stringify({ error: error.message }, null, 2),
    'utf8'
  );
} finally {
  await mongoose.disconnect();
}

