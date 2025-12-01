import React from 'react';
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Shield, Award, Clock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-red-400 mr-3" />
              <span className="text-2xl font-bold">SehatNama</span>
            </div>
            <p className="text-blue-200 mb-6 leading-relaxed">
              Your trusted healthcare partner. Connecting patients with qualified doctors across India for better health outcomes.
            </p>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center bg-green-600 bg-opacity-20 rounded-lg px-3 py-2">
                <Shield className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-xs font-medium text-green-300">{t('verified')}</span>
              </div>
              <div className="flex items-center bg-yellow-600 bg-opacity-20 rounded-lg px-3 py-2">
                <Award className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-xs font-medium text-yellow-300">{t('trusted')}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40 transition-all duration-300 group">
                <Facebook className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
              </a>
              <a href="#" className="w-10 h-10 bg-sky-600 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40 transition-all duration-300 group">
                <Twitter className="h-5 w-5 text-sky-400 group-hover:text-sky-300" />
              </a>
              <a href="#" className="w-10 h-10 bg-pink-600 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40 transition-all duration-300 group">
                <Instagram className="h-5 w-5 text-pink-400 group-hover:text-pink-300" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-700 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40 transition-all duration-300 group">
                <Linkedin className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              {[
                t('findDoctors'),
                t('bookAppointmentLink'),
                t('healthRecords'),
                t('emergencyCare'),
                t('telemedicine'),
                t('healthInsurance')
              ].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">{t('specialties')}</h3>
            <ul className="space-y-3">
              {[
                'Cardiology',
                'Dermatology',
                'Neurology',
                'Orthopedics',
                'Pediatrics',
                'General Medicine'
              ].map((specialty, index) => (
                <li key={index}>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-1 h-1 bg-green-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                    {specialty}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">{t('contactUs')}</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('helpline')}</p>
                  <p className="text-blue-200">+91 1800-123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('emailSupport')}</p>
                  <p className="text-blue-200">support@sehetnama.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('address')}</p>
                  <p className="text-blue-200">Mumbai, Maharashtra, India</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">{t('supportHours')}</p>
                  <p className="text-blue-200">{t('available247')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group">
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">500+</div>
              <div className="text-blue-200 text-sm">{t('verifiedDoctors')}</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">100+</div>
              <div className="text-blue-200 text-sm">{t('citiesCovered')}</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">50+</div>
              <div className="text-blue-200 text-sm">{t('specialties')}</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">24/7</div>
              <div className="text-blue-200 text-sm">{t('support')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800 bg-slate-900 bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-blue-200 text-sm mb-4 md:mb-0">
              {t('allRightsReserved')}
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">{t('privacyPolicy')}</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">{t('termsOfService')}</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">{t('cookiePolicy')}</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">{t('disclaimer')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;