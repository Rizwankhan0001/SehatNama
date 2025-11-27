import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function PreventiveTips({ predictions, diseaseType }) {
  const highRiskPredictions = predictions.filter(p => 
    p.riskLevel === 'high' || p.riskLevel === 'critical'
  );

  const allTips = highRiskPredictions.length > 0
    ? highRiskPredictions[0].preventiveTips
    : predictions[0]?.preventiveTips || [];

  const isCropDisease = diseaseType === 'crop';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 h-[500px] overflow-y-auto"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold gradient-text">
          {isCropDisease ? 'Farmer Guidelines' : 'Preventive Tips'}
        </h2>
      </div>

      {highRiskPredictions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">High Risk Alert!</p>
              <p className="text-sm text-red-700">
                {highRiskPredictions.length} zone(s) at high risk. Follow these guidelines carefully.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {allTips.map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-all"
          >
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{tip}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          💡 Tips updated based on real-time weather data and AI predictions
        </p>
      </div>
    </motion.div>
  );
}
