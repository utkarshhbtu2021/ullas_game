import React, { useEffect } from 'react';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useVoice } from '../../contexts/VoiceContext';
import Header from '../../components/Header';

const WritingGame: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();

  useEffect(() => {
    speak(t('comingSoon'));
  }, [speak, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <span className={`text-gray-600 font-medium ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t('backToDashboard')}
            </span>
          </button>
        </div>

        {/* Coming Soon Content */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Construction className="h-12 w-12 text-white" />
            </div>
            
            <h1 className={`text-4xl font-bold text-gray-800 mb-6 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t('writingGame')}
            </h1>
            
            <div className="bg-success-50 border-2 border-success-200 rounded-2xl p-6 mb-8">
              <h2 className={`text-2xl font-bold text-success-700 mb-4 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                {t('comingSoon')}
              </h2>
              <p className={`text-lg text-success-600 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                {language === 'hi' 
                  ? 'यह खेल जल्द ही उपलब्ध होगा। इसमें आप अक्षर और शब्द लिखना सीखेंगे।'
                  : 'This game will be available soon. You will learn to write letters and words.'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6">
                <h3 className={`text-lg font-bold text-primary-700 mb-2 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  {language === 'hi' ? 'सुविधाएं' : 'Features'}
                </h3>
                <ul className={`text-primary-600 space-y-2 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  <li>• {language === 'hi' ? 'अक्षर लिखना सीखें' : 'Learn to write letters'}</li>
                  <li>• {language === 'hi' ? 'शब्द बनाना' : 'Form words'}</li>
                  <li>• {language === 'hi' ? 'हस्तलेखन सुधार' : 'Improve handwriting'}</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6">
                <h3 className={`text-lg font-bold text-secondary-700 mb-2 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  {language === 'hi' ? 'लाभ' : 'Benefits'}
                </h3>
                <ul className={`text-secondary-600 space-y-2 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  <li>• {language === 'hi' ? 'मोटर स्किल विकास' : 'Develop motor skills'}</li>
                  <li>• {language === 'hi' ? 'अक्षर पहचान' : 'Letter recognition'}</li>
                  <li>• {language === 'hi' ? 'लेखन अभ्यास' : 'Writing practice'}</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className={`px-8 py-4 bg-gradient-to-r from-success-500 to-success-600 text-white font-bold rounded-xl hover:from-success-600 hover:to-success-700 transform hover:scale-105 transition-all duration-200 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}
            >
              {t('backToDashboard')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingGame;