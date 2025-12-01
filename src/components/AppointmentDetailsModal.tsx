import React from 'react';
import { X, Calendar, Clock, User, MapPin, CreditCard, FileText } from 'lucide-react';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  appointment 
}) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Appointment Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {appointment.doctor.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Dr. {appointment.doctor.name}</h3>
                <p className="text-blue-600 font-medium">{appointment.doctor.specialty}</p>
                <div className="flex items-center mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-900">Date</span>
              </div>
              <p className="text-gray-700">
                {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold text-gray-900">Time</span>
              </div>
              <p className="text-gray-700">
                {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-semibold text-gray-900">Consultation Fee</span>
              </div>
              <p className="text-gray-700 font-semibold text-green-600">
                ₹{appointment.consultationFee}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <User className="h-5 w-5 text-orange-600 mr-2" />
                <span className="font-semibold text-gray-900">Appointment ID</span>
              </div>
              <p className="text-gray-700 font-mono text-sm">
                {appointment._id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Reason & Symptoms */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-red-600 mr-2" />
                <span className="font-semibold text-gray-900">Reason for Visit</span>
              </div>
              <p className="text-gray-700">{appointment.reason}</p>
            </div>

            {appointment.symptoms && appointment.symptoms.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🩺</span>
                  <span className="font-semibold text-gray-900">Symptoms</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {appointment.symptoms.map((symptom: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Doctor Location */}
          {appointment.doctor.location && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="font-semibold text-gray-900">Location</span>
              </div>
              <p className="text-gray-700">
                {appointment.doctor.location.address}
                {appointment.doctor.location.city && `, ${appointment.doctor.location.city}`}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;