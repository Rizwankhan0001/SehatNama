import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  location: {
    name: String,
    lat: Number,
    lon: Number
  },
  diseaseType: {
    type: String,
    enum: ['dengue', 'malaria', 'flu', 'crop']
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical']
  },
  riskScore: Number,
  factors: {
    temperature: Number,
    humidity: Number,
    rainfall: Number
  },
  preventiveTips: [String],
  timestamp: { type: Date, default: Date.now },
  validUntil: Date
});

export default mongoose.model('Prediction', predictionSchema);
