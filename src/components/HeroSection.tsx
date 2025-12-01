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
    <div className="relative gradient-primary text-white py-8 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-5"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full animate-float"></div>
      <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 animate-slide-up">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center animate-pulse-glow">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display">
                {t('findPerfectDoctor')}
              </h1>
              <p className="text-indigo-200 text-sm font-medium">
                {t('aiPoweredPlatform')}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3 text-xs animate-slide-in-right">
            <div className="glass rounded-2xl px-4 py-3 text-center hover-glow transition-all duration-300">
              <div className="text-xl font-bold text-white font-display">{filteredDoctors.length}</div>
              <div className="text-indigo-200 text-xs">{t('doctors')}</div>
            </div>
            <div className="text-center bg-white bg-opacity-10 rounded-lg px-3 py-2">
              <div className="text-lg font-bold text-yellow-300">{filteredDoctors.filter(d => d.rating >= 4.5).length}</div>
              <div className="text-blue-200">{t('topRated')}</div>
            </div>
            <div className="text-center bg-white bg-opacity-10 rounded-lg px-3 py-2">
              <div className="text-lg font-bold text-yellow-300">{new Set(filteredDoctors.map(d => d.specialty)).size}</div>
              <div className="text-blue-200">{t('specialties')}</div>
            </div>
          </div>
        </div>
        <SearchBar onSearch={onSearch} onLocationRequest={onLocationRequest} />
      </div>
    </div>
  );
};

export default HeroSection;