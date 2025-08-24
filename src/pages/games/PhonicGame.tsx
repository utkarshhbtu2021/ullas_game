import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, RefreshCw, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import Header from '../../components/Header';
import Confetti from 'react-confetti';

interface PhonicQuestion {
  letter: string;
  sound: string;
  word: string;
  image: string;
  options: string[];
  correctAnswer: string;
}

const PhonicGame: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { progress, updateProgress } = useUser();

  const [currentLevel, setCurrentLevel] = useState(progress.phonics.level);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const questions: PhonicQuestion[] = [
    {
      letter: 'A',
      sound: 'अ',
      word: language === 'hi' ? 'सेब' : 'Apple',
      image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400',
      options: language === 'hi' ? ['आ', 'से', 'इ', 'ए'] : ['A', 'B', 'C', 'D'],
      correctAnswer: language === 'hi' ? 'से' : 'A'
    },
    {
      letter: 'B',
      sound: 'ब',
      word: language === 'hi' ? 'गेंद' : 'Ball',
      image: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=400',
      options: language === 'hi' ? ['प', 'गें', 'म', 'व'] : ['A', 'B', 'C', 'D'],
      correctAnswer: language === 'hi' ? 'गें' : 'B'
    },
    {
      letter: 'C',
      sound: 'क',
      word: language === 'hi' ? 'कार' : 'Car',
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
      options: language === 'hi' ? ['क', 'ख', 'ग', 'च'] : ['A', 'B', 'C', 'D'],
      correctAnswer: language === 'hi' ? 'क' : 'C'
    },
    {
      letter: 'D',
      sound: 'द',
      word: language === 'hi' ? 'दरवाजा' : 'Door',
      image: 'https://images.pexels.com/photos/277552/pexels-photo-277552.jpeg?auto=compress&cs=tinysrgb&w400',
      options: language === 'hi' ? ['द', 'ध', 'त', 'थ'] : ['A', 'B', 'C', 'D'],
      correctAnswer: language === 'hi' ? 'द' : 'D'
    },
    {
      letter: 'E',
      sound: 'ए',
      word: language === 'hi' ? 'हाथी' : 'Elephant',
      image: 'https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=400',
      options: language === 'hi' ? ['ए', 'ऐ', 'आ', 'हा'] : ['A', 'B', 'C', 'E'],
      correctAnswer: language === 'hi' ? 'हा' : 'E'
    }
  ];

  useEffect(() => {
    speak(`${t('phonicsGame')}. ${t('instructions')}: ${t('selectCorrectAnswer')}`);
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
    const question = questions[currentQuestion];
    const instruction = language === 'hi' 
      ? `${question.word} का पहला अक्षर चुनें`
      : `Select the first letter of ${question.word}`;
    speak(instruction);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 10);
      speak(t('correct'));
    } else {
      speak(t('incorrect'));
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
    }, 2000);
  };

  const completeGame = () => {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 10 : 0);
    const newLevel = Math.min(currentLevel + 1, 5);
    const completed = newLevel >= 5;
    
    updateProgress('phonics', {
      level: newLevel,
      score: Math.max(progress.phonics.score, finalScore),
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
              className="bg-gradient-to-r from-primary-500 to-success-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Game Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Question */}
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                {language === 'hi' ? `इस शब्द का पहला अक्षर चुनें:` : 'Select the first letter of this word:'}
              </h2>
              
              {/* Image */}
              <div className="mb-6">
                <img 
                  src={question.image} 
                  alt={question.word}
                  className="w-48 h-48 object-cover rounded-2xl mx-auto shadow-lg"
                />
              </div>
              
              {/* Word with Sound Button */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <h3 className={`text-4xl font-bold text-primary-600 ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  {question.word}
                </h3>
                <button
                  onClick={() => speak(question.word)}
                  className="p-3 bg-secondary-100 hover:bg-secondary-200 rounded-full transition-colors duration-200"
                  title={t('tapToHear')}
                >
                  <Volume2 className="h-6 w-6 text-secondary-600" />
                </button>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`
                    p-6 rounded-2xl font-bold text-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4
                    ${showResult && option === question.correctAnswer
                      ? 'bg-success-500 text-white shadow-lg'
                      : showResult && option === selectedAnswer && option !== question.correctAnswer
                      ? 'bg-error-500 text-white shadow-lg'
                      : showResult
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 hover:from-primary-200 hover:to-primary-300 shadow-md hover:shadow-lg focus:ring-primary-300'
                    }
                    ${language === 'hi' ? 'font-hindi' : 'font-english'}
                  `}
                >
                  {option}
                  {showResult && option === question.correctAnswer && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <Confetti
            numberOfPieces={300}
            recycle={false}
            width={216}
            height={80}
          />
        </div>
      )}
                </button>
              ))}
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className="text-center mt-8">
                <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium ${
                  selectedAnswer === question.correctAnswer
                    ? 'bg-success-100 text-success-700'
                    : 'bg-error-100 text-error-700'
                } ${language === 'hi' ? 'font-hindi' : 'font-english'}`}>
                  {selectedAnswer === question.correctAnswer ? (
                    <>
                      <Award className="h-5 w-5" />
                      <span>{t('correct')}!</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      <span>{t('incorrect')}</span>
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

export default PhonicGame;