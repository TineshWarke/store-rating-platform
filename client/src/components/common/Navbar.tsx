import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavItems = () => {
        if (!user) return [];

        switch (user.role) {
            case 'admin':
                return [
                    { path: '/admin/dashboard', label: 'Dashboard' },
                    { path: '/admin/users', label: 'Users' },
                    { path: '/admin/stores', label: 'Stores' },
                ];
            case 'user':
                return [
                    { path: '/stores', label: 'Stores' },
                    { path: '/profile', label: 'Profile' },
                ];
            case 'storeOwner':
                return [
                    { path: '/owner/dashboard', label: 'Dashboard' },
                    { path: '/profile', label: 'Profile' },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-sm">SR</span>
                        </div>
                        <span className="font-bold text-xl text-gray-800 tracking-tight">StoreRater</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === item.path
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* User Info + Logout */}
                        <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                            <div className="flex items-center gap-2">
                                <User size={18} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full capitalize">
                                    {user?.role}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg border-t border-gray-100 animate-slide-down">
                    <div className="px-4 py-3 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-2 rounded-md text-base font-medium transition-all ${location.pathname === item.path
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Mobile User Info */}
                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <User size={18} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full capitalize">
                                    {user?.role}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-left text-red-600 hover:bg-red-50 transition"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
