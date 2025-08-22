import React, { useState } from 'react';
import { Lock, User, Mail, MapPin, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const UserProfile: React.FC = () => {
    const { user, updatePassword } = useAuth();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const validatePasswordForm = () => {
        const errors: Record<string, string> = {};
        if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
        if (passwordData.newPassword.length < 8 || passwordData.newPassword.length > 16) {
            errors.newPassword = 'Password must be 8-16 characters long';
        } else if (!/(?=.*[A-Z])/.test(passwordData.newPassword)) {
            errors.newPassword = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[!@#$%^&*])/.test(passwordData.newPassword)) {
            errors.newPassword = 'Password must contain at least one special character';
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        setIsChangingPassword(true);
        setError('');
        setMessage('');

        try {
            await updatePassword(passwordData.currentPassword, passwordData.newPassword);
            setMessage('✅ Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
        if (validationErrors[e.target.name]) {
            setValidationErrors({ ...validationErrors, [e.target.name]: '' });
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-700';
            case 'storeOwner':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-green-100 text-green-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
                </div>

                {/* Alerts */}
                {message && (
                    <div className="mb-6 rounded-lg bg-green-50 border border-green-200 text-green-700 px-6 py-3 shadow-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 px-6 py-3 shadow-sm">
                        {error}
                    </div>
                )}

                {/* Profile Information */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4 shadow-inner">
                                <User className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                                <span
                                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full capitalize ${getRoleColor(
                                        user.role
                                    )}`}
                                >
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm">
                                <Mail className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email Address</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm">
                                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Address</p>
                                    <p className="text-sm text-gray-600">{user.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Management */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                    </div>

                    <div className="p-6">
                        {!showPasswordForm ? (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <Lock className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Password</p>
                                        <p className="text-sm text-gray-600">
                                            Update your password to keep your account secure
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 rounded-lg transition-all"
                                >
                                    Change Password
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-black">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-3 py-2 border ${validationErrors.currentPassword ? 'border-red-300' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Enter your current password"
                                    />
                                    {validationErrors.currentPassword && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.currentPassword}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password{' '}
                                        <span className="text-gray-500 text-xs">(8-16 chars, 1 uppercase, 1 special)</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-3 py-2 border ${validationErrors.newPassword ? 'border-red-300' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Enter your new password"
                                    />
                                    {validationErrors.newPassword && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-3 py-2 border ${validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Confirm your new password"
                                    />
                                    {validationErrors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            setValidationErrors({});
                                        }}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isChangingPassword}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isChangingPassword ? (
                                            <>
                                                <LoadingSpinner size="sm" className="text-white" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Update Password
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
