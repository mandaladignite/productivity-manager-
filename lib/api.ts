import axios from "axios";

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://pm-server-my0k.onrender.com";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Store token if returned in response
    if (response.data.token && typeof window !== "undefined") {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Redirect to login page if not already there
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/signup" && currentPath !== "/") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Types ====================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Habit {
  _id?: string;
  id?: string | number;
  userId?: string;
  name: string;
  description?: string;
  frequency?: string;
  timeOfDay?: string;
  goalType?: "none" | "streak" | "completion";
  goalTarget?: number;
  goalDate?: string;
  currentStreak?: number;
  longestStreak?: number;
  completions?: number;
  completionHistory?: { date: string; completed: boolean }[];
  createdAt?: string;
  updatedAt?: string;
  // UI compatibility fields
  streak?: number;
  completed?: boolean;
  time?: string;
}

// ==================== Auth API ====================

export const auth = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};

// ==================== Habits API ====================

export const habits = {
  getAll: async () => {
    const response = await apiClient.get("/habits");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/habits/${id}`);
    return response.data;
  },

  create: async (data: Partial<Habit>) => {
    const response = await apiClient.post("/habits", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Habit>) => {
    const response = await apiClient.put(`/habits/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/habits/${id}`);
    return response.data;
  },

  toggleCompletion: async (id: string) => {
    const response = await apiClient.patch(`/habits/${id}/toggle-completion`);
    return response.data;
  },
};

// ==================== Default Export ====================

export default {
  auth,
  habits,
  client: apiClient,
};
