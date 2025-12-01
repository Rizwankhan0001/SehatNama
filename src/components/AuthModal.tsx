import React, { useState } from 'react';
import { X, Eye, EyeOff, Phone, Mail } from 'lucide-react';
import apiService from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'google'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    disease: '',
    specialization: '',
    address: '',
    userType: 'patient'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      const userData = { ...formData, userType };
      
      if (isLogin) {
        if (loginMethod === 'phone') {
          await apiService.sendOTP(formData.phone, userType);
          setShowOTP(true);
          setLoading(false);
          return;
        } else {
          response = await apiService.login(formData.email, formData.password, userType);
        }
      } else {
        response = await apiService.register(userData);
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', userType);
      onAuthSuccess(response.data.user);
      onClose();
    } catch (error: any) {
      alert(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOTPVerification = async () => {
    setLoading(true);
    try {
      const response = await apiService.verifyOTP(formData.phone, otp, userType);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', userType);
      onAuthSuccess(response.data.user);
      onClose();
    } catch (error: any) {
      alert(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      alert('Google login will be implemented with OAuth integration');
    } catch (error: any) {
      alert(error.message || 'Google login failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-600">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-1 border border-blue-100">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                userType === 'patient'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🏥 Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                userType === 'doctor'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              👨⚕️ Doctor
            </button>
          </div>
        </div>

        {isLogin && (
          <div className="mb-3">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                  loginMethod === 'email'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                  loginMethod === 'phone'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Phone
              </button>
            </div>
          </div>
        )}

        {!showOTP ? (
          <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required={!isLogin}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Full Name"
            />
          )}

          {(loginMethod === 'email' || !isLogin) && (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required={loginMethod === 'email' || !isLogin}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Email Address"
            />
          )}

          {(loginMethod === 'phone' || !isLogin) && (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required={loginMethod === 'phone' || !isLogin}
              placeholder="Phone Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          )}

          {!isLogin && userType === 'patient' && (
            <input
              type="text"
              name="disease"
              value={formData.disease}
              onChange={handleInputChange}
              placeholder="Disease/Condition (Optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          )}

          {!isLogin && userType === 'doctor' && (
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required={!isLogin && userType === 'doctor'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="">Select Specialization</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Psychiatrist">Psychiatrist</option>
              <option value="General Physician">General Physician</option>
            </select>
          )}

          {!isLogin && (
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required={!isLogin}
              rows={2}
              placeholder="Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            />
          )}

          {(loginMethod === 'email' || !isLogin) && (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={loginMethod === 'email' || !isLogin}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Please wait...
              </div>
            ) : (isLogin && loginMethod === 'phone' ? 'Send OTP' : (isLogin ? 'Sign In' : 'Create Account'))}
          </button>
        </form>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600">Enter OTP sent to {formData.phone}</p>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-center tracking-widest"
            />
            <button
              onClick={handleOTPVerification}
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 text-sm transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              onClick={() => setShowOTP(false)}
              className="w-full text-gray-600 text-sm py-2 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          </div>
        )}

        {isLogin && loginMethod === 'email' && (
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-3 w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;