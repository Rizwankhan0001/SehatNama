import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

import LocationMap from './components/LocationMap';
import AppointmentModal from './components/AppointmentModal';
import DoctorProfileModal from './components/DoctorProfileModal';
import AppointmentDetailsModal from './components/AppointmentDetailsModal';
import { Doctor, User } from './types';
import apiService from './services/api';

function AppContent() {
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userCity, setUserCity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [currentPage, setCurrentPage] = useState<'doctors' | 'appointments' | 'health-records' | 'about' | 'profile'>('doctors');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileDoctor, setSelectedProfileDoctor] = useState<Doctor | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

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
    if (currentPage === 'profile') {
      loadUserProfile();
    }
  }, [currentPage]);
  
  // Force re-render form when userProfile changes
  React.useEffect(() => {
    if (userProfile && formRef.current) {
      // Reset form with new data
      const form = formRef.current;
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach((input: any) => {
        if (input.name && (userProfile as any)[input.name] !== undefined) {
          if (input.type === 'date' && (userProfile as any)[input.name]) {
            input.value = new Date((userProfile as any)[input.name]).toISOString().split('T')[0];
          } else if (Array.isArray((userProfile as any)[input.name])) {
            input.value = (userProfile as any)[input.name].join(', ');
          } else if (input.name.startsWith('emergencyContact') && userProfile.emergencyContact) {
            const field = input.name.replace('emergencyContact', '').toLowerCase();
            input.value = (userProfile.emergencyContact as any)[field] || '';
          } else if (input.name === 'address' && userProfile.address?.full) {
            input.value = userProfile.address.full;
          } else {
            input.value = (userProfile as any)[input.name] || '';
          }
        }
      });
    }
  }, [userProfile]);

  const loadUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setProfileLoading(true);
    try {
      const response = await apiService.getUserProfile();
      setUserProfile(response.data);
      if (response.data?.location) {
        setUserCity(response.data.location);
      }
      // Update localStorage with fresh data
      if (response.data?.name) localStorage.setItem('userName', response.data.name);
      if (response.data?.email) localStorage.setItem('userEmail', response.data.email);
      if (response.data?.phone) localStorage.setItem('userPhone', response.data.phone);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

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

  const handleSortChange = (sortType: string) => {
    setSortBy(sortType);
    let sorted = [...filteredDoctors];
    
    switch (sortType) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        if (userLocation) {
          sorted.sort((a, b) => {
            const distanceA = calculateDistance(
              userLocation.lat, 
              userLocation.lng, 
              a.location.coordinates.coordinates[1], 
              a.location.coordinates.coordinates[0]
            );
            const distanceB = calculateDistance(
              userLocation.lat, 
              userLocation.lng, 
              b.location.coordinates.coordinates[1], 
              b.location.coordinates.coordinates[0]
            );
            return distanceA - distanceB;
          });
        } else {
          alert('Please allow location access to sort by distance.');
          handleLocationRequest();
          return;
        }
        break;
      case 'price':
        sorted.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case 'experience':
        sorted.sort((a, b) => b.experience - a.experience);
        break;
    }
    
    setFilteredDoctors(sorted);
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // If currently sorting by distance, re-sort with new location
          if (sortBy === 'distance') {
            handleSortChange('distance');
          }
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

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent form submission
    
    if (!formRef.current) {
      alert('Form not found');
      return;
    }
    
    const formData = new FormData(formRef.current);
    const profileData: any = Object.fromEntries(formData.entries());
    
    // Process arrays and nested objects
    if (profileData.allergies) {
      profileData.allergies = profileData.allergies.split(',').map((item: string) => item.trim()).filter((item: string) => item);
    }
    if (profileData.education) {
      profileData.education = profileData.education.split(',').map((item: string) => item.trim()).filter((item: string) => item);
    }
    if (profileData.languages) {
      profileData.languages = profileData.languages.split(',').map((item: string) => item.trim()).filter((item: string) => item);
    }
    
    // Handle emergency contact
    if (profileData.emergencyContactName || profileData.emergencyContactPhone || profileData.emergencyContactRelationship) {
      profileData.emergencyContact = {
        name: profileData.emergencyContactName || '',
        phone: profileData.emergencyContactPhone || '',
        relationship: profileData.emergencyContactRelationship || ''
      };
      delete profileData.emergencyContactName;
      delete profileData.emergencyContactPhone;
      delete profileData.emergencyContactRelationship;
    }
    
    // Handle address
    if (profileData.address) {
      profileData.address = {
        full: profileData.address
      };
    }
    
    try {
      await apiService.updateUserProfile(profileData);
      alert('Profile updated successfully!');
      if (profileData.location) {
        setUserCity(profileData.location as string);
      }
      loadUserProfile(); // Refresh profile data
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
    }
  };

  const handleCancelProfile = () => {
    setCurrentPage('doctors'); // Navigate away from profile
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = value;
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'doctors':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <HeroSection 
              filteredDoctors={filteredDoctors}
              onSearch={handleSearch}
              onLocationRequest={handleLocationRequest}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Results Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="mb-4 sm:mb-0">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                          🔍 {filteredDoctors.length} Doctors Found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">Choose the best healthcare professional for you</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Sort by:</span>
                        <select 
                          value={sortBy}
                          onChange={(e) => handleSortChange(e.target.value)}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border border-blue-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-pulse border border-gray-100 dark:border-gray-700">
                          <div className="flex space-x-6">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
                            <div className="flex-1 space-y-4">
                              <div className="h-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg w-1/3"></div>
                              <div className="h-4 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg w-1/4"></div>
                              <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg w-1/2"></div>
                              <div className="flex space-x-2">
                                <div className="h-10 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg w-32"></div>
                                <div className="h-10 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg w-28"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredDoctors.length > 0 ? (
                    /* Doctor Cards */
                    <div className="space-y-6">
                      {filteredDoctors.map((doctor, index) => (
                        <div 
                          key={doctor._id}
                          className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-8 transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start space-x-6 flex-1">
                              {/* Doctor Avatar */}
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              
                              {/* Doctor Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Dr. {doctor.name}
                                  </h3>
                                  <div className="flex items-center">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{doctor.rating}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 mb-3">
                                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{doctor.specialty}</span>
                                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{doctor.experience}y exp</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-blue-600 text-lg">🏥</span>
                                      <div>
                                        <p className="text-xs text-blue-600 font-medium">Experience</p>
                                        <p className="text-sm font-bold text-blue-800">{doctor.experience} years</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-purple-600 text-lg">📍</span>
                                      <div>
                                        <p className="text-xs text-purple-600 font-medium">Location</p>
                                        <p className="text-sm font-bold text-purple-800">{doctor.location.city}</p>
                                        {userLocation && doctor.location.coordinates?.coordinates && (
                                          <p className="text-xs text-purple-600 font-medium">
                                            {calculateDistance(
                                              userLocation.lat,
                                              userLocation.lng,
                                              doctor.location.coordinates.coordinates[1],
                                              doctor.location.coordinates.coordinates[0]
                                            ).toFixed(1)} km away
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200 col-span-2">
                                    <div className="flex items-start space-x-2">
                                      <span className="text-green-600 text-lg mt-0.5">🎓</span>
                                      <div className="flex-1">
                                        <p className="text-xs text-green-600 font-medium">Education</p>
                                        <p className="text-sm font-bold text-green-800 leading-tight">{doctor.education}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-lg p-3 border border-orange-200 col-span-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-orange-600 text-lg">💳</span>
                                        <div>
                                          <p className="text-xs text-orange-600 font-medium">Consultation Fee</p>
                                          <p className="text-lg font-bold text-orange-800">₹{doctor.consultationFee}</p>
                                        </div>
                                      </div>
                                      <div className="bg-orange-200 px-3 py-1 rounded-full">
                                        <span className="text-xs font-semibold text-orange-800">Per Visit</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                              <button 
                                onClick={() => handleViewProfile(doctor._id)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                              >
                                View Profile
                              </button>
                              <button 
                                onClick={() => handleBookAppointment(doctor._id)}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                              >
                                Book Appointment
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* No Results */
                    <div className="text-center py-16">
                      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="text-4xl">🔍</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Doctors Found</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                          Try adjusting your search criteria or location to find more doctors.
                        </p>
                        <button 
                          onClick={() => window.location.reload()}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                          🔄 Reset Search
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="text-2xl mr-2">📊</span>
                        Quick Stats
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Total Doctors</span>
                          <span className="font-bold text-blue-600">{filteredDoctors.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Avg Rating</span>
                          <span className="font-bold text-yellow-600">
                            {filteredDoctors.length > 0 
                              ? (filteredDoctors.reduce((sum, d) => sum + d.rating, 0) / filteredDoctors.length).toFixed(1)
                              : '0.0'
                            } ⭐
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Avg Fee</span>
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
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                        <h3 className="font-bold flex items-center">
                          <span className="text-xl mr-2">🗺️</span>
                          Doctor Locations
                        </h3>
                      </div>
                      <LocationMap doctors={filteredDoctors} userLocation={userLocation} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'appointments':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
              <div className="max-w-6xl mx-auto px-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                  <span className="text-2xl">👤</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  My <span className="text-yellow-300">Profile</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Manage your personal information and preferences
                </p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
              {profileLoading ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Loading your profile...</p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {(userProfile?.name || localStorage.getItem('userName') || 'U').split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{userProfile?.name || localStorage.getItem('userName') || 'User'}</h2>
                    <p className="text-gray-600">{userProfile?.email || localStorage.getItem('userEmail') || 'user@example.com'}</p>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {userProfile?.userType === 'doctor' || localStorage.getItem('userType') === 'doctor' ? 'Doctor' : 'Patient'}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        defaultValue={userProfile?.name || localStorage.getItem('userName') || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        defaultValue={userProfile?.email || localStorage.getItem('userEmail') || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        defaultValue={userProfile?.phone || localStorage.getItem('userPhone') || ''}
                        onInput={handlePhoneInput}
                        maxLength={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input 
                        type="date" 
                        name="dateOfBirth"
                        defaultValue={userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth).toISOString().split('T')[0] : ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select 
                        name="gender"
                        defaultValue={userProfile?.gender || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {userProfile?.userType === 'doctor' || localStorage.getItem('userType') === 'doctor' ? (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                          <select 
                            name="specialization"
                            defaultValue={userProfile?.specialization || ''}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Specialty</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Dermatology">Dermatology</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="General Medicine">General Medicine</option>
                            <option value="Gynecology">Gynecology</option>
                            <option value="Psychiatry">Psychiatry</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                          <input 
                            type="number" 
                            name="experience"
                            defaultValue={userProfile?.experience || ''}
                            min="0"
                            max="50"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                          <input 
                            type="text" 
                            name="education"
                            defaultValue={userProfile?.education?.join(', ') || ''}
                            placeholder="MBBS, MD, etc."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹)</label>
                          <input 
                            type="number" 
                            name="consultationFee"
                            defaultValue={userProfile?.consultationFee || ''}
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                          <input 
                            type="text" 
                            name="languages"
                            defaultValue={userProfile?.languages?.join(', ') || ''}
                            placeholder="English, Hindi, etc."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Health Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                          <input 
                            type="text" 
                            name="emergencyContactName"
                            defaultValue={userProfile?.emergencyContact?.name || ''}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                          <input 
                            type="tel" 
                            name="emergencyContactPhone"
                            defaultValue={userProfile?.emergencyContact?.phone || ''}
                            onInput={handlePhoneInput}
                            maxLength={10}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                          <input 
                            type="text" 
                            name="emergencyContactRelationship"
                            defaultValue={userProfile?.emergencyContact?.relationship || ''}
                            placeholder="Father, Mother, Spouse, etc."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                          <textarea 
                            name="allergies"
                            rows={3}
                            defaultValue={userProfile?.allergies?.join(', ') || ''}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="List any known allergies..."
                          ></textarea>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Disease/Condition</label>
                          <input 
                            type="text" 
                            name="disease"
                            defaultValue={userProfile?.disease || ''}
                            placeholder="Current medical condition (if any)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location/City</label>
                      <input 
                        type="text" 
                        name="location"
                        defaultValue={userProfile?.location || ''}
                        placeholder="Enter your city (e.g., Mumbai, Delhi)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                      <textarea 
                        name="address"
                        rows={3}
                        defaultValue={userProfile?.address?.full || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your complete address..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button 
                    type="button"
                    onClick={handleCancelProfile}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
                </form>
              )}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                  About <span className="text-yellow-300">SehatNama</span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Revolutionizing healthcare in India through innovative technology and compassionate care
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
              {/* Mission Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12 transform hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Our Mission</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-center max-w-4xl mx-auto">
                  SehatNama is revolutionizing healthcare in India by connecting patients with qualified doctors through our comprehensive digital platform. We believe healthcare should be accessible, affordable, and convenient for everyone, regardless of their location or economic background.
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
                  <h3 className="text-3xl font-bold mb-8 text-center">SehatNama by Numbers</h3>
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
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 mb-16">
                <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">How SehatNama Works</h3>
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
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12">
                <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Contact & Support</h3>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h4>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                        <span className="text-2xl mr-4">📧</span>
                        <div>
                          <p className="font-semibold text-gray-900">Email</p>
                          <p className="text-blue-600">support@sehetnama.com</p>
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
                    <h4 className="text-2xl font-bold text-gray-900 mb-6">Why Choose SehatNama?</h4>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderContent()}
      <Footer />
          
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

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;