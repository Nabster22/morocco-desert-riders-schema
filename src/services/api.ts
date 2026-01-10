/**
 * API Service for Morocco Desert Riders
 * Handles all HTTP requests to the backend API
 */

import axios from 'axios';

// API Base URL - configure based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH API =============
export const authAPI = {
  /**
   * Register a new user
   */
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Check if user is admin
   */
  isAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user?.role === 'admin';
  },
};

// ============= TOURS API =============
export interface TourFilters {
  city?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  duration?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating_desc' | 'popularity' | 'newest';
  page?: number;
  limit?: number;
}

export interface Tour {
  id: number;
  name: string;
  city_id: number;
  city_name?: string;
  category_id: number;
  category_name?: string;
  description: string;
  duration_days: number;
  price_standard: number;
  price_premium: number;
  max_guests: number;
  images: string[];
  is_active: boolean;
  avg_rating?: number;
  review_count?: number;
  created_at: string;
}

export const toursAPI = {
  /**
   * Get all tours with optional filters
   */
  getAll: async (filters?: TourFilters) => {
    const response = await api.get('/tours', { params: filters });
    return response.data;
  },

  /**
   * Get a single tour by ID
   */
  getById: async (id: number) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },

  /**
   * Create a new tour (admin only)
   */
  create: async (data: Partial<Tour>) => {
    const response = await api.post('/tours', data);
    return response.data;
  },

  /**
   * Update a tour (admin only)
   */
  update: async (id: number, data: Partial<Tour>) => {
    const response = await api.put(`/tours/${id}`, data);
    return response.data;
  },

  /**
   * Delete a tour (admin only)
   */
  delete: async (id: number) => {
    const response = await api.delete(`/tours/${id}`);
    return response.data;
  },
};

// ============= CITIES API =============
export interface City {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  tour_count?: number;
}

export const citiesAPI = {
  /**
   * Get all cities
   */
  getAll: async () => {
    const response = await api.get('/cities');
    return response.data;
  },

  /**
   * Get a single city by ID
   */
  getById: async (id: number) => {
    const response = await api.get(`/cities/${id}`);
    return response.data;
  },

  /**
   * Create a new city (admin only)
   */
  create: async (data: Partial<City>) => {
    const response = await api.post('/cities', data);
    return response.data;
  },

  /**
   * Update a city (admin only)
   */
  update: async (id: number, data: Partial<City>) => {
    const response = await api.put(`/cities/${id}`, data);
    return response.data;
  },

  /**
   * Delete a city (admin only)
   */
  delete: async (id: number) => {
    const response = await api.delete(`/cities/${id}`);
    return response.data;
  },
};

// ============= CATEGORIES API =============
export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  tour_count?: number;
}

export const categoriesAPI = {
  /**
   * Get all categories
   */
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  /**
   * Get a single category by ID
   */
  getById: async (id: number) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category (admin only)
   */
  create: async (data: Partial<Category>) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  /**
   * Update a category (admin only)
   */
  update: async (id: number, data: Partial<Category>) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a category (admin only)
   */
  delete: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// ============= BOOKINGS API =============
export interface Booking {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  tour_id: number;
  tour_name?: string;
  start_date: string;
  end_date: string;
  guests: number;
  tier: 'standard' | 'premium';
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  special_requests?: string;
  created_at: string;
}

export interface CreateBookingData {
  tour_id: number;
  start_date: string;
  guests: number;
  tier: 'standard' | 'premium';
  special_requests?: string;
}

export const bookingsAPI = {
  /**
   * Get all bookings (admin) or user's bookings
   */
  getAll: async (filters?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/bookings', { params: filters });
    return response.data;
  },

  /**
   * Get a single booking by ID
   */
  getById: async (id: number) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Create a new booking
   */
  create: async (data: CreateBookingData) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  /**
   * Update booking status (admin only)
   */
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  /**
   * Cancel a booking
   */
  cancel: async (id: number) => {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data;
  },

  /**
   * Download invoice PDF
   */
  downloadInvoice: async (id: number) => {
    const response = await api.get(`/export/booking/${id}/invoice`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

// ============= REVIEWS API =============
export interface Review {
  id: number;
  user_id: number;
  user_name?: string;
  tour_id: number;
  tour_name?: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

export const reviewsAPI = {
  /**
   * Get reviews for a tour
   */
  getByTour: async (tourId: number) => {
    const response = await api.get(`/reviews/tour/${tourId}`);
    return response.data;
  },

  /**
   * Create a new review
   */
  create: async (data: { tour_id: number; rating: number; comment: string }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  /**
   * Delete a review (admin only)
   */
  delete: async (id: number) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// ============= USERS API (Admin) =============
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'admin';
  created_at: string;
}

export const usersAPI = {
  /**
   * Get all users (admin only)
   */
  getAll: async (filters?: { role?: string; page?: number; limit?: number }) => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  /**
   * Get a single user by ID
   */
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Update user
   */
  update: async (id: number, data: Partial<User>) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user (admin only)
   */
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// ============= EXPORT API =============
export const exportAPI = {
  /**
   * Export bookings as CSV
   */
  bookingsCSV: async (filters?: { start_date?: string; end_date?: string }) => {
    const response = await api.get('/export/bookings/csv', {
      params: filters,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bookings.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Export bookings as Excel
   */
  bookingsExcel: async (filters?: { start_date?: string; end_date?: string }) => {
    const response = await api.get('/export/bookings/excel', {
      params: filters,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bookings.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

// ============= STATS API (Admin Dashboard) =============
export const statsAPI = {
  /**
   * Get dashboard statistics
   */
  getDashboard: async () => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },

  /**
   * Get revenue by month
   */
  getRevenueByMonth: async (year?: number) => {
    const response = await api.get('/stats/revenue/monthly', { params: { year } });
    return response.data;
  },

  /**
   * Get bookings by city
   */
  getBookingsByCity: async () => {
    const response = await api.get('/stats/bookings/by-city');
    return response.data;
  },

  /**
   * Get popular tours
   */
  getPopularTours: async (limit?: number) => {
    const response = await api.get('/stats/tours/popular', { params: { limit } });
    return response.data;
  },
};

export default api;
