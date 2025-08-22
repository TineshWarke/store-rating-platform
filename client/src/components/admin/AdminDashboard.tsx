import React, { useEffect, useState } from 'react';
import { Users, Store, Star, TrendingUp } from 'lucide-react';
import { usersAPI } from '../../services/api';
import type { DashboardStats } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await usersAPI.getDashboardStats();
                setStats(data);
            } catch (err: any) {
                setError('Failed to load dashboard statistics');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
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

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
        },
        {
            title: 'Total Stores',
            value: stats?.totalStores || 0,
            icon: Store,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
        },
        {
            title: 'Total Ratings',
            value: stats?.totalRatings || 0,
            icon: Star,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
        },
        {
            title: 'Platform Growth',
            value: '12%',
            icon: TrendingUp,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">Overview of your platform's performance</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat) => (
                        <div
                            key={stat.title}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200">
                                <div className="flex items-center">
                                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                                    <div>
                                        <div className="font-medium text-blue-900">Manage Users</div>
                                        <div className="text-sm text-blue-600">Add, edit, or view user accounts</div>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-200">
                                <div className="flex items-center">
                                    <Store className="w-5 h-5 text-green-600 mr-3" />
                                    <div>
                                        <div className="font-medium text-green-900">Manage Stores</div>
                                        <div className="text-sm text-green-600">Add new stores and manage existing ones</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-3">
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">New user registered</div>
                                    <div className="text-xs text-gray-500">2 minutes ago</div>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">Store rating submitted</div>
                                    <div className="text-xs text-gray-500">5 minutes ago</div>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">New store added</div>
                                    <div className="text-xs text-gray-500">1 hour ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;