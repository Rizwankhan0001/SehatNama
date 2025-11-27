import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Activity } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const RISK_LEVELS = [
  { key: 'critical', label: 'Critical', color: '#dc2626', gradient: 'from-red-600 to-rose-700', description: 'Emergency response required', icon: '🚨' },
  { key: 'high', label: 'High', color: '#f97316', gradient: 'from-orange-500 to-red-500', description: 'Immediate monitoring', icon: '⚠️' },
  { key: 'medium', label: 'Medium', color: '#eab308', gradient: 'from-yellow-400 to-orange-400', description: 'Watch closely', icon: '⚡' },
  { key: 'low', label: 'Low', color: '#10b981', gradient: 'from-emerald-500 to-teal-500', description: 'Stable / healthy', icon: '✅' }
];

const getRiskColor = (level) => {
  const match = RISK_LEVELS.find(item => item.key === level);
  return match?.color || '#6b7280';
};

const formatName = (text = '') => text.charAt(0).toUpperCase() + text.slice(1);

const formatNumber = (value) => Number.isFinite(value) ? value : '—';

const normalizedRadius = (score = 0) => {
  const base = Math.max(8, Math.min(score, 100) / 2);
  return base;
};

export default function RiskMap({ predictions = [], diseaseType }) {
  const center = [20.5937, 78.9629];
  const plotted = predictions.filter(
    (pred) => pred?.location?.lat && pred?.location?.lon
  );

  const levelTally = RISK_LEVELS.map(level => ({
    ...level,
    count: predictions.filter(p => p.riskLevel === level.key).length
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-[580px] rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))'
      }}
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-xl" />
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide font-bold" style={{ color: '#8b5cf6' }}>🗺️ Live Risk Map</p>
              <h2 className="text-2xl font-bold gradient-text">
                {formatName(diseaseType)} Outbreak Zones
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg"
            >
              <Activity className="w-3 h-3" />
              Live
            </motion.div>
            <span className="px-3 py-2 rounded-full bg-white/80 text-xs font-bold text-violet-700 shadow-md">
              {plotted.length} Zones
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {levelTally.map(level => (
            <motion.span 
              key={level.key} 
              whileHover={{ scale: 1.05 }}
              className={`px-3 py-2 rounded-full text-xs font-bold text-white shadow-lg bg-gradient-to-r ${level.gradient}`}
            >
              <span className="mr-1">{level.icon}</span>
              {level.label}: {level.count}
            </motion.span>
          ))}
        </div>

        <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
          <MapContainer
            center={center}
            zoom={5}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {plotted.map((pred, idx) => (
            <CircleMarker
              key={`${pred.location?.name}-${idx}`}
              center={[pred.location.lat, pred.location.lon]}
              radius={normalizedRadius(pred.riskScore)}
              fillColor={getRiskColor(pred.riskLevel)}
              color="#fff"
              weight={1.5}
              opacity={0.9}
              fillOpacity={0.55}
            >
              <Popup>
                <div className="space-y-2 p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{RISK_LEVELS.find(l => l.key === pred.riskLevel)?.icon || '📍'}</span>
                    <p className="font-bold text-lg">{pred.location?.name || 'Unknown location'}</p>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${RISK_LEVELS.find(l => l.key === pred.riskLevel)?.gradient || 'from-gray-400 to-gray-500'}`}>
                    {formatName(pred.riskLevel)} Risk
                  </div>
                  <div className="bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-lg p-2">
                    <p className="text-sm font-bold text-violet-700">Risk Score: {Math.round(pred.riskScore || 0)}/100</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <p className="text-blue-600 font-semibold">🌡️ Temp</p>
                      <p className="font-bold text-blue-800">{formatNumber(pred.factors?.temperature)}°C</p>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-2 text-center">
                      <p className="text-cyan-600 font-semibold">💧 Humidity</p>
                      <p className="font-bold text-cyan-800">{formatNumber(pred.factors?.humidity)}%</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-2 text-center">
                      <p className="text-indigo-600 font-semibold">🌧️ Rain</p>
                      <p className="font-bold text-indigo-800">{formatNumber(pred.factors?.rainfall)}mm</p>
                    </div>
                  </div>
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]}>
                {pred.location?.name || 'Unknown'}
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>

          {!plotted.length && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
              <div className="text-center p-6 rounded-2xl bg-white/90 shadow-xl">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No coordinates available yet.</p>
                <p className="text-xs text-slate-500 mt-1">Generate predictions to see risk zones</p>
              </div>
            </div>
          )}

          <div className="absolute right-4 bottom-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border-2 border-white/50 w-64">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
              <p className="text-xs font-bold text-violet-700 uppercase tracking-wide">Risk Legend</p>
            </div>
            <div className="space-y-2">
              {RISK_LEVELS.map(level => (
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-violet-50 transition-colors" 
                  key={level.key}
                >
                  <span className="text-lg">{level.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: level.color }}>{level.label}</p>
                    <p className="text-xs text-slate-600">{level.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
