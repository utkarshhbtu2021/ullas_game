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

const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { speak } = useVoice();
  const { user, progress, stats } = useUser();
  const [currentStats, setCurrentStats] = useState(stats);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [lastSpokenTime, setLastSpokenTime] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'medium' | 'advanced' | null>(null);
  const [showGames, setShowGames] = useState(false);

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

  const levels = [
    {
      level: 'beginner' as const,
      title: language === "hi" ? "शुरुआती स्तर" : "Beginner Level",
      subtitle: language === "hi" ? "पहचान और पहचान" : "Recognition & Identification",
      gamesCount: 2,
      starsCount: 20,
      isAvailable: true,
    },
    {
      level: 'medium' as const,
      title: language === "hi" ? "मध्यम स्तर" : "Intermediate Level",
      subtitle: language === "hi" ? "समझ और निर्माण" : "Comprehension & Construction",
      gamesCount: 3,
      starsCount: 20,
      isAvailable: false, // Only beginner level is available for now
    },
    {
      level: 'advanced' as const,
      title: language === "hi" ? "उन्नत स्तर" : "Advanced Level",
      subtitle: language === "hi" ? "दैनिक जीवन में आवेदन" : "Application in Daily Life",
      gamesCount: 3,
      starsCount: 20,
      isAvailable: false, // Only beginner level is available for now
    },
  ];

  const handleLevelSelect = (level: 'beginner' | 'medium' | 'advanced') => {
    setSelectedLevel(level);
    // For now, only beginner level shows games
    if (level === 'beginner') {
      setShowGames(true);
    }
  };

  const handleBackToLevels = () => {
    setShowGames(false);
    setSelectedLevel(null);
  };

  const games = [
    {
      title: t("Letter–Sound Match"),
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
      title: t("Counting Objects"),
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
    // {
    //   title: t("imageWordGame"),
    //   description:
    //     language === "hi"
    //       ? "चित्रों को शब्दों से मिलाएं"
    //       : "Match pictures with words",
    //   icon: <BookOpen className="h-8 w-8" />,
    //   path: "/games/image-word",
    //   isAvailable: true,
    //   level: currentProgress.imageWord.level,
    //   score: currentProgress.imageWord.score,
    //   progress: currentProgress.imageWord.completed
    //     ? 100
    //     : (currentProgress.imageWord.level - 1) * 20,
    // },
    // {
    //   title: t("readingGame"),
    //   description:
    //     language === "hi"
    //       ? "वाक्य और कहानियां पढ़ें"
    //       : "Read sentences and stories",
    //   icon: <BookText className="h-8 w-8" />,
    //   path: "/games/reading",
    //   isAvailable: false,
    //   level: currentProgress.reading.level,
    //   score: currentProgress.reading.score,
    //   progress: 0,
    // },
    // {
    //   title: t("writingGame"),
    //   description:
    //     language === "hi"
    //       ? "अक्षर और शब्द लिखना सीखें"
    //       : "Learn to write letters and words",
    //   icon: <PenTool className="h-8 w-8" />,
    //   path: "/games/writing",
    //   isAvailable: false,
    //   level: currentProgress.writing.level,
    //   score: currentProgress.writing.score,
    //   progress: 0,
    // },
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

        {/* Level Selection or Games Section */}
        {!showGames ? (
          /* Level Selection Section */
          <div className="mb-8 relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none rounded-3xl">
              <div className="grid grid-cols-8 gap-4 text-4xl text-gray-400 p-8">
                {['अ', 'आ', 'इ', 'ओ', 'उ', 'ए', 'ऐ', 'औ'].map((char, index) => (
                  <div key={index} className="text-center">{char}</div>
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
                  : "Choose a level to start playing"
                }
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {levels.map((level, index) => (
                  <LevelCard
                    key={index}
                    level={level.level}
                    title={level.title}
                    subtitle={level.subtitle}
                    gamesCount={level.gamesCount}
                    starsCount={level.starsCount}
                    isAvailable={level.isAvailable}
                    isSelected={selectedLevel === level.level}
                    onSelect={() => handleLevelSelect(level.level)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Games Section */
          <div className="mb-8">
            {/* Back Button */}
            <div className="flex justify-start mb-6">
              <button
                onClick={handleBackToLevels}
                className={`
                  flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200
                  ${language === "hi" ? "font-hindi" : "font-english"}
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{language === "hi" ? "स्तर चुनें" : "Choose Level"}</span>
              </button>
            </div>

            {/* Level Info */}
            <div className="text-center mb-8">
              <h2
                className={`
                text-3xl font-bold text-gray-800 mb-2
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
              >
                {selectedLevel === 'beginner' && (language === "hi" ? "शुरुआती स्तर" : "Beginner Level")}
                {selectedLevel === 'medium' && (language === "hi" ? "मध्यम स्तर" : "Medium Level")}
                {selectedLevel === 'advanced' && (language === "hi" ? "उन्नत स्तर" : "Advanced Level")}
              </h2>
              <p
                className={`
                text-lg text-gray-600
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
              >
                {selectedLevel === 'beginner' && (language === "hi" ? "अक्षर और संख्या सीखें" : "Learn letters and numbers")}
                {selectedLevel === 'medium' && (language === "hi" ? "शब्द और गिनती सीखें" : "Learn words and counting")}
                {selectedLevel === 'advanced' && (language === "hi" ? "जीवन के काम की बातें सीखें" : "Learn life skills")}
              </p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {games.slice(0, 3).map((game, index) => (
                <GameCard key={index} {...game} />
              ))}
            </div>

            {/* Coming Soon Games */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {games.slice(3).map((game, index) => (
                <GameCard key={index + 3} {...game} />
              ))}
            </div>
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
