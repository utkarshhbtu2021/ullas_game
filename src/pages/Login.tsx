import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../contexts/VoiceContext';
import { useUser } from '../contexts/UserContext';
import Header from '../components/Header';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

    if (!email || !password) {
      const errorMsg = language === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill in all fields';
      setError(errorMsg);
      speak(errorMsg);
      setIsLoading(false);
      return;
    }

    const success = login(email, password);
    
    if (success) {
      speak(language === 'hi' ? 'सफलतापूर्वक लॉग इन हो गए' : 'Successfully logged in');
      navigate('/dashboard');
    } else {
      const errorMsg = language === 'hi' ? 'गलत ईमेल या पासवर्ड' : 'Invalid email or password';
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
              <Lock className="h-10 w-10 text-white" />
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
            {/* Email Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-2
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterEmail')}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-2
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`
                    w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterPassword')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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