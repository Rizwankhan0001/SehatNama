import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Doctor } from '../types';

interface AvailabilityCalendarProps {
  doctor: Doctor;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  doctor,
  selectedDate,
  onDateSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const isDoctorAvailable = (date: Date) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[date.getDay()];
    return doctor.availability.some(avail => avail.day === dayName);
  };
  
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = formatDate(date);
      const isAvailable = isDoctorAvailable(date);
      const isPast = isPastDate(date);
      const isSelected = selectedDate === dateString;
      
      let className = "h-12 w-12 rounded-xl flex items-center justify-center text-sm font-semibold cursor-pointer transition-all duration-200 transform hover:scale-105 ";
      
      if (isPast) {
        className += "text-gray-400 bg-gray-100 cursor-not-allowed opacity-50 ";
      } else if (isSelected) {
        className += "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110 ";
      } else if (isAvailable) {
        className += "bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 border-2 border-green-300 shadow-sm ";
      } else {
        className += "bg-gradient-to-r from-red-100 to-red-200 text-red-800 cursor-not-allowed border-2 border-red-300 opacity-60 ";
      }
      
      days.push(
        <div
          key={day}
          className={className}
          onClick={() => {
            if (!isPast && isAvailable) {
              onDateSelect(dateString);
            }
          }}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <h3 className="text-xl font-bold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <p className="text-blue-100 text-sm">Select your preferred date</p>
          </div>
          <button
            onClick={() => navigateMonth('next')}
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Calendar Body */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-10 flex items-center justify-center text-sm font-bold text-gray-600 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Not Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-sm"></div>
              <span className="text-gray-700 font-medium">Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;