import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { Doctor } from '../types';
import apiService from '../services/api';
import PaymentModal from './PaymentModal';
import AvailabilityCalendar from './AvailabilityCalendar';

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

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onAppointmentBooked?: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, doctor, onAppointmentBooked }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  const reasonOptions = [
    'Regular Checkup',
    'Follow-up Visit',
    'Chest Pain',
    'Headache',
    'Fever',
    'Cough & Cold',
    'Stomach Pain',
    'Back Pain',
    'Skin Problem',
    'Blood Pressure Check',
    'Diabetes Consultation',
    'Vaccination',
    'Health Certificate',
    'Other'
  ];

  const symptomOptions = [
    'Fever',
    'Headache',
    'Cough',
    'Sore Throat',
    'Runny Nose',
    'Body Ache',
    'Nausea',
    'Vomiting',
    'Diarrhea',
    'Constipation',
    'Chest Pain',
    'Shortness of Breath',
    'Dizziness',
    'Fatigue',
    'Loss of Appetite',
    'Sleep Problems',
    'Anxiety',
    'Depression',
    'Skin Rash',
    'Joint Pain'
  ];

  useEffect(() => {
    if (isOpen && doctor && selectedDate) {
      loadAvailableSlots();
    } else if (!selectedDate) {
      setAvailableSlots([]);
      setSelectedTime('');
    }
  }, [isOpen, doctor, selectedDate]);

  const loadAvailableSlots = async () => {
    if (!doctor || !selectedDate) return;
    
    setSlotsLoading(true);
    
    // Always provide default slots for any selected date
    const defaultSlots = [
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '10:30', endTime: '11:00' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '14:00', endTime: '14:30' },
      { startTime: '14:30', endTime: '15:00' },
      { startTime: '15:00', endTime: '15:30' },
      { startTime: '15:30', endTime: '16:00' },
      { startTime: '16:00', endTime: '16:30' }
    ];
    
    try {
      const response = await apiService.getAvailableSlots(doctor._id, selectedDate);
      const apiSlots = response.data || response.slots || [];
      
      // Use API slots if available, otherwise use default slots
      setAvailableSlots(apiSlots.length > 0 ? apiSlots : defaultSlots);
    } catch (error) {
      console.error('Error loading slots:', error);
      // Always set default slots if API fails
      setAvailableSlots(defaultSlots);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor || !selectedDate || !selectedTime || !reason) {
      alert('Please fill all required fields');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to book an appointment.');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        doctorId: doctor._id,
        appointmentDate: selectedDate,
        timeSlot: {
          startTime: selectedTime,
          endTime: getEndTime(selectedTime)
        },
        reason: reason === 'Other' ? customReason : reason,
        symptoms: [...symptoms, ...customSymptoms.split(',').map(s => s.trim()).filter(s => s)]
      };

      console.log('Booking appointment with data:', appointmentData);
      
      // Directly book appointment without payment
      const response = await apiService.bookAppointment(appointmentData);
      console.log('Booking response:', response);
      
      alert('Appointment booked successfully!');
      onAppointmentBooked?.();
      onClose();
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setReason('');
      setCustomReason('');
      setSymptoms([]);
      setCustomSymptoms('');
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const response = await apiService.bookAppointment(appointmentData);
      console.log('Booking response:', response);
      onAppointmentBooked?.(); // Refresh appointments
      setShowPayment(false);
      onClose();
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setReason('');
      setCustomReason('');
      setSymptoms([]);
      setCustomSymptoms('');
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to book appointment');
    }
  };

  const getEndTime = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + (minutes === 30 ? 1 : 0);
    const endMinutes = minutes === 30 ? 0 : 30;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header with gradient background */}
        <div className="relative gradient-primary text-white p-6 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-xl">📅</span>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-display">Book Appointment</h2>
                  <p className="text-indigo-200 text-sm">Schedule your consultation</p>
                </div>
              </div>
              
              {/* Doctor Info Card */}
              <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-20">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white font-display">Dr. {doctor.name}</h3>
                    <p className="text-indigo-200 font-medium">{doctor.specialty}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="bg-green-400 bg-opacity-20 px-3 py-1 rounded-full">
                        <span className="text-cyan-100 text-sm font-semibold">₹{doctor.consultationFee}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-300 mr-1">⭐</span>
                        <span className="text-white text-sm font-medium">{doctor.rating}</span>
                      </div>
                    </div>
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

        {/* Form Content */}
        <div className="p-4 max-h-[35vh] overflow-y-auto">
          <form onSubmit={handleBooking} className="space-y-8">
            {/* Date Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Select Date
                </label>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
                <AvailabilityCalendar
                  doctor={doctor}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <label className="text-lg font-semibold text-gray-900">
                    Select Time
                  </label>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200">
                  <div className="grid grid-cols-3 gap-3">
                    {slotsLoading ? (
                      <div className="col-span-3 text-center py-8">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-500 font-medium">Loading available slots...</p>
                      </div>
                    ) : availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <button
                          key={slot.startTime}
                          type="button"
                          onClick={() => setSelectedTime(slot.startTime)}
                          className={`p-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                            selectedTime === slot.startTime
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-lg'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">⏰</span>
                        </div>
                        <p className="text-gray-500 font-medium">No slots available for this date</p>
                        <p className="text-gray-400 text-sm">Please select another date</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reason for Visit */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📝</span>
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Reason for Visit <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="">Select reason for visit</option>
                  {reasonOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <span className="text-purple-400">🏥</span>
                </div>
              </div>
              {reason === 'Other' && (
                <div className="relative animate-fade-in">
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    required
                    placeholder="Please specify your reason"
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
              )}
            </div>

            {/* Symptoms */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💊</span>
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Symptoms <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                </label>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4">
                <p className="text-sm text-gray-600 mb-3">Select symptoms you're experiencing:</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {symptomOptions.map((symptom) => (
                    <label key={symptom} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={symptoms.includes(symptom)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSymptoms([...symptoms, symptom]);
                          } else {
                            setSymptoms(symptoms.filter(s => s !== symptom));
                          }
                        }}
                        className="w-4 h-4 text-orange-600 bg-white border-2 border-orange-300 rounded focus:ring-orange-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-orange-700 transition-colors">{symptom}</span>
                    </label>
                  ))}
                </div>
                <div className="relative">
                  <textarea
                    value={customSymptoms}
                    onChange={(e) => setCustomSymptoms(e.target.value)}
                    placeholder="Any other symptoms? (comma separated)"
                    rows={2}
                    className="w-full px-3 py-2 bg-white border-2 border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none text-sm"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer with Action Buttons */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleBooking}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Booking...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>📅</span>
                  <span>Book Appointment</span>
                </div>
              )}
            </button>
          </div>
          

        </div>
      </div>
      
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={doctor?.consultationFee || 0}
        doctorName={doctor?.name || ''}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default AppointmentModal;