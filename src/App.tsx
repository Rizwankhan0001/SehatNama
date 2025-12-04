import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import DoctorCard from './components/DoctorCard';
import DoctorSections from './components/DoctorSections';
import LocationMap from './components/LocationMap';
import AppointmentModal from './components/AppointmentModal';
import DoctorProfileModal from './components/DoctorProfileModal';
import AppointmentDetailsModal from './components/AppointmentDetailsModal';
import Chatbot from './components/Chatbot';
import { Doctor } from './types';
import apiService from './services/api';

function App() {
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [currentPage, setCurrentPage] = useState<'doctors' | 'appointments' | 'health-records' | 'about' | 'profile'>('doctors');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileDoctor, setSelectedProfileDoctor] = useState<Doctor | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Load doctors on component mount
  React.useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await apiService.getDoctors();
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      } catch (error) {
        console.error('Error loading doctors:', error);
      }
    };
    
    loadDoctors();
  }, []);

  // Load appointments when switching to appointments page
  React.useEffect(() => {
    if (currentPage === 'appointments') {
      loadAppointments();
    }
  }, [currentPage]);

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

  const handleSearch = async (query: string, location: string, specialty: string) => {
    setLoading(true);
    
    try {
      const params: any = {};
      if (query) params.search = query;
      if (location) params.city = location;
      if (specialty && specialty !== 'All Specialties') params.specialty = specialty;
      if (userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
      }
      
      const response = await apiService.getDoctors(params);
      setFilteredDoctors(response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error searching doctors:', error);
      alert('Error searching doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Re-sort doctors by distance
          const sorted = [...filteredDoctors].sort((a, b) => {
            const distanceA = calculateDistance(latitude, longitude, a.location.coordinates.coordinates[1], a.location.coordinates.coordinates[0]);
            const distanceB = calculateDistance(latitude, longitude, b.location.coordinates.coordinates[1], b.location.coordinates.coordinates[0]);
            return distanceA - distanceB;
          });
          
          setFilteredDoctors(sorted);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const loadAppointments = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setAppointmentsLoading(true);
    try {
      const response = await apiService.getUserAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const handleBookAppointment = (doctorId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in to book an appointment.');
      return;
    }
    
    const doctor = doctors.find(d => d._id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setShowAppointmentModal(true);
    }
  };

  const handleAppointmentBooked = () => {
    loadAppointments(); // Refresh appointments after booking
  };

  const handleViewProfile = (doctorId: string) => {
    const doctor = doctors.find(d => d._id === doctorId);
    if (doctor) {
      setSelectedProfileDoctor(doctor);
      setShowProfileModal(true);
    }
  };

  const handleViewAppointmentDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await apiService.cancelAppointment(appointmentId);
      alert('Appointment cancelled successfully!');
      loadAppointments(); // Refresh the appointments list
    } catch (error: any) {
      alert(error.message || 'Failed to cancel appointment');
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'doctors':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Compact Hero + Search Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-6">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-lg">👩⚕️</span>
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold">
                        Find Your Perfect <span className="text-yellow-300">Doctor</span>
                      </h1>
                      <p className="text-blue-100 text-xs md:text-sm">
                        Connect with qualified healthcare professionals across India
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-4 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-300">{filteredDoctors.length}</div>
                      <div className="text-blue-200">Doctors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-300">{filteredDoctors.filter(d => d.rating >= 4.5).length}</div>
                      <div className="text-blue-200">Top Rated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-300">{new Set(filteredDoctors.map(d => d.specialty)).size}</div>
                      <div className="text-blue-200">Specialties</div>
                    </div>
                  </div>
                </div>
                <SearchBar onSearch={handleSearch} onLocationRequest={handleLocationRequest} />
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4 space-y-4">
                    {/* Featured Doctors */}
                    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                        <span className="text-lg mr-2">🏆</span>
                        Featured Doctors
                      </h3>
                      <DoctorSections
                        doctors={doctors}
                        onBookAppointment={handleBookAppointment}
                        onViewProfile={handleViewProfile}
                      />
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                        <span className="text-lg mr-2">📊</span>
                        Quick Stats
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Doctors</span>
                          <span className="font-bold text-blue-600">{filteredDoctors.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Avg Rating</span>
                          <span className="font-bold text-yellow-600">
                            {filteredDoctors.length > 0 
                              ? (filteredDoctors.reduce((sum, d) => sum + d.rating, 0) / filteredDoctors.length).toFixed(1)
                              : '0.0'
                            } ⭐
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Avg Fee</span>
                          <span className="font-bold text-green-600">
                            ₹{filteredDoctors.length > 0 
                              ? Math.round(filteredDoctors.reduce((sum, d) => sum + d.consultationFee, 0) / filteredDoctors.length)
                              : '0'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Location Map */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3">
                        <h3 className="text-sm font-bold flex items-center">
                          <span className="text-base mr-2">🗺️</span>
                          Doctor Locations
                        </h3>
                      </div>
                      <LocationMap doctors={filteredDoctors} userLocation={userLocation} />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  {/* Results Header */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="mb-3 sm:mb-0">
                        <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          🔍 {filteredDoctors.length} Doctors Found
                        </h2>
                        <p className="text-gray-600 text-sm">Choose the best healthcare professional for you</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600 font-medium">Sort by:</span>
                        <select 
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            const sorted = [...filteredDoctors].sort((a, b) => {
                              switch(e.target.value) {
                                case 'rating': return b.rating - a.rating;
                                case 'price': return a.consultationFee - b.consultationFee;
                                case 'experience': return b.experience - a.experience;
                                case 'distance':
                                  if (userLocation) {
                                    const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location.coordinates.coordinates[1], a.location.coordinates.coordinates[0]);
                                    const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location.coordinates.coordinates[1], b.location.coordinates.coordinates[0]);
                                    return distA - distB;
                                  }
                                  return 0;
                                default: return 0;
                              }
                            });
                            setFilteredDoctors(sorted);
                          }}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-3 py-1 text-xs font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="rating">⭐ Rating</option>
                          <option value="distance">📍 Distance</option>
                          <option value="price">💰 Price</option>
                          <option value="experience">🎆 Experience</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Loading State */}
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse border border-gray-100">
                          <div className="flex space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
                            <div className="flex-1 space-y-3">
                              <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded w-1/3"></div>
                              <div className="h-3 bg-gradient-to-r from-green-200 to-blue-200 rounded w-1/4"></div>
                              <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-1/2"></div>
                              <div className="flex space-x-2">
                                <div className="h-8 bg-gradient-to-r from-blue-200 to-purple-200 rounded w-24"></div>
                                <div className="h-8 bg-gradient-to-r from-green-200 to-blue-200 rounded w-20"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredDoctors.length > 0 ? (
                    /* Doctor Cards */
                    <div className="space-y-4">
                      {filteredDoctors.map((doctor, index) => (
                        <div 
                          key={doctor._id}
                          className="transform hover:scale-[1.01] transition-all duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <DoctorCard
                            doctor={doctor}
                            onBookAppointment={handleBookAppointment}
                            onViewProfile={handleViewProfile}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* No Results */
                    <div className="text-center py-12">
                      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">🔍</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">No Doctors Found</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                          Try adjusting your search criteria or location to find more doctors.
                        </p>
                        <button 
                          onClick={() => window.location.reload()}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                          🔄 Reset Search
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'appointments':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
              <div className="max-w-6xl mx-auto px-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  My <span className="text-yellow-300">Appointments</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Manage your healthcare appointments and track your medical journey
                </p>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
              {appointmentsLoading ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Loading your appointments...</p>
                </div>
              ) : appointments.length > 0 ? (
                <>
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-2xl">📊</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                          <p className="text-gray-600">Total Appointments</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-2xl">✅</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {appointments.filter(a => a.status === 'confirmed' || a.status === 'scheduled').length}
                          </p>
                          <p className="text-gray-600">Active Appointments</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                          <span className="text-2xl">💰</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{appointments.reduce((sum, a) => sum + (a.consultationFee || 0), 0)}
                          </p>
                          <p className="text-gray-600">Total Spent</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointments List */}
                  <div className="space-y-6">
                    {appointments.map((appointment, index) => (
                      <div 
                        key={appointment._id} 
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start space-x-6 flex-1">
                            {/* Doctor Avatar */}
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                              {appointment.doctor.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            
                            {/* Appointment Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                  Dr. {appointment.doctor.name}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                              </div>
                              
                              <p className="text-blue-600 font-medium mb-3">{appointment.doctor.specialty}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <span className="text-lg mr-2">📅</span>
                                  <span className="font-medium">Date:</span>
                                  <span className="ml-1">{new Date(appointment.appointmentDate).toLocaleDateString('en-IN', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}</span>
                                </div>
                                
                                <div className="flex items-center text-gray-600">
                                  <span className="text-lg mr-2">⏰</span>
                                  <span className="font-medium">Time:</span>
                                  <span className="ml-1">{appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}</span>
                                </div>
                                
                                <div className="flex items-center text-gray-600">
                                  <span className="text-lg mr-2">🏥</span>
                                  <span className="font-medium">Reason:</span>
                                  <span className="ml-1">{appointment.reason}</span>
                                </div>
                                
                                <div className="flex items-center text-gray-600">
                                  <span className="text-lg mr-2">💳</span>
                                  <span className="font-medium">Fee:</span>
                                  <span className="ml-1 text-green-600 font-semibold">₹{appointment.consultationFee}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                            <button 
                              onClick={() => handleViewAppointmentDetails(appointment)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                              View Details
                            </button>
                            {appointment.status === 'scheduled' && (
                              <button 
                                onClick={() => handleCancelAppointment(appointment._id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Appointments Yet</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      You haven't scheduled any appointments yet. Start your healthcare journey by finding the right doctor for you.
                    </p>
                    <button 
                      onClick={() => setCurrentPage('doctors')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      🔍 Find Doctors
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'health-records':
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Health Records</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Your health records will appear here.</p>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                  About <span className="text-yellow-300">Prescure</span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Revolutionizing healthcare in India through innovative technology and compassionate care
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
              {/* Mission Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform hover:scale-105 transition-all duration-300 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Our Mission</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed text-center max-w-4xl mx-auto">
                  Prescure is revolutionizing healthcare in India by connecting patients with qualified doctors through our comprehensive digital platform. We believe healthcare should be accessible, affordable, and convenient for everyone, regardless of their location or economic background.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Smart Doctor Search</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Find the right doctor using our advanced search filters. Search by specialty, location, ratings, experience, and consultation fees to find the perfect match for your healthcare needs.
                  </p>
                </div>
                
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-green-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                      <span className="text-2xl">📍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Location-Based Services</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Use GPS technology to find doctors near you. Our platform calculates distances and helps you find the most convenient healthcare providers in your area.
                  </p>
                </div>
                
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-yellow-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-yellow-200 transition-colors">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Verified Reviews</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Make informed decisions with authentic patient reviews and ratings. Our transparent review system helps you choose doctors based on real patient experiences.
                  </p>
                </div>
                
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-purple-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                      <span className="text-2xl">💳</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Secure Payments</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Book appointments with secure online payments. We support multiple payment methods including UPI, cards, and net banking for your convenience.
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl p-12 mb-16 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                <div className="relative">
                  <h3 className="text-3xl font-bold mb-8 text-center">Prescure by Numbers</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-4xl font-bold mb-2 text-yellow-300">500+</div>
                      <div className="text-blue-100 font-medium">Verified Doctors</div>
                    </div>
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-4xl font-bold mb-2 text-yellow-300">100+</div>
                      <div className="text-blue-100 font-medium">Cities Covered</div>
                    </div>
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-4xl font-bold mb-2 text-yellow-300">50+</div>
                      <div className="text-blue-100 font-medium">Specialties</div>
                    </div>
                    <div className="transform hover:scale-110 transition-transform duration-300">
                      <div className="text-4xl font-bold mb-2 text-yellow-300">24/7</div>
                      <div className="text-blue-100 font-medium">Support</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-white rounded-3xl shadow-xl p-12 mb-16">
                <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">How Prescure Works</h3>
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="text-center group">
                    <div className="relative mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                        <span className="text-3xl font-bold text-white">1</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-gray-900">Search & Discover</h4>
                    <p className="text-gray-600 leading-relaxed">Search for doctors by specialty, location, or name. Browse profiles, read reviews, and compare options.</p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="relative mb-6">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                        <span className="text-3xl font-bold text-white">2</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-gray-900">Book & Pay</h4>
                    <p className="text-gray-600 leading-relaxed">Select available time slots, book your appointment, and make secure online payments.</p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="relative mb-6">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                        <span className="text-3xl font-bold text-white">3</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-gray-900">Visit & Care</h4>
                    <p className="text-gray-600 leading-relaxed">Attend your appointment, receive quality healthcare, and manage your health records.</p>
                  </div>
                </div>
              </div>

              {/* Contact & Support */}
              <div className="bg-white rounded-3xl shadow-xl p-12">
                <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Contact & Support</h3>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h4>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                        <span className="text-2xl mr-4">📧</span>
                        <div>
                          <p className="font-semibold text-gray-900">Email</p>
                          <p className="text-blue-600">support@prescure.com</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                        <span className="text-2xl mr-4">📞</span>
                        <div>
                          <p className="font-semibold text-gray-900">Phone</p>
                          <p className="text-green-600">+91 1800-123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                        <span className="text-2xl mr-4">🕒</span>
                        <div>
                          <p className="font-semibold text-gray-900">Support Hours</p>
                          <p className="text-purple-600">24/7 Available</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors">
                        <span className="text-2xl mr-4">📍</span>
                        <div>
                          <p className="font-semibold text-gray-900">Address</p>
                          <p className="text-yellow-600">Mumbai, Maharashtra, India</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Prescure?</h4>
                    <div className="space-y-4">
                      {[
                        'Verified and qualified doctors',
                        'Transparent pricing and reviews', 
                        'Secure and easy booking process',
                        '24/7 customer support',
                        'Digital health records management'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all duration-300 transform hover:scale-105">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold">✓</span>
                          </div>
                          <p className="text-gray-700 font-medium">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderContent()}
      <Footer />
      <Chatbot />
      
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        doctor={selectedDoctor}
        onAppointmentBooked={handleAppointmentBooked}
      />
      
      <DoctorProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        doctor={selectedProfileDoctor}
        onBookAppointment={handleBookAppointment}
      />
      
      <AppointmentDetailsModal
        isOpen={showAppointmentDetails}
        onClose={() => setShowAppointmentDetails(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}

export default App;