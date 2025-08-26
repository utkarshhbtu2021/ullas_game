import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../contexts/VoiceContext';
import { useUser } from '../contexts/UserContext';
import Header from '../components/Header';

const Login: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { login, isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(t('login'));
    }, 30000);  

    return () => clearTimeout(timer);
  }, [speak, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!fullName || !userName) {
      const errorMsg = language === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill in all fields';
      setError(errorMsg);
      speak(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(fullName, userName);
      
      if (success) {
        speak(language === 'hi' ? 'सफलतापूर्वक लॉग इन हो गए' : 'Successfully logged in');
        navigate('/dashboard');
      } else {
        const errorMsg = language === 'hi' ? 'गलत नाम या उपयोगकर्ता नाम' : 'Invalid name or username';
        setError(errorMsg);
        speak(errorMsg);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = language === 'hi' ? 'नेटवर्क त्रुटि, कृपया पुनः प्रयास करें' : 'Network error, please try again';
      setError(errorMsg);
      speak(errorMsg);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen mainHome__inner">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition-transform duration-300">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className={`
              text-3xl font-bold text-gray-800 mb-2
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}>
              {t('login')}
            </h2>
            <p className={`
              text-gray-600
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}>
              {language === 'hi' ? 'अपने खाते में प्रवेश करें' : 'Access your learning account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-2
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('name')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterName')}
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-2
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('userName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterUserName')}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                <p className={`
                  text-sm text-error-700
                  ${language === 'hi' ? 'font-hindi' : 'font-english'}
                `}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl
                hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300
                disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {language === 'hi' ? 'प्रतीक्षा करें...' : 'Please wait...'}
                </div>
              ) : (
                t('login')
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className={`
              text-gray-600
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}>
              {t('dontHaveAccount')}{' '}
              <Link
                to="/register"
                className="text-primary-600 font-semibold hover:text-primary-700 focus:outline-none focus:underline"
                onClick={() => speak(t('signUpHere'))}
              >
                {t('signUpHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;