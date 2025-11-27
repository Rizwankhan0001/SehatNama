import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';

export default function WeatherStats({ data }) {
  if (!data || data.length === 0) return null;

  const avgTemp = (data.reduce((sum, d) => sum + d.temperature, 0) / data.length).toFixed(1);
  const avgHumidity = (data.reduce((sum, d) => sum + d.humidity, 0) / data.length).toFixed(0);
  const totalRainfall = data.reduce((sum, d) => sum + d.rainfall, 0).toFixed(1);
  const avgWind = (data.reduce((sum, d) => sum + d.windSpeed, 0) / data.length).toFixed(1);

  const stats = [
    { icon: Thermometer, label: 'Avg Temperature', value: `${avgTemp}°C`, color: 'text-red-500', bg: 'bg-red-50' },
    { icon: Droplets, label: 'Avg Humidity', value: `${avgHumidity}%`, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Cloud, label: 'Total Rainfall', value: `${totalRainfall}mm`, color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Wind, label: 'Avg Wind Speed', value: `${avgWind}m/s`, color: 'text-green-500', bg: 'bg-green-50' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-card p-4 hover:shadow-xl transition-all"
        >
          <div className={`${stat.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
