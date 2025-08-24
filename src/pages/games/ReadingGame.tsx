import React, { useEffect } from 'react';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useVoice } from '../../contexts/VoiceContext';
import Header from '../../components/Header';

const ReadingGame: React.FC = () => {
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
            <div className="w-24 h-24 bg-gradient-to-br from-warning-500 to-warning-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Construction className="h-12 w-12 text-white" />
            </div>
            
            <h1 className={`text-4xl font-bold text-gray-800 mb-6 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t('readingGame')}
            </h1>
            
            <div className="bg-warning-50 border-2 border-warning-200 rounded-2xl p-6 mb-8">
              <h2 className={`text-2xl font-bold text-warning-700 mb-4 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                {t('comingSoon')}
              </h2>
              <p className={`text-lg text-warning-600 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                {language === 'hi' 
                  ? 'यह खेल जल्द ही उपलब्ध होगा। इसमें आप वाक्य और कहानियां पढ़ना सीखेंगे।'
                  : 'This game will be available soon. You will learn to read sentences and stories.'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6">
                <h3 className={`text-lg font-bold text-primary-700 mb-2 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  {language === 'hi' ? 'सुविधाएं' : 'Features'}
                </h3>
                <ul className={`text-primary-600 space-y-2 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  <li>• {language === 'hi' ? 'सरल वाक्य पढ़ना' : 'Simple sentence reading'}</li>
                  <li>• {language === 'hi' ? 'कहानी समझना' : 'Story comprehension'}</li>
                  <li>• {language === 'hi' ? 'शब्द पहचान' : 'Word recognition'}</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6">
                <h3 className={`text-lg font-bold text-secondary-700 mb-2 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  {language === 'hi' ? 'लाभ' : 'Benefits'}
                </h3>
                <ul className={`text-secondary-600 space-y-2 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  <li>• {language === 'hi' ? 'पढ़ने की गति बढ़ाना' : 'Improve reading speed'}</li>
                  <li>• {language === 'hi' ? 'समझ विकसित करना' : 'Develop comprehension'}</li>
                  <li>• {language === 'hi' ? 'शब्दावली बढ़ाना' : 'Expand vocabulary'}</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className={`px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}
            >
              {t('backToDashboard')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingGame;