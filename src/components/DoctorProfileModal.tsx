import React from 'react';
import { X, Star, MapPin, Clock, DollarSign, GraduationCap, Languages } from 'lucide-react';
import { Doctor } from '../types';

// Add custom CSS for animations
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

interface DoctorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onBookAppointment: (doctorId: string) => void;
}

const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  doctor, 
  onBookAppointment 
}) => {
  if (!isOpen || !doctor) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header with gradient background */}
        <div className="relative gradient-primary text-white p-6 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative flex justify-between items-start">
            <div className="flex items-center space-x-6 flex-1">
              {/* Doctor Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold font-display">Dr. {doctor.name}</h2>
                  <div className="bg-yellow-400 bg-opacity-20 px-3 py-1 rounded-full">
                    <span className="text-yellow-100 text-sm font-semibold">Verified</span>
                  </div>
                </div>
                <p className="text-indigo-200 text-lg font-medium mb-2">{doctor.specialty}</p>
                <p className="text-cyan-200 mb-3">{doctor.experience} years of experience</p>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    {renderStars(doctor.rating)}
                    <span className="font-bold text-white">{doctor.rating}</span>
                    <span className="text-cyan-200">({doctor.reviewCount} reviews)</span>
                  </div>
                  <div className="bg-green-400 bg-opacity-20 px-4 py-2 rounded-full">
                    <span className="text-cyan-100 font-bold font-display">₹{doctor.consultationFee}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="ml-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* About Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👨‍⚕️</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">About Doctor</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
              </div>

              {/* Location Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Location</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 font-medium">{doctor.location.address}</p>
                  <p className="text-gray-600">{doctor.location.city}</p>
                </div>
              </div>

              {/* Languages Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Languages className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Languages</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-2 rounded-xl text-sm font-medium border border-purple-200 transform hover:scale-105 transition-all duration-200"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Availability Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Availability</h4>
                </div>
                <div className="grid gap-3">
                  {doctor.availability.map((avail, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-orange-200 transform hover:scale-105 transition-all duration-200">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900">{avail.day}</p>
                        <p className="text-sm text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded-lg">
                          {avail.startTime} - {avail.endTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Education</h4>
                </div>
                <div className="space-y-3">
                  {doctor.education.map((edu, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white rounded-xl p-3 border border-yellow-200">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 font-medium">{edu}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 shadow-sm"
            >
              Close
            </button>
            <button
              onClick={() => {
                onBookAppointment(doctor._id);
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-6 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>📅</span>
                <span>Book Appointment</span>
              </div>
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{doctor.experience}</div>
              <div className="text-xs text-gray-600">Years Experience</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{doctor.rating}</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{doctor.reviewCount}</div>
              <div className="text-xs text-gray-600">Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileModal;