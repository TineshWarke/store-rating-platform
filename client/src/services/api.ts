import axios from 'axios';
import type { AuthUser, LoginCredentials, RegisterData, DashboardStats } from '../types';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://store-rating-platform-sigma.vercel.app/';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    getProfile: async (): Promise<AuthUser> => {
        const response = await api.get('/auth/profile');
        return response.data.user;
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
        const response = await api.put('/auth/change-password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    },
};

// Users API
export const usersAPI = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/users/dashboard-stats');
        return response.data;
    },

    createUser: async (userData: RegisterData & { role: string }) => {
        const response = await api.post('/users/create', userData);
        return response.data;
    },

    getAllUsers: async (params: any) => {
        const response = await api.get('/users/all', { params });
        return response.data;
    },

    getUserDetails: async (id: string) => {
        const response = await api.get(`/users/details/${id}`);
        return response.data;
    },
};

// Stores API
export const storesAPI = {
    createStore: async (storeData: any) => {
        const response = await api.post('/stores/create', storeData);
        return response.data;
    },

    getAllStores: async (params: any) => {
        const response = await api.get('/stores/all', { params });
        return response.data;
    },

    getOwnerDashboard: async () => {
        const response = await api.get('/stores/owner-dashboard');
        return response.data;
    },
};

// Ratings API
export const ratingsAPI = {
    submitRating: async (storeId: string, rating: number) => {
        const response = await api.post('/ratings/submit', { storeId, rating });
        return response.data;
    },

    getUserRating: async (storeId: string) => {
        const response = await api.get(`/ratings/user-rating/${storeId}`);
        return response.data;
    },

    deleteRating: async (storeId: string) => {
        const response = await api.delete(`/ratings/${storeId}`);
        return response.data;
    },
};