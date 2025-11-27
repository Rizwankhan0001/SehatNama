import Prediction from '../models/Prediction.js';

const PREVENTIVE_TIPS = {
  dengue: {
    high: [
      'Eliminate standing water around your home',
      'Use mosquito repellent and wear long sleeves',
      'Install window screens and use bed nets',
      'Clean water containers weekly',
      'Seek medical attention if fever develops'
    ],
    medium: [
      'Remove water from plant pots and containers',
      'Use mosquito repellent during peak hours',
      'Keep surroundings clean and dry'
    ],
    low: ['Maintain general hygiene', 'Monitor for symptoms']
  },
  malaria: {
    high: [
      'Sleep under insecticide-treated bed nets',
      'Apply mosquito repellent before dusk',
      'Wear protective clothing in evenings',
      'Consider prophylactic medication',
      'Eliminate breeding sites near homes'
    ],
    medium: [
      'Use mosquito nets while sleeping',
      'Apply repellent during evening hours',
      'Keep windows closed at dusk'
    ],
    low: ['Use basic mosquito protection', 'Stay aware of symptoms']
  },
  flu: {
    high: [
      'Get vaccinated immediately',
      'Wash hands frequently with soap',
      'Avoid crowded places',
      'Wear masks in public areas',
      'Boost immunity with vitamin C'
    ],
    medium: [
      'Practice good hand hygiene',
      'Avoid close contact with sick people',
      'Consider flu vaccination'
    ],
    low: ['Maintain healthy lifestyle', 'Stay hydrated']
  },
  crop: {
    high: [
      'Apply fungicides preventively',
      'Improve field drainage immediately',
      'Remove infected plants',
      'Increase air circulation between crops',
      'Monitor fields daily for disease signs'
    ],
    medium: [
      'Inspect crops regularly',
      'Ensure proper spacing between plants',
      'Apply organic fungicides if needed'
    ],
    low: ['Follow standard crop management', 'Monitor weather patterns']
  }
};

export function getRiskLevel(score) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

export async function generatePredictions(weatherData) {
  const predictions = [];
  const diseases = ['dengue', 'malaria', 'flu', 'crop'];
  
  for (const disease of diseases) {
    const score = weatherData.riskScores[disease === 'crop' ? 'cropDisease' : disease];
    const riskLevel = getRiskLevel(score);
    
    const prediction = new Prediction({
      location: weatherData.location,
      diseaseType: disease,
      riskLevel,
      riskScore: score,
      factors: {
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        rainfall: weatherData.rainfall,
        aqi: weatherData.aqi
      },
      preventiveTips: PREVENTIVE_TIPS[disease][riskLevel] || PREVENTIVE_TIPS[disease].low,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    predictions.push(await prediction.save());
  }
  
  return predictions;
}
