# Prescure

AI-Powered Disease Outbreak Prediction System using Weather Data

## Features

🌡️ **Real-time Weather Integration** - Fetches live weather data (temperature, humidity, rainfall)  
🗺️ **Interactive Risk Maps** - Color-coded zones showing disease outbreak risks  
🤖 **AI Predictions** - ML-based risk scoring for dengue, malaria, flu, and crop diseases  
💡 **Preventive Tips** - Personalized guidelines for people and farmers  
📊 **Beautiful Dashboard** - Modern UI with animations and real-time updates  

## Tech Stack

**Frontend:** React + Vite + Tailwind CSS + Leaflet Maps + Framer Motion  
**Backend:** Node.js + Express + MongoDB + OpenWeatherMap API  

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prescure
WEATHER_API_KEY=your_openweathermap_api_key
NODE_ENV=development
```

3. Get free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. Start MongoDB (make sure it's installed):
```bash
mongod
```

5. Run backend:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:3000`

## API Endpoints

### Weather
- `GET /api/weather/current` - Get current weather data
- `GET /api/weather/history?location=Mumbai&days=7` - Get historical data

### Predictions
- `GET /api/predictions/all` - Get all active predictions
- `GET /api/predictions/disease/:type` - Get predictions by disease type
- `POST /api/predictions/generate` - Generate new predictions
- `GET /api/predictions/high-risk-zones` - Get high-risk zones

## Disease Risk Calculation

The system calculates risk scores (0-100) based on:

**Dengue:** High temp (25-35°C) + High humidity (>70%) + Rainfall (>5mm)  
**Malaria:** Moderate temp (20-30°C) + High humidity (>60%) + Heavy rain (>10mm)  
**Flu:** Low temp (<20°C) + Moderate humidity (50-80%) + Any rainfall  
**Crop Disease:** High humidity (>80%) + Heavy rain (>15mm) + High temp (>28°C)  

## Risk Levels

- **Low (0-24):** Minimal risk, basic precautions
- **Medium (25-49):** Moderate risk, follow preventive measures
- **High (50-74):** Significant risk, take immediate action
- **Critical (75-100):** Severe risk, urgent intervention needed

## Features Breakdown

### Interactive Map
- Color-coded markers based on risk levels
- Click markers for detailed information
- Real-time updates every 5 minutes

### Weather Dashboard
- Live temperature, humidity, rainfall, wind speed
- Historical trends and patterns
- City-wise comparisons

### Preventive Tips
- Disease-specific guidelines
- Separate tips for farmers (crop diseases)
- Risk-level based recommendations

## Production Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
