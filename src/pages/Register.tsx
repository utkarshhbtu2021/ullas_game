import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../contexts/VoiceContext';
import { useUser } from '../contexts/UserContext';
import Header from '../components/Header';
import { authAPI, handleApiError } from '../services/apiService';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    gender: 'पुरुष', // Default value for Hindi
    age: '',
    stateOrUnionTerritory: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { isAuthenticated } = useUser();

  // Gender options based on language
  const genderOptions = language === 'hi' 
    ? [
        { value: 'पुरुष', label: 'पुरुष' },
        { value: 'महिला', label: 'महिला' },
        { value: 'अन्य', label: 'अन्य' }
      ]
    : [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
      ];

  // Indian States and Union Territories options based on language
  const stateOptions = language === 'hi' 
    ? [
        { value: '', label: 'राज्य या केंद्र शासित प्रदेश चुनें' },
        // States
        { value: 'आंध्र प्रदेश', label: 'आंध्र प्रदेश' },
        { value: 'अरुणाचल प्रदेश', label: 'अरुणाचल प्रदेश' },
        { value: 'असम', label: 'असम' },
        { value: 'बिहार', label: 'बिहार' },
        { value: 'छत्तीसगढ़', label: 'छत्तीसगढ़' },
        { value: 'गोवा', label: 'गोवा' },
        { value: 'गुजरात', label: 'गुजरात' },
        { value: 'हरियाणा', label: 'हरियाणा' },
        { value: 'हिमाचल प्रदेश', label: 'हिमाचल प्रदेश' },
        { value: 'झारखंड', label: 'झारखंड' },
        { value: 'कर्नाटक', label: 'कर्नाटक' },
        { value: 'केरल', label: 'केरल' },
        { value: 'मध्य प्रदेश', label: 'मध्य प्रदेश' },
        { value: 'महाराष्ट्र', label: 'महाराष्ट्र' },
        { value: 'मणिपुर', label: 'मणिपुर' },
        { value: 'मेघालय', label: 'मेघालय' },
        { value: 'मिजोरम', label: 'मिजोरम' },
        { value: 'नागालैंड', label: 'नागालैंड' },
        { value: 'ओडिशा', label: 'ओडिशा' },
        { value: 'पंजाब', label: 'पंजाब' },
        { value: 'राजस्थान', label: 'राजस्थान' },
        { value: 'सिक्किम', label: 'सिक्किम' },
        { value: 'तमिलनाडु', label: 'तमिलनाडु' },
        { value: 'तेलंगाना', label: 'तेलंगाना' },
        { value: 'त्रिपुरा', label: 'त्रिपुरा' },
        { value: 'उत्तर प्रदेश', label: 'उत्तर प्रदेश' },
        { value: 'उत्तराखंड', label: 'उत्तराखंड' },
        { value: 'पश्चिम बंगाल', label: 'पश्चिम बंगाल' },
        // Union Territories
        { value: 'अंडमान और निकोबार द्वीप समूह', label: 'अंडमान और निकोबार द्वीप समूह' },
        { value: 'चंडीगढ़', label: 'चंडीगढ़' },
        { value: 'दादरा और नगर हवेली और दमन और दीव', label: 'दादरा और नगर हवेली और दमन और दीव' },
        { value: 'दिल्ली', label: 'दिल्ली' },
        { value: 'जम्मू और कश्मीर', label: 'जम्मू और कश्मीर' },
        { value: 'लद्दाख', label: 'लद्दाख' },
        { value: 'लक्षद्वीप', label: 'लक्षद्वीप' },
        { value: 'पुदुचेरी', label: 'पुदुचेरी' }
      ]
    : [
        { value: '', label: 'Select State or Union Territory' },
        // States
        { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
        { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
        { value: 'Assam', label: 'Assam' },
        { value: 'Bihar', label: 'Bihar' },
        { value: 'Chhattisgarh', label: 'Chhattisgarh' },
        { value: 'Goa', label: 'Goa' },
        { value: 'Gujarat', label: 'Gujarat' },
        { value: 'Haryana', label: 'Haryana' },
        { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
        { value: 'Jharkhand', label: 'Jharkhand' },
        { value: 'Karnataka', label: 'Karnataka' },
        { value: 'Kerala', label: 'Kerala' },
        { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
        { value: 'Maharashtra', label: 'Maharashtra' },
        { value: 'Manipur', label: 'Manipur' },
        { value: 'Meghalaya', label: 'Meghalaya' },
        { value: 'Mizoram', label: 'Mizoram' },
        { value: 'Nagaland', label: 'Nagaland' },
        { value: 'Odisha', label: 'Odisha' },
        { value: 'Punjab', label: 'Punjab' },
        { value: 'Rajasthan', label: 'Rajasthan' },
        { value: 'Sikkim', label: 'Sikkim' },
        { value: 'Tamil Nadu', label: 'Tamil Nadu' },
        { value: 'Telangana', label: 'Telangana' },
        { value: 'Tripura', label: 'Tripura' },
        { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
        { value: 'Uttarakhand', label: 'Uttarakhand' },
        { value: 'West Bengal', label: 'West Bengal' },
        // Union Territories
        { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
        { value: 'Chandigarh', label: 'Chandigarh' },
        { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
        { value: 'Ladakh', label: 'Ladakh' },
        { value: 'Lakshadweep', label: 'Lakshadweep' },
        { value: 'Puducherry', label: 'Puducherry' }
      ];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setHasSpoken(false); // Reset when language changes
  }, [language]);

   useEffect(() => {
    if (!hasSpoken) {
      let registerText = "";
      if (language === "hi") {
        registerText = "पंजीकरण करें और अपनी शिक्षा यात्रा शुरू करें।";
      } else {
        registerText = "Register to start your learning journey.";
      }
      speak(registerText, true);
      setHasSpoken(true);
    }
  }, [language, speak, hasSpoken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!formData.fullName || !formData.userName || !formData.age || !formData.stateOrUnionTerritory) {
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

    try {
      const payload = {
        fullName: formData.fullName,
        userName: formData.userName,
        gender: formData.gender,
        age: parseInt(formData.age),
        stateOrUnionTerritory: formData.stateOrUnionTerritory
      };

      const data = await authAPI.register(payload);

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('ullas-token', data.data.token);
        
        // Store user data
        const userData = {
          id: data.data.user._id,
          name: data.data.user.fullName,
          userName: data.data.user.userName,
          gender: data.data.user.gender,
          age: data.data.user.age,
          stateOrUnionTerritory: data.data.user.stateOrUnionTerritory,
          role: data.data.user.role,
          streak: data.data.user.streak,
          createdAt: data.data.user.createdAt
        };
        localStorage.setItem('ullas-user', JSON.stringify(userData));

        // Initialize progress and stats for new user
        const defaultProgress = {
          phonics: { level: 1, score: 0, completed: false },
          imageWord: { level: 1, score: 0, completed: false },
          counting: { level: 1, score: 0, completed: false },
          reading: { level: 1, score: 0, completed: false },
          writing: { level: 1, score: 0, completed: false },
        };
        const defaultStats = {
          totalScore: 0,
          gamesCompleted: 0,
          streakDays: 0,
          lastLoginDate: new Date().toISOString(),
        };

        localStorage.setItem('ullas-progress', JSON.stringify(defaultProgress));
        localStorage.setItem('ullas-stats', JSON.stringify(defaultStats));
        localStorage.setItem(`ullas-progress-${userData.id}`, JSON.stringify(defaultProgress));
        localStorage.setItem(`ullas-stats-${userData.id}`, JSON.stringify(defaultStats));

        const successMsg = language === 'hi' ? 'सफलतापूर्वक पंजीकृत हो गए' : 'Successfully registered';
        speak(successMsg);
        navigate('/dashboard');
      } else {
        const errorMsg = data.message || (language === 'hi' ? 'पंजीकरण में त्रुटि' : 'Registration error');
        setError(errorMsg);
        speak(errorMsg);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMsg = handleApiError(error, language);
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
            {/* Full Name Field */}
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
                  name="fullName"
                  value={formData.fullName}
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

            {/* Username Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-1
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('userName')} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  placeholder={t('enterUserName')}
                  required
                />
              </div>
            </div>

            {/* Gender Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-1
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('gender')} *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200 appearance-none bg-white
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  required
                >
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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

            {/* State/Union Territory Field */}
            <div>
              <label className={`
                block text-sm font-medium text-gray-700 mb-1
                ${language === 'hi' ? 'font-hindi' : 'font-english'}
              `}>
                {t('stateOrUnionTerritory')} *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="stateOrUnionTerritory"
                  value={formData.stateOrUnionTerritory}
                  onChange={handleInputChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors duration-200 appearance-none bg-white
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                  required
                >
                  {stateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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