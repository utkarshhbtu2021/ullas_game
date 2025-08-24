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

const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { user, progress, stats } = useUser();
  const [currentStats, setCurrentStats] = useState(stats);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [lastSpokenTime, setLastSpokenTime] = useState<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    const THIRTY_SECONDS = 30 * 1000;

    if (!lastSpokenTime || now - lastSpokenTime > THIRTY_SECONDS) {
      speak(t("dashboard"));
      setTimeout(() => {
        const welcome =
          language === "hi"
            ? `नमस्ते, ${user?.name}! आज कुछ नया सीखने के लिए तैयार हैं?`
            : `Welcome, ${user?.name}! Ready to learn something new today?`;
        speak(welcome);
      }, 1500); // 1.5 second pause between phrases
      setLastSpokenTime(now);
    }
  }, [speak, t, language, user, lastSpokenTime]);

  // Listen for real-time updates
  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      setCurrentStats(event.detail.stats);
      setCurrentProgress(event.detail.progress);
    };

    window.addEventListener(
      "userProgressUpdate",
      handleProgressUpdate as EventListener
    );
    return () =>
      window.removeEventListener(
        "userProgressUpdate",
        handleProgressUpdate as EventListener
      );
  }, []);

  // Update local state when context changes
  useEffect(() => {
    setCurrentStats(stats);
    setCurrentProgress(progress);
  }, [stats, progress]);

  const games = [
    {
      title: t("phonicsGame"),
      description:
        language === "hi"
          ? "अक्षरों और ध्वनियों को सीखें"
          : "Learn letters and sounds",
      icon: <Brain className="h-8 w-8" />,
      path: "/games/phonics",
      isAvailable: true,
      level: currentProgress.phonics.level,
      score: currentProgress.phonics.score,
      progress: currentProgress.phonics.completed
        ? 100
        : (currentProgress.phonics.level - 1) * 20,
    },
    {
      title: t("imageWordGame"),
      description:
        language === "hi"
          ? "चित्रों को शब्दों से मिलाएं"
          : "Match pictures with words",
      icon: <BookOpen className="h-8 w-8" />,
      path: "/games/image-word",
      isAvailable: true,
      level: currentProgress.imageWord.level,
      score: currentProgress.imageWord.score,
      progress: currentProgress.imageWord.completed
        ? 100
        : (currentProgress.imageWord.level - 1) * 20,
    },
    {
      title: t("countingGame"),
      description:
        language === "hi"
          ? "संख्याओं को गिनना सीखें"
          : "Learn to count numbers",
      icon: <Calculator className="h-8 w-8" />,
      path: "/games/counting",
      isAvailable: true,
      level: currentProgress.counting.level,
      score: currentProgress.counting.score,
      progress: currentProgress.counting.completed
        ? 100
        : (currentProgress.counting.level - 1) * 20,
    },
    {
      title: t("readingGame"),
      description:
        language === "hi"
          ? "वाक्य और कहानियां पढ़ें"
          : "Read sentences and stories",
      icon: <BookText className="h-8 w-8" />,
      path: "/games/reading",
      isAvailable: false,
      level: currentProgress.reading.level,
      score: currentProgress.reading.score,
      progress: 0,
    },
    {
      title: t("writingGame"),
      description:
        language === "hi"
          ? "अक्षर और शब्द लिखना सीखें"
          : "Learn to write letters and words",
      icon: <PenTool className="h-8 w-8" />,
      path: "/games/writing",
      isAvailable: false,
      level: currentProgress.writing.level,
      score: currentProgress.writing.score,
      progress: 0,
    },
  ];

  const achievements = [
    {
      icon: <Trophy className="h-8 w-8 text-warning-500" />,
      title: t("gamesCompleted"),
      value: currentStats.gamesCompleted,
      color: "warning",
    },
    {
      icon: <Target className="h-8 w-8 text-success-500" />,
      title: t("totalScore"),
      value: currentStats.totalScore,
      color: "success",
    },
    {
      icon: <Flame className="h-8 w-8 text-error-500" />,
      title: t("streakDays"),
      value: currentStats.streakDays,
      color: "error",
    },
  ];

  return (
    <div className="min-h-screen mainHome__inner dashboard">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
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

        {/* Dashboard Grid */}
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
                {/* <button
                  className={`
                  px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors duration-200
                  ${language === "hi" ? "font-hindi" : "font-english"}
                `}
                >
                  {t("viewDetails")}
                </button> */}
              </div>

              <div className="space-y-4">
                {games
                  .filter((game) => game.isAvailable)
                  .map((game, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          {game.icon}
                        </div>
                        <div>
                          <h3
                            className={`
                          font-semibold text-gray-800
                          ${language === "hi" ? "font-hindi" : "font-english"}
                        `}
                          >
                            {game.title}
                          </h3>
                          <p
                            className={`
                          text-sm text-gray-600
                          ${language === "hi" ? "font-hindi" : "font-english"}
                        `}
                          >
                            {language === "hi"
                              ? `स्तर ${game.level} • स्कोर ${game.score}`
                              : `Level ${game.level} • Score ${game.score}`}
                          </p>
                        </div>
                      </div>
                      <div className="w-20">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-success-400 to-success-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(game.progress, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {Math.round(game.progress)}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
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
                      ${achievement.color === "error" ? "text-error-600" : ""}
                    `}
                    >
                      {achievement.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Games Section */}
        <div className="mb-8">
          <h2
            className={`
            text-3xl font-bold text-center text-gray-800 mb-8
            ${language === "hi" ? "font-hindi" : "font-english"}
          `}
          >
            {t("games")}
          </h2>

          {/* First Row - Main Games */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {games.slice(0, 3).map((game, index) => (
              <GameCard key={index} {...game} />
            ))}
          </div>

          {/* Second Row - Coming Soon Games */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.slice(3).map((game, index) => (
              <GameCard key={index + 3} {...game} />
            ))}
          </div>
        </div>

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
