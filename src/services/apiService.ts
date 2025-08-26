import axiosInstance from '../config/axiosInstance';

// Types for API responses
export interface RegisterPayload {
  fullName: string;
  userName: string;
  gender: string;
  age: number;
  stateOrUnionTerritory: string;
}

export interface LoginPayload {
  fullName: string;
  userName: string;
}

export interface User {
  _id: string;
  fullName: string;
  userName: string;
  gender: string;
  age: number;
  stateOrUnionTerritory: string;
  role: string;
  streak: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  // Login user
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  // Logout user (if needed for server-side logout)
  logout: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>('/auth/logout');
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (payload: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put<ApiResponse<User>>('/auth/profile', payload);
    return response.data;
  }
};

// Game progress API calls (for future use)
export const gameAPI = {
  // Save game progress
  saveProgress: async (gameType: string, progress: any): Promise<ApiResponse> => {
    const response = await axiosInstance.post<ApiResponse>('/games/progress', {
      gameType,
      progress
    });
    return response.data;
  },

  // Get user progress
  getProgress: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.get<ApiResponse>('/games/progress');
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.get<ApiResponse>('/games/leaderboard');
    return response.data;
  }
};

// Stats API calls (for future use)
export const statsAPI = {
  // Get user statistics
  getUserStats: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.get<ApiResponse>('/stats/user');
    return response.data;
  },

  // Update user statistics
  updateUserStats: async (stats: any): Promise<ApiResponse> => {
    const response = await axiosInstance.put<ApiResponse>('/stats/user', stats);
    return response.data;
  }
};

// Error handling utility
export const handleApiError = (error: any, language: 'en' | 'hi' = 'en'): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status === 401) {
    return language === 'hi' ? 'अनधिकृत पहुंच' : 'Unauthorized access';
  }
  
  if (error.response?.status === 404) {
    return language === 'hi' ? 'सेवा नहीं मिली' : 'Service not found';
  }
  
  if (error.response?.status === 409) {
    return language === 'hi' ? 'यह उपयोगकर्ता नाम पहले से मौजूद है' : 'Username already exists';
  }
  
  if (error.response?.status === 400) {
    return language === 'hi' ? 'अमान्य डेटा, कृपया जांच करें' : 'Invalid data, please check';
  }
  
  if (error.response?.status >= 500) {
    return language === 'hi' ? 'सर्वर त्रुटि, कृपया बाद में पुनः प्रयास करें' : 'Server error, please try again later';
  }
  
  if (!error.response) {
    return language === 'hi' ? 'नेटवर्क त्रुटि, कृपया पुनः प्रयास करें' : 'Network error, please try again';
  }
  
  return language === 'hi' ? 'एक त्रुटि हुई' : 'An error occurred';
};

export default {
  auth: authAPI,
  game: gameAPI,
  stats: statsAPI,
  handleError: handleApiError
};
