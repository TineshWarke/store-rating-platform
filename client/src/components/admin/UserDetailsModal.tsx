import React from 'react';
import { X, User, Mail, MapPin, Shield, Star } from 'lucide-react';
import type { User as UserType } from '../../types';

interface UserDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'storeOwner':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="w-5 h-5" />;
            case 'storeOwner':
                return <Star className="w-5 h-5" />;
            default:
                return <User className="w-5 h-5" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <User className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                        <div className="flex items-center justify-center mt-2">
                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full capitalize ${getRoleColor(user.role)}`}>
                                {getRoleIcon(user.role)}
                                <span className="ml-1">{user.role}</span>
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Address</p>
                                <p className="text-sm text-gray-600">{user.address}</p>
                            </div>
                        </div>

                        {user.role === 'storeOwner' && user.rating !== undefined && (
                            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                                <Star className="w-5 h-5 text-yellow-500 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Store Rating</p>
                                    <div className="flex items-center">
                                        <span className="text-lg font-bold text-yellow-600">
                                            {user.rating > 0 ? user.rating.toFixed(1) : 'No ratings yet'}
                                        </span>
                                        {user.rating > 0 && (
                                            <div className="flex ml-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= user.rating!
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;