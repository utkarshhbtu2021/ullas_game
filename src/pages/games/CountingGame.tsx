import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, RefreshCw, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import Header from '../../components/Header';
import Confetti from 'react-confetti';

interface CountingQuestion {
  items: string[];
  count: number;
  options: number[];
}

const CountingGame: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { progress, updateProgress } = useUser();

  const [currentLevel, setCurrentLevel] = useState(progress.counting.level);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [wrongAnswerSelected, setWrongAnswerSelected] = useState(false);

  const questions: CountingQuestion[] = [
    {
      items: ['🍎', '🍎', '🍎'],
      count: 3,
      options: [2, 3, 4, 5]
    },
    {
      items: ['🥭', '🥭', '🥭', '🥭'],
      count: 4,
      options: [4, 5, 6, 7]
    },
    {
      items: ['🐠', '🐠', '🐠', '🐠', '🐠'],
      count: 5,
      options: [1, 2, 5, 4]
    },
    {
      items: ['🐦', '🐦'],
      count: 2,
      options: [6, 7, 2, 9]
    },
    {
      items: ['🌸', '🌸', '🌸', '🌸', '🌸', '🌸'],
      count: 6,
      options: [3, 4, 5, 6]
    }
  ];

  useEffect(() => {
    speak(`${t('countingGame')}. ${t('instructions')}: ${language === 'hi' ? 'चित्रों को गिनें और सही संख्या चुनें' : 'Count the items and select the correct number'}`);
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
      ? 'इन चीजों को गिनें और सही संख्या चुनें'
      : 'Count these items and select the correct number';
    speak(instruction);
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].count;
    
    if (isCorrect) {
      setScore(score + 10);
      const countText = language === 'hi' ? `${answer} सही है!` : `${answer} is correct!`;
      speak(`${t('correct')}! ${countText}`);
    } else {
      const correctText = language === 'hi' 
        ? `गलत! सही उत्तर है ${questions[currentQuestion].count}`
        : `Wrong! The correct answer is ${questions[currentQuestion].count}`;
      speak(correctText);
      setWrongAnswerSelected(true);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setWrongAnswerSelected(false);
        // Don't call speakCurrentQuestion here - it will be called by useEffect
      } else {
        completeGame();
      }
    }, 3000);
  };

  const completeGame = () => {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].count ? 10 : 0);
    const newLevel = Math.min(currentLevel + 1, 5);
    const completed = newLevel >= 5;
    
    updateProgress('counting', {
      level: newLevel,
      score: Math.max(progress.counting.score, finalScore),
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
    setWrongAnswerSelected(false);
    // Speak first question after restart
    setTimeout(() => {
      speakCurrentQuestion();
    }, 1000);
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen mainHome__inner dashboard">
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
    <div className="min-h-screen mainHome__inner dashboard">
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
              className="bg-gradient-to-r from-warning-500 to-success-500 h-3 rounded-full transition-all duration-500"
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
                {language === 'hi' ? 'इन चीजों को गिनें:' : 'Count these items:'}
              </h2>
              
              {/* Items to Count */}
              <div className="mb-8 p-8 bg-gradient-to-br from-warning-50 to-orange-50 rounded-2xl border-2 border-warning-200">
                <div className="flex flex-wrap justify-center items-center gap-4">
                  {question.items.map((item, index) => (
                    <div
                      key={index}
                      className="text-6xl animate-bounce"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Count Instruction */}
              {/* <button
                onClick={() => speak(language === 'hi' ? `${question.count} चीजें हैं` : `There are ${question.count} items`)}
                className="flex items-center justify-center space-x-2 mx-auto mb-6 p-3 bg-warning-100 hover:bg-warning-200 rounded-full transition-colors duration-200"
                title={t('tapToHear')}
              >
                <Volume2 className="h-6 w-6 text-warning-600" />
                <span className={`text-warning-700 font-medium ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  {language === 'hi' ? 'गिनती सुनें' : 'Listen to count'}
                </span>
              </button> */}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`
                    p-6 rounded-2xl font-bold text-3xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 relative overflow-hidden
                    ${showResult && option === question.count
                      ? 'bg-success-500 text-white shadow-lg animate-pulse-slow'
                      : showResult && option === selectedAnswer && option !== question.count
                      ? 'bg-error-500 text-white shadow-lg'
                      : showResult
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-br from-warning-100 to-warning-200 text-warning-700 hover:from-warning-200 hover:to-warning-300 shadow-md hover:shadow-lg focus:ring-warning-300'
                    }
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                >
                  {option}
                  
                  {/* Confetti inside correct answer button */}
    {showResult && option === question.count && !wrongAnswerSelected && (
      <div className="absolute inset-0 pointer-events-none z-10">
        <Confetti
          numberOfPieces={500}
          recycle={false}
          width={216}
          height={80}
        />
      </div>
    )}

    {!showResult && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></div>
    )}
                  
                </button>
              ))}
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className="text-center mt-8">
                <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium animate-bounce-slow ${
                  selectedAnswer === question.count
                    ? 'bg-success-100 text-success-700'
                    : 'bg-error-100 text-error-700'
                } ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  {selectedAnswer === question.count ? (
                    <>
                      <Award className="h-5 w-5" />
                      <span>{t('correct')}! {selectedAnswer}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      <span>{t('incorrect')} - {language === 'hi' ? 'सही उत्तर' : 'Correct answer'}: {question.count}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountingGame;