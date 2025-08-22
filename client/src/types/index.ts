export interface User {
    _id: string;
    id: string;
    name: string;
    email: string;
    address: string;
    role: 'admin' | 'user' | 'storeOwner';
    rating?: number;
}

export interface Store {
    _id: string;
    name: string;
    email: string;
    address: string;
    owner: {
        _id: string;
        name: string;
        email: string;
    };
    averageRating: number;
    totalRatings: number;
    userRating?: number | null;
}

export interface Rating {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    store: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    address: string;
    role: 'admin' | 'user' | 'storeOwner';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    address: string;
}

export interface DashboardStats {
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
}

export interface PaginationInfo {
    current: number;
    pages: number;
    total: number;
}

export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
    pagination?: PaginationInfo;
}