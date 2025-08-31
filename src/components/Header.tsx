import React from "react";
import { Volume2, VolumeX, Globe, LogOut } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useVoice } from "../contexts/VoiceContext";
import { useUser } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isEnabled, toggleVoice, speak } = useVoice();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLanguageToggle = () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    speak(t("languageChanged"), true);
  };

  const handleVoiceToggle = () => {
    toggleVoice();
    speak(isEnabled ? "Voice disabled" : "Voice enabled", true);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="mainHome__inner-header">
      <div className="container">
        <div className="flex justify-between items-center row mainHeader">
          <div className="flex justify-center logoSection">
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
          <div className="flex justify-end items-center space-x-4 userOptions">
            {!user && (
              <Link
                to="/"
                className="text-primary-600 font-semibold hover:text-primary-700 focus:outline-none focus:underline"
                onClick={() => speak(t("Home"))}
              >
                {t("Home")}
              </Link>
            )}
            <button
              onClick={handleLanguageToggle}
              className="p-3 flex rounded-full bg-secondary-100 hover:bg-secondary-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500"
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

            {user && (
              <button
                onClick={handleLogout}
                className="p-3 rounded-full bg-error-100 hover:bg-error-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error-500"
                aria-label="Logout"
              >
                <LogOut className="h-6 w-6 text-error-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
