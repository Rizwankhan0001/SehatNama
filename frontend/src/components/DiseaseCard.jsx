import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

const getRiskBadge = (level) => {
  const styles = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
    critical: 'bg-red-900 text-white'
  };
  return styles[level] || 'bg-gray-100 text-gray-800';
};

export default function DiseaseCard({ prediction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-card p-6 hover:shadow-2xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">{prediction.location.name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadge(prediction.riskLevel)}`}>
          {prediction.riskLevel.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Risk Score</span>
              <span className="font-bold">{prediction.riskScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${prediction.riskScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-gray-600">Temp</p>
            <p className="font-bold">{prediction.factors.temperature}°C</p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <p className="text-gray-600">Humidity</p>
            <p className="font-bold">{prediction.factors.humidity}%</p>
          </div>
          <div className="bg-pink-50 p-2 rounded">
            <p className="text-gray-600">Rain</p>
            <p className="font-bold">{prediction.factors.rainfall}mm</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
