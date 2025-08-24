import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Calendar, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../contexts/VoiceContext';
import { useUser } from '../contexts/UserContext';
import Header from '../components/Header';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    location: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { register, isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

 useEffect(() => {
  const timer = setTimeout(() => {
    speak(t('register'));
  }, 30000); // 30,000 milliseconds = 30 seconds

  // Cleanup on unmount
  return () => clearTimeout(timer);
}, [speak, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.age) {
      const errorMsg = language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill in all required fields';
      setError(errorMsg);
      speak(errorMsg);
      setIsLoading(false);
      return;
    }

    if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
      const errorMsg = language === 'hi' ? 'कृपया वैध उम्र दर्ज करें (18-100)' : 'Please enter a valid age (18-100)';
      setError(errorMsg);
      speak(errorMsg);
      setIsLoading(false);
      return;
    }

    const success = register({
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      location: formData.location,
      phoneNumber: formData.phoneNumber,
      password: formData.password
    });

    if (success) {
      speak(language === 'hi' ? 'सफलतापूर्वक पंजीकृत हो गए' : 'Successfully registered');
      navigate('/dashboard');
    } else {
      const errorMsg = language === 'hi' ? 'इस ईमेल से पहले से खाता है' : 'Account already exists with this email';
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
            <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className={`
              text-3xl font-bold text-gray-800 mb-2
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}>
              {t('register')}
            </h2>
            <p className={`
              text-gray-600
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}>
              {language === 'hi' ? 'अपनी शिक्षा यात्रा शुरू करें' : 'Start your learning journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-1
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('name')} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterName')}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-1
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('email')} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterEmail')}
                  required
                />
              </div>
            </div>

            {/* Age Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-1
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('age')} *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterAge')}
                  required
                />
              </div>
            </div>

            {/* Location Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-1
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('location')}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterLocation')}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-1
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('phoneNumber')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterPhone')}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-1
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('password')} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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
                w-full py-3 px-4 bg-gradient-to-r from-success-500 to-success-600 text-white font-bold rounded-xl
                hover:from-success-600 hover:to-success-700 focus:outline-none focus:ring-4 focus:ring-success-300
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
                t('register')
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className={`
              text-gray-600
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}>
              {t('alreadyHaveAccount')}{' '}
              <Link
                to="/login"
                className="text-primary-600 font-semibold hover:text-primary-700 focus:outline-none focus:underline"
                onClick={() => speak(t('signInHere'))}
              >
                {t('signInHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;