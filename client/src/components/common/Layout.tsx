import React, { type ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            {user && <Navbar />}
            <main className={user ? 'pt-16' : ''}>{children}</main>
        </div>
    );
};

export default Layout;