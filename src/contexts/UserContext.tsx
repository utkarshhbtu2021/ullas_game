import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  phoneNumber: string;
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
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => boolean;
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

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('ullas-users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      // Load user-specific data
      const userProgress = localStorage.getItem(`ullas-progress-${foundUser.id}`);
      const userStats = localStorage.getItem(`ullas-stats-${foundUser.id}`);
      
      if (userProgress) {
        setProgress(JSON.parse(userProgress));
      }
      if (userStats) {
        setStats(JSON.parse(userStats));
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

      // Store current user and data
      localStorage.setItem('ullas-user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('ullas-progress', JSON.stringify(progress));
      localStorage.setItem('ullas-stats', JSON.stringify(newStats));
      localStorage.setItem(`ullas-stats-${foundUser.id}`, JSON.stringify(newStats));

      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): boolean => {
    const users = JSON.parse(localStorage.getItem('ullas-users') || '[]');
    
    // Check if user already exists
    if (users.some((u: any) => u.email === userData.email)) {
      return false;
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('ullas-users', JSON.stringify(users));

    // Auto-login the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setProgress(defaultProgress);
    setStats(defaultStats);

    // Store user data
    localStorage.setItem('ullas-user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('ullas-progress', JSON.stringify(defaultProgress));
    localStorage.setItem('ullas-stats', JSON.stringify(defaultStats));
    localStorage.setItem(`ullas-progress-${newUser.id}`, JSON.stringify(defaultProgress));
    localStorage.setItem(`ullas-stats-${newUser.id}`, JSON.stringify(defaultStats));

    return true;
  };

  const logout = () => {
    setUser(null);
    setProgress(defaultProgress);
    setStats(defaultStats);
    localStorage.removeItem('ullas-user');
    localStorage.removeItem('ullas-progress');
    localStorage.removeItem('ullas-stats');
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
      register,
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