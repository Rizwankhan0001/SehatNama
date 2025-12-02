import React, { useState } from 'react';
import { Doctor } from '../types';
import { Star, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface DoctorSectionsProps {
  doctors: Doctor[];
  onBookAppointment: (doctorId: string) => void;
  onViewProfile: (doctorId: string) => void;
}

const DoctorSections: React.FC<DoctorSectionsProps> = ({ 
  doctors, 
  onBookAppointment, 
  onViewProfile
}) => {
  const affordableDoctors = [...doctors].sort((a, b) => a.consultationFee - b.consultationFee).slice(0, 4);
  const topRatedDoctors = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const experiencedDoctors = [...doctors].sort((a, b) => b.experience - a.experience).slice(0, 4);

  const MiniCard = ({ doctor }: { doctor: Doctor }) => (
    <div className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {doctor.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate">Dr. {doctor.name}</h4>
          <p className="text-xs text-blue-600 mb-1">{doctor.specialty}</p>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {doctor.rating}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              {doctor.experience}y
            </span>
            <span>•</span>
            <span className="text-green-600 font-semibold">₹{doctor.consultationFee}</span>
          </div>
          <button
            onClick={() => onBookAppointment(doctor._id)}
            className="w-full bg-blue-600 text-white py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, icon, doctors, color }: { title: string; icon: string; doctors: Doctor[]; color: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border-l-4 ${color}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
            <span className="text-xs text-gray-500">({doctors.length})</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isOpen && (
          <div className="mt-2 space-y-2 pl-2">
            {doctors.map(doctor => (
              <MiniCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Section title="Most Affordable" icon="💰" doctors={affordableDoctors} color="border-green-500" />
      <Section title="Top Rated" icon="⭐" doctors={topRatedDoctors} color="border-yellow-500" />
      <Section title="Most Experienced" icon="🎓" doctors={experiencedDoctors} color="border-blue-500" />
    </div>
  );
};

export default DoctorSections;
