import React from 'react';
import { Star, MapPin, Calendar, Award } from 'lucide-react';
import { Doctor } from '../types';

const animationStyles = `
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
    50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6), 0 0 40px rgba(168, 85, 247, 0.4); }
  }
  
  .animate-slide-up {
    animation: slide-up 0.6s ease-out;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-glow-pulse {
    animation: glow-pulse 2s ease-in-out infinite;
  }
  
  .shimmer-effect {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
`;

// Inject enhanced styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

// Add staggered animation delay
const getAnimationDelay = (index: number) => {
  return { animationDelay: `${index * 100}ms` };
};

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctorId: string) => void;
  onViewProfile: (doctorId: string) => void;
  index?: number;
  userLocation?: { lat: number; lng: number } | null;
  userCity?: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookAppointment, onViewProfile, index = 0, userLocation, userCity }) => {
  
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };
  
  const getDistance = () => {
    if (userLocation && doctor.location.coordinates?.coordinates) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        doctor.location.coordinates.coordinates[1],
        doctor.location.coordinates.coordinates[0]
      );
      return distance.toFixed(1);
    }
    return null;
  };
  
  const distance = getDistance();
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 max-w-2xl animate-slide-up" style={getAnimationDelay(index)}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/20 to-pink-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100"></div>
      
      {/* Top accent line with animation */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      
      <div className="relative p-4">
        <div className="flex gap-4">
          {/* Avatar with float animation */}
          <div className="relative flex-shrink-0 animate-float">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-3 animate-glow-pulse">
              {doctor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xs">✓</span>
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-xl border-2 border-blue-400 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors duration-300">Dr. {doctor.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium group-hover:bg-blue-200 transition-colors duration-300">
                    {doctor.specialty}
                  </span>
                  <span className="inline-flex items-center gap-1 text-gray-600 text-xs group-hover:text-purple-600 transition-colors duration-300">
                    <Award className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                    {doctor.experience}y exp
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-gradient-to-br from-yellow-50 to-orange-50 px-2 py-1 rounded-lg border border-yellow-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-md">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 group-hover:animate-spin" />
                <span className="text-sm font-bold text-gray-900">{doctor.rating}</span>
              </div>
            </div>
            
            {/* Info Row */}
            <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                <MapPin className="w-3.5 h-3.5 text-blue-500 group-hover:scale-125 transition-transform duration-300" />
                <span className="group-hover:text-blue-600 transition-colors duration-300">{doctor.location.city}</span>
                {distance && <span className="text-blue-600 font-medium group-hover:scale-110 transition-transform duration-300">• {distance}km</span>}
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md group-hover:bg-green-100 transition-colors duration-300">
                <span className="text-green-600 font-semibold group-hover:scale-110 inline-block transition-transform duration-300">₹{doctor.consultationFee}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onBookAppointment(doctor._id)}
                className="flex-1 relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-xl transform hover:scale-105 active:scale-95 group/btn"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                <Calendar className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                <span className="relative">Book Now</span>
              </button>
              <button
                onClick={() => onViewProfile(doctor._id)}
                className="px-4 py-2 bg-gray-100 hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-900 rounded-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;