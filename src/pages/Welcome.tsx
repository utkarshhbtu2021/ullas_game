import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Award, Globe, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useVoice } from "../contexts/VoiceContext";
import { useUser } from "../contexts/UserContext";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { speak, isEnabled, toggleVoice } = useVoice();
  const { isAuthenticated } = useUser();
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!hasSpoken) {
      const timer = setTimeout(() => {
        speak(t("welcome") + ". " + t("subtitle"));
        setHasSpoken(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [speak, t, hasSpoken]);

  const handleLanguageToggle = () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    speak(t("languageChanged"), true);
  };

  const handleVoiceToggle = () => {
    toggleVoice();
    speak(isEnabled ? "Voice disabled" : "Voice enabled", true);
  };

  const features = [
    {
      id: "interactive-games",
      icon: <BookOpen className="h-8 w-8 text-primary-600" />,
      title: language === "hi" ? "इंटरैक्टिव गेम्स" : "Interactive Games",
      description:
        language === "hi" ? "मजेदार तरीके से सीखें" : "Learn through fun games",
    },
    {
      id: "personalized-learning",
      icon: <Users className="h-8 w-8 text-secondary-600" />,
      title: language === "hi" ? "व्यक्तिगत शिक्षा" : "Personalized Learning",
      description:
        language === "hi" ? "आपकी गति से सीखें" : "Learn at your own pace",
    },
    {
      id: "achievements",
      icon: <Award className="h-8 w-8 text-success-600" />,
      title: language === "hi" ? "उपलब्धियां" : "Achievements",
      description:
        language === "hi" ? "अपनी प्रगति ट्रैक करें" : "Track your progress",
    },
    {
      id: "bilingual",
      icon: <Globe className="h-8 w-8 text-warning-600" />,
      title: language === "hi" ? "द्विभाषी" : "Bilingual",
      description:
        language === "hi"
          ? "हिंदी और अंग्रेजी में"
          : "Available in Hindi & English",
    },
  ];

  return (
    <div className="min-h-screen mainHome__inner">
      {/* Header with Language and Voice Controls */}
      <div className="mainHome__inner-header">
        <div className="container">
        <div className="flex justify-between items-center row">
          <div className="flex justify-center">
            <img
              src="/public/images/logos/ullas-logo.svg"
              alt="ULLAS Logo"
              className="ullas-logo"
            />
            <img
              src="/public/images/logos/ministry-of-education-logo.svg"
              alt="ULLAS Logo"
              className="ministry-logo"
            />
          </div>
          <div className="flex justify-end items-center space-x-4">
            <button
              onClick={handleLanguageToggle}
              className="p-3 flex items-center rounded-full bg-secondary-100 hover:bg-secondary-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500"
              aria-label="Toggle Language"
            >
              <Globe className="h-6 w-6 text-secondary-600" />
              <span
                className={`ml-2 text-sm font-medium text-secondary-600 ${
                  language === "hi" ? "font-hindi" : "font-english"
                }`}
              >
                {language === "en" ? "हिं" : "EN"}
              </span>
            </button>

            <button
              onClick={handleVoiceToggle}
              className={`p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ${
                isEnabled
                  ? "bg-success-100 hover:bg-success-200 focus:ring-success-500"
                  : "bg-gray-100 hover:bg-gray-200 focus:ring-gray-500"
              }`}
              aria-label="Toggle Voice"
            >
              {isEnabled ? (
                <Volume2 className="h-6 w-6 text-success-600" />
              ) : (
                <VolumeX className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
      </div>
      

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16"> 

          <h1
            style={{ lineHeight: "1.5" }}
            className={`
            text-5xl md:text-6xl font-bold  bg-gradient-to-r from-primary-600 via-secondary-600 to-success-600 bg-clip-text text-transparent
            ${language === "hi" ? "font-hindi" : "font-english"}
          `}
          >
            {t("welcome")}
          </h1>

          <p
            className={`
            text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto
            ${language === "hi" ? "font-hindi" : "font-english"}
          `}
          >
            {t("subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                speak(t("getStarted"));
                navigate("/register");
              }}
              className={`
                px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-full
                shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300
                focus:outline-none focus:ring-4 focus:ring-primary-300
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
            >
              {t("getStarted")}
            </button>

            <button
              onClick={() => {
                speak(t("login"));
                navigate("/login");
              }}
              className={`
                px-8 py-4 bg-white text-primary-600 font-bold rounded-full border-2 border-primary-500
                hover:bg-primary-50 transform hover:scale-105 transition-all duration-300
                focus:outline-none focus:ring-4 focus:ring-primary-300
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
            >
              {t("login")}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-float"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3
                className={`
                text-lg font-bold text-center mb-2 text-gray-800
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
              >
                {feature.title}
              </h3>
              <p
                className={`
                text-sm text-center text-gray-600
                ${language === "hi" ? "font-hindi" : "font-english"}
              `}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Partnership Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="flex justify-center items-center space-x-6 mb-6">
            <img
              src="https://ullas.education.gov.in/portal/images/logos/school_edu_logo.svg"
              alt="Ministry of Education"
              className="h-16"
            />
            <img
              src="https://ullas.education.gov.in/nilp/images/logos/ullas_logo.png"
              alt="ULLAS"
              className="h-16 w-auto"
            />
          </div>
          <p
            className={`
            text-lg text-gray-700
            ${language === "hi" ? "font-hindi" : "font-english"}
          `}
          >
            {language === "hi"
              ? "शिक्षा मंत्रालय, भारत सरकार की एक पहल"
              : "An initiative by Ministry of Education, Government of India"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
