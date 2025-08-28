import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';
type Content = {
  [key: string]: string | Content;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const content: Record<Language, Content> = {
  en: {
    welcome: 'Welcome to ULLAS',
    subtitle: 'Your Journey to Literacy Starts Here',
    getStarted: 'Get Started',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    games: 'Games',
    profile: 'Profile',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    userName: 'Username',
    gender: 'Gender',
    age: 'Age',
    location: 'Location',
    stateOrUnionTerritory: 'State or Union Territory',
    phoneNumber: 'Phone Number',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    enterName: 'Enter your full name',
    enterUserName: 'Enter your username',
    enterAge: 'Enter your age',
    enterLocation: 'Enter your location',
    enterStateOrUnionTerritory: 'Enter your state or union territory',
    enterPhone: 'Enter your phone number',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signInHere: 'Sign in here',
    signUpHere: 'Sign up here',
    phonicsGame: 'Phonics Game',
    imageWordGame: 'Image Word Match',
    countingGame: 'Counting Game',
    readingGame: 'Reading Game',
    writingGame: 'Writing Game',
    comingSoon: 'Coming Soon',
    yourAchievements: 'Your Achievements',
    progress: 'Progress',
    viewDetails: 'View Details',
    gamesCompleted: 'Games Completed',
    totalScore: 'Total Score',
    streakDays: 'Streak Days',
    startGame: 'Start Game',
    nextLevel: 'Next Level',
    tryAgain: 'Try Again',
    wellDone: 'Well Done!',
    correct: 'Correct!',
    incorrect: 'Try Again',
    score: 'Score',
    level: 'Level',
    selectCorrectAnswer: 'Select the correct answer',
    tapToHear: 'Tap to hear',
    instructions: 'Instructions',
    backToDashboard: 'Back to Dashboard',
    languageChanged: 'Language changed'
  },
  hi: {
    welcome: 'उल्लास - नव भारत साक्षरता कार्यक्रम',
    subtitle: 'आओ मिलकर बनायें भारत का जन जन साक्षर',
    getStarted: 'शुरू करें',
    login: 'लॉग इन',
    register: 'पंजीकरण',
    dashboard: 'डैशबोर्ड',
    games: 'खेल',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉग आउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    userName: 'उपयोगकर्ता नाम',
    gender: 'लिंग',
    age: 'उम्र',
    location: 'स्थान',
    stateOrUnionTerritory: 'राज्य या केंद्र शासित प्रदेश',
    phoneNumber: 'फोन नंबर',
    enterEmail: 'अपना ईमेल दर्ज करें',
    enterPassword: 'अपना पासवर्ड दर्ज करें',
    enterName: 'अपना पूरा नाम दर्ज करें',
    enterUserName: 'अपना उपयोगकर्ता नाम दर्ज करें',
    enterAge: 'अपनी उम्र दर्ज करें',
    enterLocation: 'अपना स्थान दर्ज करें',
    enterStateOrUnionTerritory: 'अपना राज्य या केंद्र शासित प्रदेश दर्ज करें',
    enterPhone: 'अपना फोन नंबर दर्ज करें',
    alreadyHaveAccount: 'पहले से खाता है?',
    dontHaveAccount: 'खाता नहीं है?',
    signInHere: 'यहाँ साइन इन करें',
    signUpHere: 'यहाँ साइन अप करें',
    phonicsGame: 'ध्वनि खेल',
    imageWordGame: 'चित्र शब्द मिलान',
    countingGame: 'गिनती खेल',
    readingGame: 'पढ़ने का खेल',
    writingGame: 'लिखने का खेल',
    comingSoon: 'जल्द आ रहा है',
    yourAchievements: 'आपकी उपलब्धियां',
    progress: 'प्रगति',
    viewDetails: 'विवरण देखें',
    gamesCompleted: 'खेल पूरे किए',
    totalScore: 'कुल स्कोर',
    streakDays: 'लगातार दिन',
    startGame: 'खेल शुरू करें',
    nextLevel: 'अगला स्तर',
    tryAgain: 'फिर कोशिश करें',
    wellDone: 'बहुत अच्छा!',
    correct: 'सही!',
    incorrect: 'फिर कोशिश करें',
    score: 'स्कोर',
    level: 'स्तर',
    selectCorrectAnswer: 'सही उत्तर चुनें',
    tapToHear: 'सुनने के लिए टैप करें',
    instructions: 'निर्देश',
    backToDashboard: 'डैशबोर्ड पर वापस',
    languageChanged: 'भाषा बदल गई'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('ullas-language');
    return (stored as Language) || 'hi';
  });

  useEffect(() => {
    localStorage.setItem('ullas-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = content[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};