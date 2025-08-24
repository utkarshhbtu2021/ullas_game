import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

interface VoiceContextType {
  isEnabled: boolean;
  isSpeaking: boolean;
  toggleVoice: () => void;
  speak: (text: string, force?: boolean) => void;
  stopSpeaking: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = localStorage.getItem('ullas-voice-enabled');
    return stored !== 'false';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    localStorage.setItem('ullas-voice-enabled', isEnabled.toString());
  }, [isEnabled]);

  const getVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    
    if (language === 'hi') {
      // Try to find Hindi voice
      return voices.find(voice => 
        voice.lang.startsWith('hi') || 
        voice.name.toLowerCase().includes('hindi') ||
        voice.name.toLowerCase().includes('devanagari')
      ) || voices.find(voice => voice.lang.startsWith('en'));
    } else {
      // Find English voice
      return voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.toLowerCase().includes('indian') || 
         voice.name.toLowerCase().includes('india'))
      ) || voices.find(voice => voice.lang.startsWith('en'));
    }
  }, [language]);

  const speak = useCallback((text: string, force = false) => {
    if (!isEnabled && !force) return;
    if (isSpeaking && !force) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoice();
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [isEnabled, isSpeaking, getVoice, language]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleVoice = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  // Load voices when they become available
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
  }, []);

  return (
    <VoiceContext.Provider value={{
      isEnabled,
      isSpeaking,
      toggleVoice,
      speak,
      stopSpeaking
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};