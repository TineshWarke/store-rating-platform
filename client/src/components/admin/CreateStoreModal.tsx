import React, { useState, useEffect } from 'react';
import { X, Store, Mail, MapPin, User } from 'lucide-react';
import { storesAPI, usersAPI } from '../../services/api';
import type { User as UserType } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface CreateStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStoreCreated: () => void;
}

const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

const CreateStoreModal: React.FC<CreateStoreModalProps> = ({ isOpen, onClose, onStoreCreated }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOwners, setIsLoadingOwners] = useState(false);
    const [error, setError] = useState('');
    const [storeOwners, setStoreOwners] = useState<UserType[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        ownerId: '',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            // reset state when modal opens
            setError('');
            setValidationErrors({});
            setFormData({ name: '', email: '', address: '', ownerId: '' });
            fetchStoreOwners();
        }
    }, [isOpen]);

    const fetchStoreOwners = async () => {
        setIsLoadingOwners(true);
        try {
            // The usersAPI may return an object like { users: [...] } or an array directly.
            const resp: any = await usersAPI.getAllUsers?.({ role: 'storeOwner', limit: 100 }) ?? [];
            // try several possible shapes
            const owners = Array.isArray(resp)
                ? resp
                : Array.isArray(resp.users)
                    ? resp.users
                    : Array.isArray(resp.data)
                        ? resp.data
                        : (resp.users ?? resp.data ?? []);
            setStoreOwners(owners);
        } catch (err) {
            console.error('Failed to fetch store owners:', err);
            setStoreOwners([]);
        } finally {
            setIsLoadingOwners(false);
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (formData.name.trim().length < 20 || formData.name.trim().length > 60) {
            errors.name = 'Store name must be between 20-60 characters';
        }

        if (formData.address.trim().length > 400) {
            errors.address = 'Address must not exceed 400 characters';
        }

        if (!formData.ownerId) {
            errors.ownerId = 'Please select a store owner';
        } else if (!isValidObjectId(formData.ownerId)) {
            errors.ownerId = 'Selected owner id is invalid';
        }

        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Ensure we send only the required fields in expected format
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
                ownerId: formData.ownerId.trim(),
            };

            await storesAPI.createStore(payload);
            onStoreCreated();
            // Reset form and close modal for better UX
            setFormData({ name: '', email: '', address: '', ownerId: '' });
            onClose();
        } catch (err: any) {
            console.error('Create store error:', err);
            // Prioritize API message then fallback
            const msg = err?.response?.data?.message
                || (err?.response?.data?.errors ? JSON.stringify(err.response.data.errors) : null)
                || 'Failed to create store';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Create New Store</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Store Name <span className="text-gray-500 text-xs">(20-60 characters)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Store className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${validationErrors.name ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Enter store name"
                                />
                            </div>
                            {validationErrors.name && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Store Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${validationErrors.email ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Enter store email"
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Store Address <span className="text-gray-500 text-xs">(max 400 characters)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    id="address"
                                    name="address"
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${validationErrors.address ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none`}
                                    placeholder="Enter store address"
                                />
                            </div>
                            {validationErrors.address && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.address.length}/400 characters
                            </p>
                        </div>

                        <div>
                            <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">
                                Store Owner
                            </label>
                            {isLoadingOwners ? (
                                <div className="flex items-center justify-center py-3">
                                    <LoadingSpinner size="sm" />
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="ownerId"
                                        name="ownerId"
                                        value={formData.ownerId}
                                        onChange={handleChange}
                                        className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${validationErrors.ownerId ? 'border-red-300' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    >
                                        <option value="">Select store owner</option>
                                        {storeOwners.map((owner: any) => {
                                            // accept multiple id shapes
                                            const id = owner._id ?? owner.id ?? owner._id_str ?? owner.uid;
                                            return (
                                                <option key={id} value={id}>
                                                    {owner.name ?? owner.username ?? owner.fullName} - {owner.email}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            )}
                            {validationErrors.ownerId && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.ownerId}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => { onClose(); }}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <LoadingSpinner size="sm" className="text-white mr-2" />
                                    Creating...
                                </div>
                            ) : (
                                'Create Store'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStoreModal;
