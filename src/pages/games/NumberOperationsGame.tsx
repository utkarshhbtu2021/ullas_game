import React, { useEffect, useState } from "react";
import { ArrowLeft, Award, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useVoice } from "../../contexts/VoiceContext";
import { useUser } from "../../contexts/UserContext";
import Header from "../../components/Header";
import Confetti from "react-confetti";

interface OperationQuestion {
  problem: string;
  options: number[];
  answer: number;
}

const NumberOperationsGame: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { progress, updateProgress } = useUser();

  const currentLevel = progress.numberOps?.level || 1;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswerSelected, setWrongAnswerSelected] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const questions: OperationQuestion[] = [
    { problem: "2 + 3 = ?", options: [4, 5, 6, 7], answer: 5 },
    { problem: "7 – 4 = ?", options: [2, 1, 5, 3], answer: 3 },
    { problem: "4 × 2 = ?", options: [6, 9, 8, 1], answer: 8 },
    { problem: "9 – 3 = ?", options: [6, 2, 7, 5], answer: 6 },
    { problem: "6 + 2 = ?", options: [7, 8, 9, 3], answer: 8 },
  ];

  useEffect(() => {
    speak(language === "hi" ? "सही उत्तर चुनें" : "Choose the correct answer");
    // speak first question
    setTimeout(() => speakCurrentQuestion(), 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentQuestion > 0 && !showResult) speakCurrentQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const speakCurrentQuestion = () => {
    const q = questions[currentQuestion];
    speak(language === "hi" ? `हल करें: ${q.problem}` : `Solve: ${q.problem}`);
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].answer;

    if (isCorrect) {
      setScore(score + 10);
      speak(language === "hi" ? "सही जवाब है!" : "Correct!");
    } else {
      setWrongAnswerSelected(true);
      speak(
        language === "hi"
          ? `गलत जवाब है! सही जवाब है ${questions[currentQuestion].answer}`
          : `Wrong! Correct answer is ${questions[currentQuestion].answer}`
      );
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setWrongAnswerSelected(false);
      } else {
        completeGame();
      }
    }, 3000);
  };

  const completeGame = () => {
    const finalScore =
      score + (selectedAnswer === questions[currentQuestion].answer ? 10 : 0);
    const newLevel = Math.min(currentLevel + 1, 5);
    const completed = newLevel >= 5;

    updateProgress("numberOps", {
      level: newLevel,
      score: Math.max(progress.numberOps?.score || 0, finalScore),
      completed,
    });

    setGameCompleted(true);
    speak(`${t("wellDone")}! ${t("score")}: ${finalScore}`);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setWrongAnswerSelected(false);
    setGameCompleted(false);
    setTimeout(() => speakCurrentQuestion(), 800);
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
            <h2
              className={`text-3xl font-bold text-gray-800 mb-4 ${
                language === "hi" ? "font-hindi" : "font-english"
              }`}
            >
              {t("wellDone")}
            </h2>
            <p
              className={`text-lg text-gray-600 mb-6 ${
                language === "hi" ? "font-hindi" : "font-english"
              }`}
            >
              {t("score")}: {score}
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={restartGame}
                className={`px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200 ${
                  language === "hi" ? "font-hindi" : "font-english"
                }`}
              >
                {t("tryAgain")}
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className={`px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 ${
                  language === "hi" ? "font-hindi" : "font-english"
                }`}
              >
                {t("backToDashboard")}
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
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <span
              className={`text-gray-600 font-medium ${
                language === "hi" ? "font-hindi" : "font-english"
              }`}
            >
              {t("backToDashboard")}
            </span>
          </button>

          <div className="flex items-center space-x-4">
            <div
              className={`px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium ${
                language === "hi" ? "font-hindi" : "font-english"
              }`}
            >
              {t("level")} {currentLevel}
            </div>
            <div
              className={`px-4 py-2 bg-success-100 text-success-700 rounded-full font-medium ${
                language === "hi" ? "font-hindi" : "font-english"
              }`}
            >
              {t("score")}: {score}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-sm text-gray-600 ${
                language === "hi" ? "font-hindi" : "font-english"
              }`}
            >
              {language === "hi" ? "प्रगति" : "Progress"}
            </span>
            <span
              className={`text-sm text-gray-600 ${
                language === "hi" ? "font-hindi" : "font-english"
              }`}
            >
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-warning-500 to-success-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Game Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Question */}
            <div className="text-center mb-8">
              <h2
                className={`text-2xl font-bold text-gray-800 mb-6 ${
                  language === "hi" ? "font-hindi" : "font-english"
                }`}
              >
                {question.problem}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`
                    p-6 rounded-2xl font-bold text-3xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 relative overflow-hidden
                    ${
                      showResult && option === question.answer
                        ? "bg-success-500 text-white shadow-lg animate-pulse-slow"
                        : showResult &&
                          option === selectedAnswer &&
                          option !== question.answer
                        ? "bg-error-500 text-white shadow-lg"
                        : showResult
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-br from-warning-100 to-warning-200 text-warning-700 hover:from-warning-200 hover:to-warning-300 shadow-md hover:shadow-lg focus:ring-warning-300"
                    }
                    ${language === "hi" ? "font-hindi" : "font-english"}
                  `}
                >
                  {option}

                  {/* Confetti on correct answer */}
                  {showResult &&
                    option === question.answer &&
                    !wrongAnswerSelected && (
                      <div className="absolute inset-0 pointer-events-none z-10">
                        <Confetti
                          numberOfPieces={300}
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
                <div
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium animate-bounce-slow ${
                    selectedAnswer === question.answer
                      ? "bg-success-100 text-success-700"
                      : "bg-error-100 text-error-700"
                  } ${language === "hi" ? "font-hindi" : "font-english"}`}
                >
                  {selectedAnswer === question.answer ? (
                    <>
                      <Award className="h-5 w-5" />
                      <span>{t("correct")}!</span>
                      {/* <span>{t("correct")}! {question.answer}</span> */}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      <span>
                        {t("incorrect")} —{" "}
                        {language === "hi" ? "सही जवाब है!" : "Correct"}:{" "}
                        {question.answer}
                      </span>
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

export default NumberOperationsGame;
