import React, { useEffect, useState } from "react";
import {
  Trophy,
  Target,
  Flame,
  BookOpen,
  Brain,
  Calculator,
  BookText,
  PenTool,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useVoice } from "../contexts/VoiceContext";
import { useUser } from "../contexts/UserContext";
import Header from "../components/Header";
import GameCard from "../components/GameCard";
import LevelCard from "../components/LevelCard";
import axiosInstance from "../config/axiosInstance";
import { userAPI, UserMatrix, QuizInfo } from "../services/apiService";

// Define the level interface based on API response
interface Level {
  _id: string;
  name: string;
  subtitle: string;
  lang: string;
  quizId: string | null;
  totalQuestions: number;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalGame: number;
  level: string;
}

interface Game {
  _id: string;
  name: string;
  subtitle: string;
  lang: string;
  quizId: string;
  level: string;
  totalQuestions: number;
  totalGame: number;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
  percentage: number;
  __v: number;
}

interface QuizResponse {
  success: boolean;
  message: string;
  data: {
    items: Level[];
    total: number;
    page: number;
    pages: number;
  };
}

interface GameResponse {
  success: boolean;
  message: string;
  data: Game[];
}

const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { user } = useUser();

  // User Matrix State
  const [userMatrixData, setUserMatrixData] = useState<UserMatrix | null>(null);
  const [matrixLoading, setMatrixLoading] = useState(true);
  const [matrixError, setMatrixError] = useState<string | null>(null);

  const [lastSpokenTime, setLastSpokenTime] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [showGames, setShowGames] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gamesError, setGamesError] = useState<string | null>(null);

  const [hasSpoken, setHasSpoken] = useState(false);

  // Fetch user matrix data
  useEffect(() => {
    const fetchUserMatrix = async () => {
      try {
        setMatrixLoading(true);
        setMatrixError(null);

        const response = await userAPI.getUserMatrix();

        if (response.success) {
          setUserMatrixData(response.data);
        } else {
          setMatrixError("Failed to fetch user matrix data");
        }
      } catch (err) {
        console.error("Error fetching user matrix:", err);
        setMatrixError("Failed to load user data. Please try again.");
      } finally {
        setMatrixLoading(false);
      }
    };

    fetchUserMatrix();
  }, [language]);

  // Reset to main dashboard when language changes
  useEffect(() => {
    // Reset game-related state when language changes
    setSelectedLevel(null);
    setShowGames(false);
    setGames([]);
    setGamesError(null);
    setUserMatrixData(null);
    setMatrixError(null);
  }, [language]);

  // Fetch levels from API
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get<QuizResponse>("/quizzes", {
          headers: {
            "Accept-Language": language === "hi" ? "hi" : "en",
          },
        });

        if (response.data.success) {
          setLevels(response.data.data.items);
        } else {
          setError("Failed to fetch levels");
        }
      } catch (err) {
        console.error("Error fetching levels:", err);
        setError("Failed to load levels. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [language]);

  // Fetch games when a level is selected
  useEffect(() => {
    const fetchGames = async () => {
      if (!selectedLevel) return;

      try {
        setGamesLoading(true);
        setGamesError(null);

        const response = await axiosInstance.get<GameResponse>(
          `/quizzes/quiz/${selectedLevel._id}`,
          {
            headers: {
              "Accept-Language": language === "hi" ? "hi" : "en",
            },
          }
        );

        if (response.data.success) {
          setGames(response.data.data);
        } else {
          setGamesError("Failed to fetch games");
        }
      } catch (err) {
        console.error("Error fetching games:", err);
        setGamesError("Failed to load games. Please try again.");
      } finally {
        setGamesLoading(false);
      }
    };

    fetchGames();
  }, [selectedLevel, language]);

  useEffect(() => {
    setHasSpoken(false); // Reset when language changes
  }, [language]);

  // useEffect(() => {
  //   const now = Date.now();
  //   const THIRTY_SECONDS = 30 * 1000;

  //   if (!lastSpokenTime || now - lastSpokenTime > THIRTY_SECONDS) {
  //     speak(t("dashboard"));
  //     setTimeout(() => {
  //       const welcome =
  //         language === "hi"
  //           ? `नमस्ते, ${user?.name}! आज कुछ नया सीखने के लिए तैयार हैं?`
  //           : `Welcome, ${user?.name}! Ready to learn something new today?`;
  //       speak(welcome);
  //     }, 1500); // 1.5 second pause between phrases
  //     setLastSpokenTime(now);
  //   }
  // }, [speak, t, language, user, lastSpokenTime]);

  useEffect(() => {
    if (!hasSpoken) {
      const welcome =
        language === "hi"
          ? `नमस्ते, ${user?.name}! आज कुछ नया सीखने के लिए तैयार हैं?`
          : `Welcome, ${user?.name}! Ready to learn something new today?`;
      speak(welcome, true);
      setHasSpoken(true);
    }
  }, [language, speak, user, hasSpoken]);

  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setShowGames(true);
  };

  const handleBackToLevels = () => {
    setShowGames(false);
    setSelectedLevel(null);
  };

  // Helper function to find quiz info by name
  const findQuizInfoByName = (quizName: string): QuizInfo | null => {
    if (!userMatrixData?.quizInfo) return null;

    return (
      userMatrixData.quizInfo.find(
        (quiz) =>
          quiz.quizName.toLowerCase().includes(quizName.toLowerCase()) ||
          quizName.toLowerCase().includes(quiz.quizName.toLowerCase())
      ) || null
    );
  };

  const achievements = [
    {
      icon: <Trophy className="h-8 w-8 text-warning-500" />,
      title: t("gamesCompleted"),
      value: userMatrixData?.totalCompletedQuiz || 0,
      color: "warning",
    },
    {
      icon: <Target className="h-8 w-8 text-success-500" />,
      title: t("totalScore"),
      value: userMatrixData?.totalScore || 0,
      color: "success",
    },
    {
      icon: <Flame className="h-8 w-8 text-error-500" />,
      title: t("streakDays"),
      value: user?.streak, // Not provided in API, keeping default
      color: "error",
    },
  ];

  return (
    <div className="min-h-screen mainHome__inner dashboard">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section - Only show when no level is selected */}
        {!showGames && (
          <div className="userSection blackBorder">
            <div className="userSection__left">
              <h1
                className={`
              text-4xl font-bold text-white mb-2
              ${language === "hi" ? "font-hindi" : "font-english"}
            `}
              >
                {language === "hi"
                  ? `नमस्ते, ${user?.name}!`
                  : `Welcome, ${user?.name}!`}
              </h1>
              <p
                className={`
              text-lg text-white
              ${language === "hi" ? "font-hindi" : "font-english"}
            `}
              >
                {language === "hi"
                  ? "आज कुछ नया सीखने के लिए तैयार हैं?"
                  : "Ready to learn something new today?"}
              </p>
            </div>
            <div className="userSection__right"></div>
          </div>
        )}

        {/* Dashboard Grid - Only show when no level is selected */}
        {!showGames && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Progress Section - Takes 2 columns */}
            <div className="lg:col-span-2 blackBorder">
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`
                    text-2xl font-bold text-gray-800
                    ${language === "hi" ? "font-hindi" : "font-english"}
                  `}
                  >
                    {t("progress")}
                  </h2>
                </div>

                {matrixLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    <span
                      className={`ml-3 ${
                        language === "hi" ? "font-hindi" : "font-english"
                      }`}
                    >
                      {language === "hi" ? "लोड हो रहा है..." : "Loading..."}
                    </span>
                  </div>
                ) : matrixError ? (
                  <div className="text-center py-8">
                    <p
                      className={`text-red-500 ${
                        language === "hi" ? "font-hindi" : "font-english"
                      }`}
                    >
                      {matrixError}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userMatrixData?.quizInfo &&
                    userMatrixData.quizInfo.length > 0 ? (
                      userMatrixData.quizInfo.map((quiz, index) => {
                        // Determine icon based on quiz name
                        const getQuizIcon = (quizName: string) => {
                          const nameLower = quizName.toLowerCase();
                          if (
                            nameLower.includes("अक्षर") ||
                            nameLower.includes("letter") ||
                            nameLower.includes("ध्वनि") ||
                            nameLower.includes("sound") ||
                            nameLower.includes("मिलान")
                          ) {
                            return <Brain className="h-8 w-8" />;
                          } else if (
                            nameLower.includes("count") ||
                            nameLower.includes("गिनती") ||
                            nameLower.includes("object") ||
                            nameLower.includes("वस्तु")
                          ) {
                            return <Calculator className="h-8 w-8" />;
                          } else {
                            return <BookOpen className="h-8 w-8" />;
                          }
                        };

                        return (
                          <div
                            key={quiz.quizId}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-white rounded-xl shadow-sm">
                                {getQuizIcon(quiz.quizName)}
                              </div>
                              <div>
                                <h3
                                  className={`
                              font-semibold text-gray-800
                              ${
                                language === "hi"
                                  ? "font-hindi"
                                  : "font-english"
                              }
                            `}
                                >
                                  {quiz.quizName}
                                </h3>
                                <p
                                  className={`
                              text-sm text-gray-600
                              ${
                                language === "hi"
                                  ? "font-hindi"
                                  : "font-english"
                              }
                            `}
                                >
                                  {language === "hi"
                                    ? `स्तर: ${quiz.level} • स्कोर: ${quiz.score}`
                                    : `Level: ${quiz.level} • Score: ${quiz.score}`}
                                </p>
                              </div>
                            </div>
                            <div className="w-20">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-success-400 to-success-500 h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min(
                                      quiz.percentage > 100
                                        ? 100
                                        : quiz.percentage,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 text-center mt-1">
                                {Math.min(
                                  quiz.percentage > 100 ? 100 : quiz.percentage,
                                  100
                                )}
                                %
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p
                          className={`text-gray-500 ${
                            language === "hi" ? "font-hindi" : "font-english"
                          }`}
                        >
                          {language === "hi"
                            ? "कोई प्रगति डेटा उपलब्ध नहीं है"
                            : "No progress data available"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Achievements Section - Takes 1 column */}
            <div className="lg:col-span-1 blackBorder">
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2
                  className={`
                  text-2xl font-bold text-gray-800 mb-6 text-center
                  ${language === "hi" ? "font-hindi" : "font-english"}
                `}
                >
                  {t("yourAchievements")}
                </h2>

                {matrixLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          {achievement.icon}
                          <span
                            className={`
                            text-sm font-medium text-gray-700
                            ${language === "hi" ? "font-hindi" : "font-english"}
                          `}
                          >
                            {achievement.title}
                          </span>
                        </div>
                        <span
                          className={`
                          text-2xl font-bold
                          ${
                            achievement.color === "warning"
                              ? "text-warning-600"
                              : ""
                          }
                          ${
                            achievement.color === "success"
                              ? "text-success-600"
                              : ""
                          }
                          ${
                            achievement.color === "error"
                              ? "text-error-600"
                              : ""
                          }
                        `}
                        >
                          {achievement.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Level Selection or Games Section */}
        {!showGames ? (
          /* Level Selection Section */
          <div className="mb-8 relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none rounded-3xl">
              <div className="grid grid-cols-8 gap-4 text-4xl text-gray-400 p-8">
                {["अ", "आ", "इ", "ओ", "उ", "ए", "ऐ", "औ"].map((char, index) => (
                  <div key={index} className="text-center">
                    {char}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10">
              <h2
                className={`
                text-3xl font-bold text-center text-gray-800 mb-2
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
              >
                {language === "hi" ? "शिक्षा के खेल" : "Education Games"}
              </h2>
              <p
                className={`
                text-lg text-center text-gray-600 mb-8
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
              >
                {language === "hi"
                  ? "खेलना शुरू करने के लिए स्तर चुनें"
                  : "Choose a level to start playing"}
              </p>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  <span
                    className={`ml-3 text-lg ${
                      language === "hi" ? "font-hindi" : "font-english"
                    }`}
                  >
                    {language === "hi"
                      ? "स्तर लोड हो रहे हैं..."
                      : "Loading levels..."}
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p
                    className={`text-red-500 text-lg ${
                      language === "hi" ? "font-hindi" : "font-english"
                    }`}
                  >
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className={`mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors ${
                      language === "hi" ? "font-hindi" : "font-english"
                    }`}
                  >
                    {language === "hi" ? "पुनः प्रयास करें" : "Try Again"}
                  </button>
                </div>
              ) : levels.length === 0 ? (
                <div className="text-center py-12">
                  <p
                    className={`text-gray-500 text-lg ${
                      language === "hi" ? "font-hindi" : "font-english"
                    }`}
                  >
                    {language === "hi"
                      ? "कोई स्तर उपलब्ध नहीं है"
                      : "No levels available"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {levels.map((level, index) => (
                    <LevelCard
                      key={level._id}
                      level={level.level}
                      title={level.name}
                      subtitle={level.subtitle}
                      gamesCount={level.totalGame}
                      starsCount={level.maxScore}
                      isAvailable={true} // Assuming all levels are available for now
                      isSelected={selectedLevel?._id === level._id}
                      onSelect={() => handleLevelSelect(level)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Games Section */
          <div className="mb-8">
            <div className="gameListHead"> 
              {/* Level Info */}
              <div className=" mb-8">
                <h2
                  className={`
                text-3xl font-bold text-gray-800 mb-2
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
                >
                  {selectedLevel?.name}
                </h2>
                <p
                  className={`
                text-lg text-gray-600
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
                >
                  {selectedLevel?.subtitle}
                </p>
              </div>

              {/* Back Button */}
              <div className="flex justify-start mb-6">
                <button
                  onClick={handleBackToLevels}
                  className={`
                  flex items-center space-x-2 px-4 py-2 bg-white hover:bg-white-200 text-black-700 rounded-lg transition-colors duration-200 backButton
                  ${language === "hi" ? "font-hindi" : "font-english"}
                `}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>
                    {language === "hi" ? "स्तर चुनें" : "Choose Level"}
                  </span>
                </button>
              </div>
            </div>
            {/* Games Grid */}
            {gamesLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <span
                  className={`ml-3 text-lg ${
                    language === "hi" ? "font-hindi" : "font-english"
                  }`}
                >
                  {language === "hi"
                    ? "खेल लोड हो रहे हैं..."
                    : "Loading games..."}
                </span>
              </div>
            ) : gamesError ? (
              <div className="text-center py-12">
                <p
                  className={`text-red-500 text-lg ${
                    language === "hi" ? "font-hindi" : "font-english"
                  }`}
                >
                  {gamesError}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className={`mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors ${
                    language === "hi" ? "font-hindi" : "font-english"
                  }`}
                >
                  {language === "hi" ? "पुनः प्रयास करें" : "Try Again"}
                </button>
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-12">
                <p
                  className={`text-gray-500 text-lg ${
                    language === "hi" ? "font-hindi" : "font-english"
                  }`}
                >
                  {language === "hi"
                    ? "कोई खेल उपलब्ध नहीं है"
                    : "No games available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {games.map((game) => {
                  // Find quiz info from user matrix data for this specific game
                  const quizInfo = findQuizInfoByName(game.name);

                  // Map game name to appropriate icon and path
                  const getGameConfig = (gameName: string) => {
                    const nameLower = gameName.toLowerCase();
                    if (
                      nameLower.includes("अक्षर") ||
                      nameLower.includes("letter") ||
                      nameLower.includes("ध्वनि") ||
                      nameLower.includes("sound") ||
                      nameLower.includes("मिलान")
                    ) {
                      return {
                        icon: <Brain className="h-8 w-8" />,
                        path: "/games/phonics",
                      };
                    } else if (
                      nameLower.includes("वस्तु") ||
                      nameLower.includes("गिनना") ||
                      nameLower.includes("count") ||
                      nameLower.includes("object") ||
                      nameLower.includes("गिनती")
                    ) {
                      return {
                        icon: <Calculator className="h-8 w-8" />,
                        path: "/games/counting",
                      };
                    } else {
                      return {
                        icon: <BookOpen className="h-8 w-8" />,
                        path: "/games/generic",
                      };
                    }
                  };

                  const gameConfig = getGameConfig(game.name);

                  return (
                    <GameCard
                      key={game._id}
                      title={game.name}
                      description={game.subtitle}
                      icon={gameConfig.icon}
                      path={gameConfig.path}
                      isAvailable={true}
                      level={game.level || quizInfo?.level}
                      score={game.maxScore || quizInfo?.score}
                      progress={game?.percentage || 0}
                      quizId={game._id}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Motivational Section */}
        <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-success-500 rounded-3xl p-8 text-center text-white shadow-2xl">
          <h3
            className={`
            text-2xl font-bold mb-4
            ${language === "hi" ? "font-hindi" : "font-english"}
          `}
          >
            {language === "hi"
              ? "आपकी यात्रा जारी है!"
              : "Your Learning Journey Continues!"}
          </h3>
          <p
            className={`
            text-lg opacity-90
            ${language === "hi" ? "font-hindi" : "font-english"}
          `}
          >
            {language === "hi"
              ? "हर दिन कुछ नया सीखें और अपने सपनों को साकार करें।"
              : "Learn something new every day and achieve your dreams."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
