import React, { useState } from 'react';
import { Heart, Menu, User } from 'lucide-react';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: 'doctors' | 'appointments' | 'health-records' | 'about' | 'profile') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const { t } = useTranslation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You could verify token and get user info here
      setUser({ name: 'User' }); // Placeholder
    }
  }, []);
  
  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
  };
  
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => onPageChange('doctors')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Heart className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">SehatNama</span>
            </button>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => onPageChange('doctors')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'doctors' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-700 dark:text-gray-200 hover:text-primary-600'
                }`}
              >
{t('findDoctors')}
              </button>
              <button 
                onClick={() => onPageChange('appointments')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'appointments' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-700 dark:text-gray-200 hover:text-primary-600'
                }`}
              >
{t('appointments')}
              </button>
              <button 
                onClick={() => onPageChange('health-records')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'health-records' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-700 dark:text-gray-200 hover:text-primary-600'
                }`}
              >
{t('healthRecords')}
              </button>
              <button 
                onClick={() => onPageChange('about')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'about' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-700 dark:text-gray-200 hover:text-primary-600'
                }`}
              >
{t('about')}
              </button>
              <button 
                onClick={() => onPageChange('profile')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentPage === 'profile' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-700 dark:text-gray-200 hover:text-primary-600'
                }`}
              >
{t('profile')}
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSelector />
              {user ? (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onPageChange('profile')}
                    className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{user.name}</span>
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {t('signOut')}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  {t('signIn')}
                </button>
              )}
              <button className="md:hidden">
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;