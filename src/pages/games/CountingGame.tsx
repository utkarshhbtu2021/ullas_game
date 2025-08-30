import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, RefreshCw, Award } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useVoice } from '../../contexts/VoiceContext';
import { useUser } from '../../contexts/UserContext';
import Header from '../../components/Header';
import Confetti from 'react-confetti';
import { quizAPI } from '../../services/apiService';

interface CountingQuestion {
  items: string[];
  count: number;
  options: number[];
}

interface ApiQuestion {
  _id: string;
  quizId: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  type: string;
  level: string;
  lang: string;
}

interface QuizAttemptData {
  quizId: string;
  quizSet: string;
  answers: Array<{
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
    timeTakenSec: number;
  }>;
  score: number;
  totalQuestions: number;
  skippedCount: number;
  correctCount: number;
  incorrectCount: number;
  timeTakenSec: number;
  isCompleted: boolean;
}

const CountingGame: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t, setOnLanguageChange } = useLanguage();
  const { speak } = useVoice();
  const { progress, updateProgress } = useUser();

  // Ref to track if initial speech has been spoken
  const hasSpokenInitial = useRef(false);
  const hasSpokenCurrentQuestion = useRef<number>(-1);

  // Get quizId from location state
  const quizId = location.state?.quizId;

  const [currentLevel, setCurrentLevel] = useState(progress.counting.level);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [wrongAnswerSelected, setWrongAnswerSelected] = useState(false);
  const [questions, setQuestions] = useState<CountingQuestion[]>([]);
  const [apiQuestions, setApiQuestions] = useState<ApiQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentApiLevel, setCurrentApiLevel] = useState<string>('');

  // Set up language change callback to redirect to dashboard
  useEffect(() => {
    if (setOnLanguageChange) {
      setOnLanguageChange(() => (newLang: string) => {
        navigate('/dashboard');
      });
    }

    // Cleanup function to remove the callback when component unmounts
    return () => {
      if (setOnLanguageChange) {
        setOnLanguageChange(undefined);
      }
    };
  }, [navigate, setOnLanguageChange]);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!quizId) {
        setError(t('quiz') + ' ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await quizAPI.getQuestionsByQuizId(quizId);
        
        if (response.success && response.data) {
          setApiQuestions(response.data);
          
          // Set the level from the first question
          if (response.data.length > 0) {
            setCurrentApiLevel(response.data[0].level);
          }
          
          // Transform API questions to CountingQuestion format
          const transformedQuestions: CountingQuestion[] = response.data.map((apiQuestion: ApiQuestion) => {
            // Extract emojis from text and create items array
            const emojis = [...apiQuestion.text];
            const uniqueEmojis = [...new Set(emojis)];
            const items = Array.from({ length: emojis.length }, () => uniqueEmojis[0]);
            
            // Convert options object to number array
            const optionsArray = Object.values(apiQuestion.options).map(option => {
              // Convert Devanagari numerals to Arabic numerals
              const devanagariToArabic: { [key: string]: number } = {
                '०': 0, '१': 1, '२': 2, '३': 3, '४': 4, '५': 5, 
                '६': 6, '७': 7, '८': 8, '९': 9, '१०': 10, '११': 11
              };
              return devanagariToArabic[option] || parseInt(option) || 0;
            });
            
            return {
              items: items,
              count: emojis.length,
              options: optionsArray
            };
          });
          
          setQuestions(transformedQuestions);
        } else {
          setError(t('incorrect'));
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(t('incorrect') + '. ' + t('tryAgain'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId, t]);

  // Initial speech when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !hasSpokenInitial.current) {
      hasSpokenInitial.current = true;
      speak(`${t('countingGame')}. ${t('instructions')}: ${t('selectCorrectAnswer')}`);
      // Speak current question after a short delay
      setTimeout(() => {
        speakCurrentQuestion();
      }, 2000);
    }
  }, [questions, t, speak]);

  // Speak question when currentQuestion changes (but not on initial load)
  useEffect(() => {
    if (hasSpokenCurrentQuestion.current !== currentQuestion && 
        hasSpokenInitial.current && 
        !showResult && 
        questions.length > 0 && 
        currentQuestion > 0) {
      speakCurrentQuestion();
    }
  }, [currentQuestion, questions, showResult]);

  const speakCurrentQuestion = () => {
    if (questions.length === 0) return;
    
    // Update the ref to track which question we've spoken
    hasSpokenCurrentQuestion.current = currentQuestion;
    
    const instruction = t('selectCorrectAnswer');
    speak(instruction);
  };

  const submitQuizAttempt = async (selectedOption: number, isCorrect: boolean) => {
    if (!quizId || apiQuestions.length === 0) return;

    const currentApiQuestion = apiQuestions[currentQuestion];
    const isLastQuestion = currentQuestion === questions.length - 1;

    // Find the option key (A, B, C, D) for the selected value
    const selectedOptionKey = Object.keys(currentApiQuestion.options).find(
      key => {
        const devanagariToArabic: { [key: string]: number } = {
          '०': 0, '१': 1, '२': 2, '३': 3, '४': 4, '५': 5, 
          '६': 6, '७': 7, '८': 8, '९': 9, '१०': 10, '११': 11
        };
        const optionValue = currentApiQuestion.options[key as keyof typeof currentApiQuestion.options];
        return (devanagariToArabic[optionValue] || parseInt(optionValue)) === selectedOption;
      }
    );

    const attemptData: QuizAttemptData = {
      quizId: quizId,
      quizSet: currentApiQuestion.type,
      answers: [
        {
          questionId: currentApiQuestion._id,
          selectedOption: selectedOptionKey || "A",
          isCorrect: isCorrect,
          timeTakenSec: 0
        }
      ],
      score: score + (isCorrect ? 10 : 0),
      totalQuestions: questions.length,
      skippedCount: 0,
      correctCount: correctCount + (isCorrect ? 1 : 0),
      incorrectCount: incorrectCount + (isCorrect ? 0 : 1),
      timeTakenSec: 0,
      isCompleted: isLastQuestion
    };

    try {
      await quizAPI.submitQuizAttempt(attemptData);
      console.log('Quiz attempt submitted successfully');
    } catch (err) {
      console.error('Error submitting quiz attempt:', err);
    }
  };

  const handleAnswerSelect = async (answer: number) => {
    if (questions.length === 0) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].count;
    
    if (isCorrect) {
      setScore(score + 10);
      setCorrectCount(correctCount + 1);
      speak(`${t('correct')}! ${answer}`);
    } else {
      setIncorrectCount(incorrectCount + 1);
      speak(`${t('incorrect')} ${t('correct')} ${questions[currentQuestion].count}`);
      setWrongAnswerSelected(true);
    }
    
    setShowResult(true);
    
    // Submit quiz attempt
    await submitQuizAttempt(answer, isCorrect);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setWrongAnswerSelected(false);
        // The next question will be spoken by the useEffect hook automatically
      } else {
        completeGame();
      }
    }, 2000);
  };

  const completeGame = () => {
    if (questions.length === 0) return;
    
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
    setCorrectCount(0);
    setIncorrectCount(0);
    
    // Reset speech tracking refs
    hasSpokenInitial.current = false;
    hasSpokenCurrentQuestion.current = -1;
    
    // Speak initial instructions after restart
    setTimeout(() => {
      hasSpokenInitial.current = true;
      speak(`${t('countingGame')}. ${t('instructions')}: ${t('selectCorrectAnswer')}`);
      setTimeout(() => {
        speakCurrentQuestion();
      }, 2000);
    }, 1000);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen mainHome__inner dashboard">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className={`text-lg ${language === "hi" ? "font-hindi" : "font-english"}`}>
              {language === "hi" ? "प्रश्न लोड हो रहे हैं..." : "Loading questions..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen mainHome__inner dashboard">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-red-500 text-lg mb-4 ${language === "hi" ? "font-hindi" : "font-english"}`}>
              {error}
            </p>
            <button 
              onClick={() => navigate("/dashboard")}
              className={`px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors ${language === "hi" ? "font-hindi" : "font-english"}`}
            >
              {t('backToDashboard')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no questions
  if (questions.length === 0) {
    return (
      <div className="min-h-screen mainHome__inner dashboard">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-gray-500 text-lg mb-4 ${language === "hi" ? "font-hindi" : "font-english"}`}>
              {language === "hi" ? "कोई प्रश्न उपलब्ध नहीं है" : "No questions available"}
            </p>
            <button 
              onClick={() => navigate("/dashboard")}
              className={`px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors ${language === "hi" ? "font-hindi" : "font-english"}`}
            >
              {t('backToDashboard')}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              {t('level')}: {t(currentApiLevel)}
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
              {t('progress')}
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
                      <span>{t('incorrect')} - {t('correct')}: {question.count}</span>
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