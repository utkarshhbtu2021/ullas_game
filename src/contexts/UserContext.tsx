import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, handleApiError } from '../services/apiService';

interface User {
  id: string;
  name: string;
  userName: string;
  gender: string;
  age: number;
  stateOrUnionTerritory: string;
  role: string;
  streak: number;
  createdAt: string;
}

interface GameProgress {
  phonics: { level: number; score: number; completed: boolean };
  imageWord: { level: number; score: number; completed: boolean };
  counting: { level: number; score: number; completed: boolean };
  reading: { level: number; score: number; completed: boolean };
  writing: { level: number; score: number; completed: boolean };
}

interface UserStats {
  totalScore: number;
  gamesCompleted: number;
  streakDays: number;
  lastLoginDate: string;
}

interface UserContextType {
  user: User | null;
  progress: GameProgress;
  stats: UserStats;
  login: (fullName: string, userName: string) => Promise<boolean>;
  logout: () => void;
  updateProgress: (game: keyof GameProgress, data: Partial<GameProgress[keyof GameProgress]>) => void;
  isAuthenticated: boolean;
}

const defaultProgress: GameProgress = {
  phonics: { level: 1, score: 0, completed: false },
  imageWord: { level: 1, score: 0, completed: false },
  counting: { level: 1, score: 0, completed: false },
  reading: { level: 1, score: 0, completed: false },
  writing: { level: 1, score: 0, completed: false },
};

const defaultStats: UserStats = {
  totalScore: 0,
  gamesCompleted: 0,
  streakDays: 0,
  lastLoginDate: new Date().toISOString(),
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);
  const [stats, setStats] = useState<UserStats>(defaultStats);

  useEffect(() => {
    // Load user data from localStorage on mount
    const storedUser = localStorage.getItem('ullas-user');
    const storedProgress = localStorage.getItem('ullas-progress');
    const storedStats = localStorage.getItem('ullas-stats');
    const token = localStorage.getItem('ullas-token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    }
  }, []);

  const login = async (fullName: string, userName: string): Promise<boolean> => {
    try {
      const data = await authAPI.login({ fullName, userName });

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('ullas-token', data.data.token);
        
        // Store user data
        const userData = {
          id: data.data.user._id,
          name: data.data.user.fullName,
          userName: data.data.user.userName,
          gender: data.data.user.gender,
          age: data.data.user.age,
          stateOrUnionTerritory: data.data.user.stateOrUnionTerritory,
          role: data.data.user.role,
          streak: data.data.user.streak,
          createdAt: data.data.user.createdAt
        };
        setUser(userData);
        localStorage.setItem('ullas-user', JSON.stringify(userData));
        localStorage.setItem('streak', JSON.stringify(userData.streak));

        // Load user-specific progress and stats
        const userProgress = localStorage.getItem(`ullas-progress-${userData.id}`);
        const userStats = localStorage.getItem(`ullas-stats-${userData.id}`);
        
        if (userProgress) {
          setProgress(JSON.parse(userProgress));
          localStorage.setItem('ullas-progress', userProgress);
        }
        if (userStats) {
          setStats(JSON.parse(userStats));
          localStorage.setItem('ullas-stats', userStats);
        }

        // Update last login and streak
        const today = new Date().toDateString();
        const lastLogin = new Date(stats.lastLoginDate).toDateString();
        const newStats = {
          ...stats,
          lastLoginDate: new Date().toISOString(),
          streakDays: today !== lastLogin ? stats.streakDays + 1 : stats.streakDays
        };
        setStats(newStats);
        localStorage.setItem('ullas-stats', JSON.stringify(newStats));
        localStorage.setItem(`ullas-stats-${userData.id}`, JSON.stringify(newStats));

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setProgress(defaultProgress);
    setStats(defaultStats);
    localStorage.removeItem('ullas-user');
    localStorage.removeItem('ullas-progress');
    localStorage.removeItem('ullas-stats');
    localStorage.removeItem('ullas-token');
  };

  const updateProgress = (game: keyof GameProgress, data: Partial<GameProgress[keyof GameProgress]>) => {
    if (!user) return;

    const newProgress = {
      ...progress,
      [game]: { ...progress[game], ...data }
    };

    // Calculate new stats
    const totalScore = Object.values(newProgress).reduce((sum, gameData) => sum + gameData.score, 0);
    const gamesCompleted = Object.values(newProgress).filter(gameData => gameData.completed).length;
    
    const newStats = {
      ...stats,
      totalScore,
      gamesCompleted
    };

    setProgress(newProgress);
    setStats(newStats);

    // Persist to localStorage
    localStorage.setItem('ullas-progress', JSON.stringify(newProgress));
    localStorage.setItem('ullas-stats', JSON.stringify(newStats));
    localStorage.setItem(`ullas-progress-${user.id}`, JSON.stringify(newProgress));
    localStorage.setItem(`ullas-stats-${user.id}`, JSON.stringify(newStats));

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('userProgressUpdate', { 
      detail: { progress: newProgress, stats: newStats } 
    }));
  };

  return (
    <UserContext.Provider value={{
      user,
      progress,
      stats,
      login,
      logout,
      updateProgress,
      isAuthenticated: !!user
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};