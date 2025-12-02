import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Calendar } from 'lucide-react';
import apiService from '../services/api';
import { Doctor } from '../types';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: string[];
  doctors?: Doctor[];
  showBooking?: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hi! I'm SehatNama Assistant. 👋\n\nHow can I help you today?", 
      isBot: true, 
      timestamp: new Date(),
      options: [
        "🔍 Find Doctors",
        "📅 Book Appointment",
        "📋 My Appointments",
        "🚑 Emergency Services",
        "💊 Prescription Refill",
        "🧪 Lab Tests",
        "💬 Consult Online",
        "🏥 Nearby Hospitals",
        "💡 Health Tips",
        "📞 Contact Support"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [bookingStep, setBookingStep] = useState<'specialty' | 'doctors' | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): { text: string; options?: string[]; showBooking?: boolean } => {
    const msg = userMessage.toLowerCase();
    
    // Greetings
    if (msg.match(/\b(hello|hi|hey|good morning|good evening|good afternoon)\b/)) {
      return {
        text: "Hello! Welcome to SehatNama. I can help you find doctors, book appointments, or answer questions about our services.",
        options: [
          "🔍 Find Doctors",
          "📅 Book Appointment",
          "🚑 Emergency Services",
          "💊 Prescription Refill",
          "📞 Contact Support"
        ]
      };
    }
    
    // Booking appointments
    if (msg.match(/\b(book|schedule|make|📅)\b.*\b(appointment|consultation)\b/) || msg.includes('📅')) {
      return {
        text: "Great! Let's book an appointment for you.\n\nPlease select a specialty:",
        options: [
          "❤️ Cardiology",
          "🧠 Neurology",
          "🦴 Orthopedics",
          "👶 Pediatrics",
          "🩺 General Medicine",
          "👩 Gynecology",
          "👁️ Ophthalmology",
          "🦷 Dentistry",
          "🏠 Main Menu"
        ],
        showBooking: true
      };
    }

    // My Appointments
    if (msg.includes('my appointment') || msg.includes('📋')) {
      return {
        text: "📋 MY APPOINTMENTS:\n\nTo view your appointments:\n• Go to 'My Appointments' section\n• View upcoming appointments\n• Check past appointments\n• Cancel or reschedule\n\nYou can manage all your bookings there!",
        options: ["📅 Book New Appointment", "🏠 Main Menu"]
      };
    }

    // Emergency Services
    if (msg.includes('emergency') || msg.includes('urgent') || msg.includes('🚑')) {
      return {
        text: "🚨 EMERGENCY SERVICES:\n\n🚑 Ambulance: 102 / 108\n🏥 Emergency Helpline: 112\n☎️ Our 24/7 Support: +91 1800-123-4567\n\n⚠️ For life-threatening emergencies, call 102 immediately!",
        options: ["🏥 Nearby Hospitals", "🔍 Find Doctors", "🏠 Main Menu"]
      };
    }

    // Prescription Refill
    if (msg.includes('prescription') || msg.includes('refill') || msg.includes('💊')) {
      return {
        text: "💊 PRESCRIPTION REFILL:\n\nTo refill your prescription:\n1. Upload your prescription\n2. Select pharmacy\n3. Choose delivery or pickup\n\nDelivery available in 2-4 hours!",
        options: ["📤 Upload Prescription", "🔍 Find Pharmacy", "🏠 Main Menu"]
      };
    }

    // Lab Tests
    if (msg.includes('lab') || msg.includes('test') || msg.includes('🧪')) {
      return {
        text: "🧪 LAB TESTS & DIAGNOSTICS:\n\nAvailable services:\n• Blood Tests\n• X-Ray & Scans\n• Health Checkup Packages\n• Home Sample Collection\n\nGet reports within 24 hours!",
        options: ["📋 Book Lab Test", "🏠 Home Collection", "🏠 Main Menu"]
      };
    }

    // Online Consultation
    if (msg.includes('online') || msg.includes('consult') || msg.includes('💬')) {
      return {
        text: "💬 ONLINE CONSULTATION:\n\nConnect with doctors via:\n• Video Call\n• Voice Call\n• Chat\n\nAvailable 24/7 for instant consultation!",
        options: ["📹 Start Video Call", "📅 Book Appointment", "🏠 Main Menu"]
      };
    }

    // Nearby Hospitals
    if (msg.includes('hospital') || msg.includes('nearby') || msg.includes('🏥')) {
      return {
        text: "🏥 NEARBY HOSPITALS:\n\nFinding hospitals near you...\n\nYou can filter by:\n• Distance\n• Specialty\n• Emergency services\n• Insurance accepted",
        options: ["🗺️ View on Map", "🔍 Find Doctors", "🏠 Main Menu"]
      };
    }

    // Health Tips
    if (msg.includes('health') || msg.includes('tip') || msg.includes('💡')) {
      return {
        text: "💡 DAILY HEALTH TIPS:\n\n💧 Drink 8-10 glasses of water\n🏃 Exercise 30 mins daily\n🥗 Eat balanced, nutritious meals\n😴 Get 7-8 hours of sleep\n🧘 Practice meditation\n🚭 Avoid smoking & alcohol\n📱 Limit screen time",
        options: ["📅 Book Health Checkup", "🧪 Lab Tests", "🏠 Main Menu"]
      };
    }
    
    // Finding doctors
    if (msg.match(/\b(find|search|looking for|need|🔍)\b.*\b(doctor|specialist|physician)\b/) || msg.includes('🔍')) {
      return {
        text: "You can find doctors by:\n• Using the search bar at the top\n• Filtering by specialty (Cardiology, Dermatology, etc.)\n• Searching by location or city\n• Sorting by rating, distance, or price\n\nWe have 500+ verified doctors across India!",
        options: [
          "🏥 View Specialties",
          "📍 Find Near Me",
          "💰 Check Pricing",
          "📅 Book Appointment",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Canceling appointments
    if (msg.match(/\b(cancel|delete|remove|❌)\b.*\b(appointment|booking)\b/) || msg.includes('❌')) {
      return {
        text: "To cancel an appointment:\n1. Go to 'My Appointments' section\n2. Find your scheduled appointment\n3. Click the 'Cancel' button\n\nPlease cancel at least 24 hours in advance when possible.",
        options: [
          "📅 Book New Appointment",
          "📞 Contact Support",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Pricing
    if (msg.match(/\b(price|fee|cost|charge|how much|💰)\b/) || msg.includes('💰')) {
      return {
        text: "Consultation fees vary by doctor and specialty:\n• General Physician: ₹300-₹500\n• Specialists: ₹500-₹1000\n• Super Specialists: ₹1000-₹1500\n\nYou can see each doctor's exact fee on their profile card.",
        options: [
          "🔍 Find Doctors",
          "💳 Payment Methods",
          "📅 Book Appointment",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Location services
    if (msg.match(/\b(location|near me|nearby|closest|distance|📍)\b/) || msg.includes('📍')) {
      return {
        text: "To find doctors near you:\n1. Click 'Use my location' in the search bar\n2. Allow location access\n3. We'll show doctors sorted by distance\n\nYou can also manually enter your city or area.",
        options: [
          "🔍 Find Doctors",
          "🏥 View Specialties",
          "📅 Book Appointment",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Specialties
    if (msg.match(/\b(specialty|specialties|type of doctor|which doctor|🏥)\b/) || msg.includes('🏥')) {
      return {
        text: "We have doctors in 50+ specialties including:\n• Cardiology (Heart)\n• Dermatology (Skin)\n• Neurology (Brain & Nerves)\n• Orthopedics (Bones & Joints)\n• Pediatrics (Children)\n• Gynecology (Women's Health)\n• Psychiatry (Mental Health)\n• General Medicine\n\nAnd many more!",
        options: [
          "🔍 Find Doctors",
          "📍 Find Near Me",
          "💰 Check Pricing",
          "📅 Book Appointment",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Emergency
    if (msg.match(/\b(emergency|urgent|critical|serious|ambulance)\b/)) {
      return {
        text: "⚠️ For medical emergencies:\n• Call 108 (India Emergency Services)\n• Visit the nearest hospital immediately\n\nOur platform is for scheduled consultations, not emergency care. Please seek immediate help for urgent medical situations.",
        options: [
          "📞 Contact Support",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Payment
    if (msg.match(/\b(payment|pay|transaction|upi|card|💳)\b/) || msg.includes('💳')) {
      return {
        text: "We accept multiple payment methods:\n• UPI (Google Pay, PhonePe, Paytm)\n• Credit/Debit Cards\n• Net Banking\n• Wallets\n\nAll payments are secure and encrypted. You'll receive instant confirmation.",
        options: [
          "💰 Check Pricing",
          "📅 Book Appointment",
          "📞 Contact Support",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Availability/Hours
    if (msg.match(/\b(hours|time|when|available|open)\b/)) {
      return {
        text: "Our platform is available 24/7 for browsing and booking.\n\nDoctor availability varies:\n• Check each doctor's profile for their consultation hours\n• Most doctors are available 9 AM - 9 PM\n• Some offer evening and weekend slots\n\nBook anytime, consult as per doctor's schedule!",
        options: [
          "🔍 Find Doctors",
          "📅 Book Appointment",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Contact/Support
    if (msg.match(/\b(contact|support|help|call|email|reach|📞)\b/) || msg.includes('📞')) {
      return {
        text: "📞 CONTACT SUPPORT:\n\n☎️ Helpline: +91 1800-123-4567\n📧 Email: support@sehetnama.com\n💬 Live Chat: Available 24/7\n⏰ Response time: Under 5 mins\n\nHow can we assist you?",
        options: [
          "💬 Start Live Chat",
          "📧 Send Email",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Registration/Sign up
    if (msg.match(/\b(register|sign up|create account|join)\b/)) {
      return {
        text: "To create an account:\n1. Click 'Sign In' at the top\n2. Select 'Register'\n3. Enter your details (name, email, phone)\n4. Verify your phone number\n5. Complete your profile\n\nIt only takes 2 minutes!",
        options: [
          "📅 Book Appointment",
          "🔍 Find Doctors",
          "📞 Need Help?",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Reviews/Ratings
    if (msg.match(/\b(review|rating|feedback|testimonial)\b/)) {
      return {
        text: "All our doctors have verified patient reviews and ratings.\n\nYou can:\n• View ratings (1-5 stars)\n• Read patient reviews\n• See review count\n• Filter by top-rated doctors\n\nAfter your consultation, you can also leave a review!",
        options: [
          "🔍 Find Top Rated Doctors",
          "📅 Book Appointment",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Thank you
    if (msg.match(/\b(thank|thanks|appreciate)\b/)) {
      return {
        text: "You're very welcome! 😊\n\nFeel free to ask if you need anything else. Stay healthy and take care!",
        options: [
          "🔍 Find Doctors",
          "📅 Book Appointment",
          "📞 Contact Support",
          "🏠 Main Menu"
        ]
      };
    }
    
    // Goodbye
    if (msg.match(/\b(bye|goodbye|see you|later)\b/)) {
      return {
        text: "Goodbye! Take care and stay healthy! 👋\n\nFeel free to come back anytime you need help. Have a great day!"
      };
    }
    
    // Default response
    return {
      text: "I'm your healthcare assistant! I can help you with:\n\n🔍 Finding doctors\n📅 Booking appointments\n🚑 Emergency services\n💊 Prescription refills\n🧪 Lab tests\n💬 Online consultations\n\nWhat would you like to do?",
      options: [
        "🔍 Find Doctors",
        "📅 Book Appointment",
        "🚑 Emergency Services",
        "💊 Prescription Refill",
        "🧪 Lab Tests",
        "💬 Consult Online"
      ]
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const response = getBotResponse(input);
      const botMessage: Message = {
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        options: response.options
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOptionClick = async (option: string) => {
    setInput(option);
    const userMessage: Message = {
      text: option,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Check if it's a specialty selection for booking
    const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Gynecology', 'Ophthalmology', 'Dentistry'];
    const selectedSpec = specialties.find(s => option.includes(s));
    
    if (selectedSpec) {
      setSelectedSpecialty(selectedSpec);
      setBookingStep('doctors');
      
      try {
        const response = await apiService.getDoctors({ specialty: selectedSpec });
        const doctors = response.data.slice(0, 5);
        
        setTimeout(() => {
          const botMessage: Message = {
            text: `Here are our top ${selectedSpec} specialists:\n\nClick 'Book' to schedule your appointment:`,
            isBot: true,
            timestamp: new Date(),
            doctors: doctors,
            options: ["🔄 Change Specialty", "🏠 Main Menu"]
          };
          setMessages(prev => [...prev, botMessage]);
        }, 500);
      } catch (error) {
        setTimeout(() => {
          const botMessage: Message = {
            text: "Sorry, I couldn't fetch doctors at the moment. Please try again or contact support.",
            isBot: true,
            timestamp: new Date(),
            options: ["🔄 Try Again", "📞 Contact Support", "🏠 Main Menu"]
          };
          setMessages(prev => [...prev, botMessage]);
        }, 500);
      }
      return;
    }

    // Handle Change Specialty
    if (option.includes('Change Specialty')) {
      setTimeout(() => {
        const botMessage: Message = {
          text: "Please select a different specialty:",
          isBot: true,
          timestamp: new Date(),
          options: [
            "❤️ Cardiology",
            "🧠 Neurology",
            "🦴 Orthopedics",
            "👶 Pediatrics",
            "🩺 General Medicine",
            "👩 Gynecology",
            "👁️ Ophthalmology",
            "🦷 Dentistry",
            "🏠 Main Menu"
          ]
        };
        setMessages(prev => [...prev, botMessage]);
      }, 500);
      return;
    }

    setTimeout(() => {
      const response = getBotResponse(option);
      const botMessage: Message = {
        text: response.text,
        isBot: true,
        timestamp: new Date(),
        options: response.options,
        showBooking: response.showBooking
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleBookDoctor = (doctorId: string, doctorName: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const botMessage: Message = {
        text: "⚠️ Please sign in first to book an appointment.\n\nClick 'Sign In' at the top of the page to continue.",
        isBot: true,
        timestamp: new Date(),
        options: ["🏠 Main Menu", "📞 Contact Support"]
      };
      setMessages(prev => [...prev, botMessage]);
      return;
    }

    const botMessage: Message = {
      text: `✅ Great! To complete your booking with Dr. ${doctorName}:\n\n1. Close this chat\n2. Find Dr. ${doctorName} in the doctors list\n3. Click 'Book Appointment'\n4. Select your preferred date and time\n\nOr I can help you with something else!`,
      isBot: true,
      timestamp: new Date(),
      options: ["🔄 Choose Another Doctor", "🏠 Main Menu", "📞 Need Help?"]
    };
    setMessages(prev => [...prev, botMessage]);
    
    // Scroll to doctor in main page
    setTimeout(() => {
      setIsOpen(false);
      const doctorElement = document.querySelector(`[data-doctor-id="${doctorId}"]`);
      if (doctorElement) {
        doctorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 2000);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 animate-bounce touch-manipulation"
        >
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:right-6 sm:left-auto w-full sm:w-96 h-[100dvh] sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col z-50 border-t sm:border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex items-center justify-between safe-top">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">SehatNama Assistant</h3>
                <p className="text-xs text-blue-100">Online • Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all touch-manipulation active:scale-95"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 overscroll-contain">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-md border border-gray-200'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  }`}
                >
                  {message.isBot && (
                    <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1">
                      <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600">Assistant</span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  <p className={`text-[10px] sm:text-xs mt-1 ${message.isBot ? 'text-gray-400' : 'text-blue-100'}`}>
                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {message.isBot && message.doctors && (
                    <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                      {message.doctors.map((doctor) => (
                        <div key={doctor._id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2.5 sm:p-3 border border-blue-200">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">Dr. {doctor.name}</h4>
                              <p className="text-[10px] sm:text-xs text-gray-600 truncate">{doctor.specialty}</p>
                              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                                <span className="text-[10px] sm:text-xs text-yellow-600">⭐ {doctor.rating}</span>
                                <span className="text-[10px] sm:text-xs text-gray-500">•</span>
                                <span className="text-[10px] sm:text-xs text-gray-600">{doctor.experience}y</span>
                                <span className="text-[10px] sm:text-xs text-gray-500">•</span>
                                <span className="text-[10px] sm:text-xs text-green-600 font-semibold">₹{doctor.consultationFee}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleBookDoctor(doctor._id, doctor.name)}
                              className="ml-1 sm:ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold hover:shadow-lg transform active:scale-95 transition-all flex items-center gap-1 touch-manipulation flex-shrink-0"
                            >
                              <Calendar className="h-3 w-3" />
                              Book
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {message.isBot && message.options && (
                    <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left px-2.5 py-2 sm:px-3 sm:py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 active:from-blue-200 active:to-purple-200 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-all transform active:scale-95 border border-blue-200 touch-manipulation"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200 safe-bottom">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm touch-manipulation"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 sm:p-3 rounded-xl hover:shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
