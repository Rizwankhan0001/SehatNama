import React from 'react';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { Doctor } from '../types';

// Enhanced animation styles
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
  
  .animate-slide-up {
    animation: slide-up 0.6s ease-out;
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
    <div className="group relative bg-white rounded-3xl shadow-modern hover:shadow-glow border border-slate-100 overflow-hidden transform transition-all duration-500 hover:-translate-y-2 animate-slide-up" style={getAnimationDelay(index)}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Top Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>
      
      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Doctor Avatar */}
            <div className="relative">
              <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center text-white font-bold text-xl shadow-glow group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-75"></div>
            </div>
            
            {/* Doctor Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 font-display group-hover:gradient-text transition-all duration-300 mb-1">
                Dr. {doctor.name}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-200">
                  {doctor.specialty}
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-medium">
                  {doctor.experience}y exp
                </span>
              </div>
              <div className="text-slate-500 text-sm">{doctor.experience} years experience</div>
            </div>
          </div>
          
          {/* Rating Badge */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-3 border border-yellow-200 text-center min-w-[80px]">
            <div className="flex items-center justify-center space-x-1 mb-1">
              {renderStars(doctor.rating)}
            </div>
            <div className="text-lg font-bold text-slate-900">{doctor.rating}</div>
            <div className="text-xs text-slate-500">({doctor.reviewCount})</div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 border border-blue-100 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-medium text-indigo-600">Location</span>
            </div>
            <div className="text-sm font-semibold text-slate-800 truncate">{doctor.location.city}</div>
            {distance && (
              <div className="text-xs text-indigo-600 font-medium mt-1">{distance} km away</div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-3 border border-emerald-100 group-hover:from-emerald-100 group-hover:to-green-100 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Fee</span>
            </div>
            <div className="text-sm font-bold text-slate-800">₹{doctor.consultationFee}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-3 border border-purple-100 group-hover:from-purple-100 group-hover:to-pink-100 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium text-purple-600">Available</span>
            </div>
            <div className="text-sm font-semibold text-slate-800">Today</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onBookAppointment(doctor._id)}
            className="flex-1 gradient-primary text-white py-3 px-4 rounded-2xl font-semibold text-sm shadow-glow hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>📅</span>
            <span>Book Appointment</span>
          </button>
          <button 
            onClick={() => onViewProfile(doctor._id)}
            className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 py-3 px-4 rounded-2xl font-medium text-sm hover:from-slate-200 hover:to-slate-300 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 border border-slate-200"
          >
            <span>👁️</span>
            <span>View Profile</span>
          </button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
      <div className="absolute top-1/2 right-2 w-1 h-8 bg-gradient-to-b from-transparent via-indigo-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </div>
  );
};

export default DoctorCard;