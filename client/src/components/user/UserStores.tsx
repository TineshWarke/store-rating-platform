import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { storesAPI, ratingsAPI } from '../../services/api';
import type { Store, PaginationInfo } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import StarRating from '../common/StarRating';

const UserStores: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState<PaginationInfo>({ current: 1, pages: 1, total: 0 });
    const [submittingRating, setSubmittingRating] = useState<string | null>(null);

    // Filters and search
    const [filters, setFilters] = useState({
        name: '',
        address: '',
        page: 1,
        limit: 12,
    });

    const fetchStores = async () => {
        setIsLoading(true);
        try {
            const response = await storesAPI.getAllStores(filters);
            setStores(response.stores);
            setPagination(response.pagination);
            setError('');
        } catch (err: any) {
            setError('Failed to load stores');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleRatingSubmit = async (storeId: string, rating: number) => {
        setSubmittingRating(storeId);
        try {
            await ratingsAPI.submitRating(storeId, rating);

            // Update the store's user rating in the local state
            setStores(prevStores =>
                prevStores.map(store =>
                    store._id === storeId
                        ? { ...store, userRating: rating }
                        : store
                )
            );
        } catch (err: any) {
            setError('Failed to submit rating');
        } finally {
            setSubmittingRating(null);
        }
    };

    const handleRatingDelete = async (storeId: string) => {
        setSubmittingRating(storeId);
        try {
            await ratingsAPI.deleteRating(storeId);

            // Update the store's user rating in the local state
            setStores(prevStores =>
                prevStores.map(store =>
                    store._id === storeId
                        ? { ...store, userRating: null }
                        : store
                )
            );
        } catch (err: any) {
            setError('Failed to delete rating');
        } finally {
            setSubmittingRating(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Discover Stores</h1>
                    <p className="mt-2 text-gray-600">Rate and review your favorite stores</p>
                </div>

                {/* Search Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={filters.name}
                                    onChange={(e) => handleFilterChange('name', e.target.value)}
                                    placeholder="Search store names..."
                                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={filters.address}
                                    onChange={(e) => handleFilterChange('address', e.target.value)}
                                    placeholder="Search by location..."
                                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Stores Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stores.map((store) => (
                                <div key={store._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
                                        <div className="flex items-start text-gray-600 text-sm mb-3">
                                            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">{store.address}</span>
                                        </div>

                                        {/* Store Overall Rating */}
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Store Rating</span>
                                                <span className="text-xs text-gray-500">
                                                    ({store.totalRatings} reviews)
                                                </span>
                                            </div>
                                            <StarRating rating={store.averageRating} readonly />
                                        </div>

                                        {/* User's Rating */}
                                        <div className="border-t border-gray-100 pt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Your Rating</span>
                                                {store.userRating && (
                                                    <button
                                                        onClick={() => handleRatingDelete(store._id)}
                                                        disabled={submittingRating === store._id}
                                                        className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            {submittingRating === store._id ? (
                                                <div className="flex items-center py-2">
                                                    <LoadingSpinner size="sm" className="mr-2" />
                                                    <span className="text-sm text-gray-600">Updating...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <StarRating
                                                        rating={store.userRating || 0}
                                                        onRatingChange={(rating) => handleRatingSubmit(store._id, rating)}
                                                        size={18}
                                                    />
                                                    {!store.userRating && (
                                                        <span className="ml-2 text-xs text-gray-500">Click to rate</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {stores.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-500">
                                    <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium">No stores found</p>
                                    <p className="text-sm">Try adjusting your search filters</p>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, pagination.current - 1))}
                                        disabled={pagination.current === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pagination.current
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => handlePageChange(Math.min(pagination.pages, pagination.current + 1))}
                                        disabled={pagination.current === pagination.pages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserStores;