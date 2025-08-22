import React, { useState, useEffect } from 'react';
import { Star, Users, TrendingUp, Calendar } from 'lucide-react';
import { storesAPI } from '../../services/api';
import type { Rating } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import StarRating from '../common/StarRating';

interface OwnerDashboardData {
    store: {
        id: string;
        name: string;
        averageRating: number;
        totalRatings: number;
    };
    ratings: Rating[];
}

const OwnerDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<OwnerDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await storesAPI.getOwnerDashboard();
                setDashboardData(data);
            } catch (err: any) {
                setError('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Store Found</h2>
                    <p className="text-gray-600">You don't have a store registered yet. Contact an administrator to set up your store.</p>
                </div>
            </div>
        );
    }

    const { store, ratings } = dashboardData;

    // Calculate rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: ratings.filter(r => r.rating === rating).length,
        percentage: ratings.length > 0 ? (ratings.filter(r => r.rating === rating).length / ratings.length) * 100 : 0
    }));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
                    <p className="mt-2 text-gray-600">Monitor your store's performance and customer feedback</p>
                </div>

                {/* Store Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{store.name}</h2>
                            <div className="flex items-center mt-2">
                                <StarRating rating={store.averageRating} readonly />
                                <span className="ml-2 text-sm text-gray-500">
                                    ({store.totalRatings} reviews)
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">{store.averageRating.toFixed(1)}</div>
                            <div className="text-sm text-gray-500">Average Rating</div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-blue-50 mr-4">
                                <Star className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                                <p className="text-2xl font-bold text-gray-900">{store.totalRatings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-green-50 mr-4">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unique Customers</p>
                                <p className="text-2xl font-bold text-gray-900">{ratings.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-yellow-50 mr-4">
                                <TrendingUp className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Rating Trend</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {store.averageRating >= 4 ? '↗' : store.averageRating >= 3 ? '→' : '↘'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rating Distribution */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                        <div className="space-y-3">
                            {ratingDistribution.reverse().map(({ rating, count, percentage }) => (
                                <div key={rating} className="flex items-center">
                                    <div className="flex items-center w-16">
                                        <span className="text-sm font-medium text-gray-700 mr-1">{rating}</span>
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">
                                        {count} ({percentage.toFixed(0)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Reviews */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {ratings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>No reviews yet</p>
                                    <p className="text-sm">Your first customer review will appear here</p>
                                </div>
                            ) : (
                                ratings.slice(0, 10).map((rating) => (
                                    <div key={rating._id} className="border-b border-gray-100 pb-3 last:border-b-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{rating.user.name}</p>
                                                <p className="text-xs text-gray-500">{rating.user.email}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <StarRating rating={rating.rating} readonly size={14} />
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(rating.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;