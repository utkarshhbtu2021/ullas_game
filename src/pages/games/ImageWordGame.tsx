import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, RefreshCw, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import Header from '../../components/Header';
import Confetti from 'react-confetti';


interface ImageWordQuestion {
  image: string;
  correctWord: string;
  options: string[];
}

const ImageWordGame: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { progress, updateProgress } = useUser();

  const [currentLevel, setCurrentLevel] = useState(progress.imageWord.level);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const questions: ImageWordQuestion[] = [
    {
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      correctWord: language === 'hi' ? 'कुत्ता' : 'Dog',
      options: language === 'hi' ? ['कुत्ता', 'बिल्ली', 'गाय', 'घोड़ा'] : ['Dog', 'Cat', 'Cow', 'Horse']
    },
    {
      image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
      correctWord: language === 'hi' ? 'बिल्ली' : 'Cat',
      options: language === 'hi' ? ['बिल्ली', 'कुत्ता', 'चूहा', 'खरगोश'] : ['Cat', 'Dog', 'Mouse', 'Rabbit']
    },
    {
      image: 'https://images.pexels.com/photos/162140/duckling-birds-yellow-fluffy-162140.jpeg?auto=compress&cs=tinysrgb&w=400',
      correctWord: language === 'hi' ? 'बत्तख' : 'Duck',
      options: language === 'hi' ? ['बत्तख', 'मुर्गी', 'कबूतर', 'तोता'] : ['Duck', 'Chicken', 'Pigeon', 'Parrot']
    },
    {
      image: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=400',
      correctWord: language === 'hi' ? 'मछली' : 'Fish',
      options: language === 'hi' ? ['मछली', 'केकड़ा', 'झींगा', 'ऑक्टोपस'] : ['Fish', 'Crab', 'Shrimp', 'Octopus']
    },
    {
      image: 'https://images.pexels.com/photos/62613/heliconius-melpomene-butterfly-exotic-62613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      correctWord: language === 'hi' ? 'तितली' : 'Butterfly',
      options: language === 'hi' ? ['तितली', 'मक्खी', 'मधुमक्खी', 'मच्छर'] : ['Butterfly', 'Fly', 'Bee', 'Mosquito']
    }
  ];

  useEffect(() => {
    speak(`${t('imageWordGame')}. ${t('instructions')}: ${language === 'hi' ? 'चित्र देखकर सही शब्द चुनें' : 'Look at the image and select the correct word'}`);
    // Speak current question after a short delay
    setTimeout(() => {
      speakCurrentQuestion();
    }, 2000);
  }, []);

  // Speak question when currentQuestion changes
  useEffect(() => {
    if (currentQuestion > 0 && !showResult) {
      speakCurrentQuestion();
    }
  }, [currentQuestion]);

  const speakCurrentQuestion = () => {
    const instruction = language === 'hi' 
      ? 'इस चित्र के लिए सही शब्द चुनें'
      : 'Select the correct word for this image';
    speak(instruction);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctWord;
    
    if (isCorrect) {
      setScore(score + 10);
      speak(`${t('correct')}! ${answer}`);
    } else {
      speak(`${t('incorrect')}. ${language === 'hi' ? 'सही उत्तर है' : 'Correct answer is'} ${questions[currentQuestion].correctWord}`);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        // Don't call speakCurrentQuestion here - it will be called by useEffect
      } else {
        completeGame();
      }
    }, 3000);
  };

  const completeGame = () => {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correctWord ? 10 : 0);
    const newLevel = Math.min(currentLevel + 1, 5);
    const completed = newLevel >= 5;
    
    updateProgress('imageWord', {
      level: newLevel,
      score: Math.max(progress.imageWord.score, finalScore),
      completed
    });
    
    setGameCompleted(true);
    speak(`${t('wellDone')}! ${t('score')}: ${finalScore}`);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameCompleted(false);
    // Speak first question after restart
    setTimeout(() => {
      speakCurrentQuestion();
    }, 1000);
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-green-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h2 className={`text-3xl font-bold text-gray-800 mb-4 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t('wellDone')}
            </h2>
            <p className={`text-lg text-gray-600 mb-6 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t('score')}: {score}
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={restartGame}
                className={`px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}
              >
                {t('tryAgain')}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}
              >
                {t('backToDashboard')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

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
          
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t('level')} {currentLevel}
            </div>
            <div className={`px-4 py-2 bg-success-100 text-success-700 rounded-full font-medium ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {t('score')}: {score}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm text-gray-600 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {language === 'hi' ? 'प्रगति' : 'Progress'}
            </span>
            <span className={`text-sm text-gray-600 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-secondary-500 to-success-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Game Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Question */}
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold text-gray-800 mb-6 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                {language === 'hi' ? 'इस चित्र के लिए सही शब्द चुनें:' : 'Select the correct word for this image:'}
              </h2>
              
              {/* Image */}
              <div className="mb-8">
                <img 
                  src={question.image} 
                  alt="Question"
                  className="w-64 h-64 object-cover rounded-2xl mx-auto shadow-lg border-4 border-secondary-200"
                />
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`
                    p-6 rounded-2xl font-bold text-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 relative overflow-hidden
                    ${showResult && option === question.correctWord
                      ? 'bg-success-500 text-white shadow-lg'
                      : showResult && option === selectedAnswer && option !== question.correctWord
                      ? 'bg-error-500 text-white shadow-lg'
                      : showResult
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-700 hover:from-secondary-200 hover:to-secondary-300 shadow-md hover:shadow-lg focus:ring-secondary-300'
                    }
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                >
                  {option}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300 transform -skew-x-12"></div>
                </button>
              ))}
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className="text-center mt-8">
                <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium animate-pulse-slow ${
                  selectedAnswer === question.correctWord
                    ? 'bg-success-100 text-success-700'
                    : 'bg-error-100 text-error-700'
                } ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  {selectedAnswer === question.correctWord ? (
                    <>
                      <Award className="h-5 w-5" />
                      <span>{t('correct')}! {selectedAnswer}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      <span>{t('incorrect')} - {question.correctWord}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Sound Button */}
            {showResult && (
              <div className="text-center mt-4">
                <button
                  onClick={() => speak(question.correctWord)}
                  className="p-3 bg-secondary-100 hover:bg-secondary-200 rounded-full transition-colors duration-200"
                  title={t('tapToHear')}
                >
                  <Volume2 className="h-6 w-6 text-secondary-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageWordGame;