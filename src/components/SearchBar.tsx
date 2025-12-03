import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import apiService from '../services/api';

interface SearchBarProps {
  onSearch: (query: string, location: string, specialty: string) => void;
  onLocationRequest: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationRequest }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [specialties, setSpecialties] = useState<string[]>(['All Specialties']);
  
  React.useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await apiService.getSpecialties();
        setSpecialties(response.data);
      } catch (error) {
        console.error('Error loading specialties:', error);
      }
    };
    
    loadSpecialties();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location, specialty);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="glass rounded-xl sm:rounded-2xl shadow-modern p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-white mb-1.5 sm:mb-2">
              🔍 Doctor
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-300" />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-2.5 sm:pr-3 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-900 placeholder-slate-500 text-xs sm:text-sm font-medium transition-all duration-200"
              />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-white mb-1.5 sm:mb-2">
              📍 Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-300" />
              <input
                type="text"
                placeholder="City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-9 sm:pr-10 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-900 placeholder-slate-500 text-xs sm:text-sm font-medium transition-all duration-200"
              />
              <button
                type="button"
                onClick={onLocationRequest}
                className="absolute right-2 top-2 p-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                title="Use my location"
              >
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-white mb-1.5 sm:mb-2">
              🏥 Specialty
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-900 text-xs sm:text-sm font-medium transition-all duration-200"
            >
              {specialties.map((spec) => (
                <option key={spec} value={spec} className="text-slate-900">
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full gradient-primary text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
            >
              ✨ Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;