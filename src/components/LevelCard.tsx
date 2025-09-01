import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../contexts/VoiceContext';
import { Circle, Target, Star, CircleDot } from 'lucide-react';

interface LevelCardProps {
  level: string;
  title: string;
  subtitle: string;
  gamesCount: number;
  starsCount: number;
  isAvailable: boolean;
  isSelected?: boolean;
  onSelect: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({
  level,
  title,
  subtitle,
  gamesCount,
  starsCount,
  isAvailable,
  isSelected = false,
  onSelect,
}) => {
  const { language } = useLanguage();
  const { speak } = useVoice();

  // Dynamic level configuration based on level name
  // const getLevelConfig = (levelName: string) => {
  //   const levelLower = levelName.toLowerCase();

  //   if (levelLower.includes('शुरुआती') || levelLower.includes('beginner')) {
  //     return {
  //       headerColor: 'bg-green-500',
  //       icon: <Circle className="h-6 w-6" />,
  //     };
  //   } else if (levelLower.includes('मध्यम') || levelLower.includes('medium') || levelLower.includes('intermediate')) {
  //     return {
  //       headerColor: 'bg-blue-500',
  //       icon: <CircleDot size={16} strokeWidth={3} className="h-6 w-6" />,
  //     };
  //   } else if (levelLower.includes('उन्नत') || levelLower.includes('advanced')) {
  //     return {
  //       headerColor: 'bg-purple-500',
  //       icon: <Target className="h-6 w-6" />,
  //     };
  //   } else {
  //     // Default configuration for unknown levels
  //     return {
  //       headerColor: 'bg-gray-500',
  //       icon: <Circle className="h-6 w-6" />,
  //     };
  //   }
  // };

  const getLevelConfig = (levelName: string) => {
    const levelLower = levelName.toLowerCase();

    if (
      levelLower.includes('लेवल 1') ||
      levelLower.includes('beginner') ||
      levelLower.includes('level 1')
    ) {
      return {
        headerColor: 'bg-green-500',
        icon: <Circle className="h-6 w-6" />,
      };
    } else if (
      levelLower.includes('लेवल 2') ||
      levelLower.includes('medium') ||
      levelLower.includes('intermediate') ||
      levelLower.includes('level 2')
    ) {
      return {
        headerColor: 'bg-blue-500',
        icon: <CircleDot size={16} strokeWidth={3} className="h-6 w-6" />,
      };
    } else if (
      levelLower.includes('लेवल 3') ||
      levelLower.includes('advanced') ||
      levelLower.includes('level 3')
    ) {
      return {
        headerColor: 'bg-purple-500',
        icon: <Target className="h-6 w-6" />,
      };
    } else {
      // Default configuration for unknown levels
      return {
        headerColor: 'bg-gray-500',
        icon: <Circle className="h-6 w-6" />,
      };
    }
  };

  const config = getLevelConfig(level);

  const handleClick = () => {
    if (isAvailable) {
      speak(title);
      onSelect();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg
        ${isAvailable ? 'hover:shadow-xl' : 'opacity-75 cursor-not-allowed'}
        ${isSelected ? 'ring-4 ring-primary-500 ring-opacity-50' : ''}
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
      {/* Header Section */}
      <div className={`${config.headerColor} rounded-t-2xl p-4 text-white`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3
              className={`
              text-xl font-bold mb-1
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}
            >
              {title}
            </h3>
            <p
              className={`
              text-sm opacity-90
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}
            >
              {subtitle}
            </p>
          </div>
          <div className="bg-white rounded-full p-2 border border-gray-200 text-gray-800">
            {config.icon}
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="bg-white rounded-b-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <p
              className={`
              text-sm text-gray-600
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}
            >
              {language === 'hi' ? `${gamesCount} खेल` : `${gamesCount} Games`}
            </p>
          </div>
          <div className="text-center flex items-center space-x-1">
            <p
              className={`
              text-sm text-gray-600
              ${language === 'hi' ? 'font-hindi' : 'font-english'}
            `}
            >
              {language === 'hi' ? `${starsCount} तारे` : `${starsCount} Stars`}
            </p>
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
          </div>
        </div>

        {/* Button */}
        <button
          className={`
            w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-200
            ${
              isAvailable
                ? 'bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            ${language === 'hi' ? 'font-hindi' : 'font-english'}
          `}
          disabled={!isAvailable}
        >
          {language === 'hi' ? 'अभी खेलें' : 'Play Now'}
        </button>
      </div>
    </div>
  );
};

export default LevelCard;
