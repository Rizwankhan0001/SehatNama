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
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Find the Right Doctor for You
          </h1>
          <p className="text-xl text-primary-100">
            Search by location, specialty, or doctor name
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl shadow-modern p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-white mb-2">
                🔍 Doctor or Condition
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-indigo-300" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-900 placeholder-slate-500 text-sm font-medium transition-all duration-200"
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-white mb-2">
                📍 Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-indigo-300" />
                <input
                  type="text"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-900 placeholder-slate-500 text-sm font-medium transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={onLocationRequest}
                  className="absolute right-2 top-2 p-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                  title="Use my location"
                >
                  <MapPin className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-white mb-2">
                🏥 Specialty
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-900 text-sm font-medium transition-all duration-200"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec} className="text-slate-900">
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full gradient-primary text-white py-2.5 px-4 rounded-xl font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-sm"
              >
                ✨ Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;