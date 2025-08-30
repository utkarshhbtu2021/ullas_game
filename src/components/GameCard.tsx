import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../contexts/VoiceContext';
import { Play, Lock } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  isAvailable: boolean;
  level?: string | number;
  score?: number;
  progress?: number;
  quizId?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon,
  path,
  isAvailable,
  level = 1,
  score = 0,
  progress = 0,
  quizId
}) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();

  const handleClick = () => {
    if (isAvailable) {
      speak(title);
      // If quizId is provided, pass it as state instead of URL parameter
      if (quizId) {
        navigate(path, { state: { quizId } });
      } else {
        navigate(path);
      }
    } else {
      speak(t('comingSoon'));
    }
  };

  // Helper function to get level display text
  const getLevelDisplay = () => {
    if (typeof level === 'string') {
      return t(level); // Use translation for level names like 'beginner', 'intermediate', etc.
    }
    return level; // Return number as is
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4
        ${isAvailable 
          ? 'bg-gradient-to-br from-white to-primary-50 shadow-lg hover:shadow-xl border-2 border-primary-100 hover:border-primary-300 focus:ring-primary-500' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200 shadow-md border-2 border-gray-200 cursor-not-allowed opacity-75 focus:ring-gray-400'
        }
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Progress Indicator */}
      {isAvailable && progress > 0 && (
        <div className="absolute top-2 right-2">
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray={`${progress}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-success-600">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Game Icon */}
      <div className={`
        flex items-center justify-center w-16 h-16 rounded-2xl mb-4 mx-auto
        ${isAvailable 
          ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg' 
          : 'bg-gray-400 text-gray-600'
        }
      `}>
        {isAvailable ? icon : <Lock className="h-8 w-8" />}
      </div>

      {/* Game Title */}
      <h3 className={`
        text-xl font-bold text-center mb-2
        ${language === 'hi' ? 'font-hindi' : 'font-english'}
        ${isAvailable ? 'text-gray-800' : 'text-gray-500'}
      `}>
        {title}
      </h3>

      {/* Game Description */}
      <p className={`
        text-sm text-center mb-4
        ${language === 'hi' ? 'font-hindi' : 'font-english'}
        ${isAvailable ? 'text-gray-600' : 'text-gray-400'}
      `}>
        {description}
      </p>

      {/* Game Stats */}
      {isAvailable && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{t('level')}</p>
            <p className="text-lg font-bold text-primary-600">{getLevelDisplay()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{t('score')}</p>
            <p className="text-lg font-bold text-success-600">{score}</p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center">
        <div className={`
          flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium
          ${isAvailable 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-300 text-gray-500'
          }
        `}>
          {isAvailable ? (
            <>
              <Play className="h-4 w-4" />
              <span className={language === 'hi' ? 'font-hindi' : 'font-english'}>
                {t('startGame')}
              </span>
            </>
          ) : (
            <span className={language === 'hi' ? 'font-hindi' : 'font-english'}>
              {t('comingSoon')}
            </span>
          )}
        </div>
      </div>

      {/* Hover Animation */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
        ${isAvailable ? 'hover:opacity-100 bg-gradient-to-r from-primary-500/10 to-secondary-500/10' : ''}
      `} />
    </div>
  );
};

export default GameCard;