import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import SearchBar from './SearchBar';

interface HeroSectionProps {
  filteredDoctors: any[];
  onSearch: (query: string, location: string, specialty: string) => void;
  onLocationRequest: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ filteredDoctors, onSearch, onLocationRequest }) => {
  const { t } = useTranslation();

  return (
    <div className="relative gradient-primary text-white py-6 sm:py-8 md:py-10 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-5"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-white opacity-10 rounded-full animate-float"></div>
      <div className="absolute -bottom-5 -left-5 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 sm:space-x-4 animate-slide-up">
            <div className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-xl sm:rounded-2xl flex items-center justify-center animate-pulse-glow">
              <span className="text-xl sm:text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display">
                {t('findPerfectDoctor')}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-sm font-medium">
                {t('aiPoweredPlatform')}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 md:space-x-3 text-xs animate-slide-in-right">
            <div className="glass rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-center hover-glow transition-all duration-300">
              <div className="text-lg sm:text-xl font-bold text-white font-display">{filteredDoctors.length}</div>
              <div className="text-indigo-200 text-xs">{t('doctors')}</div>
            </div>
            <div className="text-center bg-white bg-opacity-10 rounded-lg px-2 sm:px-3 py-2">
              <div className="text-base sm:text-lg font-bold text-yellow-300">{filteredDoctors.filter(d => d.rating >= 4.5).length}</div>
              <div className="text-blue-200 text-xs">{t('topRated')}</div>
            </div>
            <div className="text-center bg-white bg-opacity-10 rounded-lg px-2 sm:px-3 py-2">
              <div className="text-base sm:text-lg font-bold text-yellow-300">{new Set(filteredDoctors.map(d => d.specialty)).size}</div>
              <div className="text-blue-200 text-xs">{t('specialties')}</div>
            </div>
          </div>
        </div>
        <SearchBar onSearch={onSearch} onLocationRequest={onLocationRequest} />
      </div>
    </div>
  );
};

export default HeroSection;