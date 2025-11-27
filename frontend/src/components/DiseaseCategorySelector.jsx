import { motion } from 'framer-motion';

export default function DiseaseCategorySelector({ 
  diseaseCategory, 
  setDiseaseCategory, 
  selectedDisease, 
  setSelectedDisease,
  size = 'large' 
}) {
  if (size === 'small') {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setDiseaseCategory('human');
              setSelectedDisease('dengue');
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              diseaseCategory === 'human'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white/80 text-slate-700 border border-slate-300'
            }`}
          >
            👨⚕️ human
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setDiseaseCategory('crop');
              setSelectedDisease('crop');
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              diseaseCategory === 'crop'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'bg-white/80 text-slate-700 border border-slate-300'
            }`}
          >
            🌾 crop
          </motion.button>
        </div>

        {diseaseCategory === 'human' && (
          <div className="flex gap-2">
            {['dengue', 'malaria', 'flu'].map((disease) => (
              <motion.button
                key={disease}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDisease(disease)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                  selectedDisease === disease
                    ? 'bg-violet-500 text-white shadow-md'
                    : 'bg-white/80 text-slate-600 border border-slate-200'
                }`}
              >
                {disease}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
