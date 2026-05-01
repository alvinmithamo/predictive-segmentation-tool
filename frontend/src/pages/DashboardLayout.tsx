import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    BarChart3, Settings, LogOut, ChevronRight, Target, Upload, MessageSquare, Menu, X, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/dashboard', label: 'Overview', icon: <BarChart3 className="w-4 h-4" />, exact: true },
    { path: '/dashboard/upload', label: 'Upload', icon: <Upload className="w-4 h-4" /> },
    { path: '/dashboard/segmentation', label: 'Segmentation', icon: <Target className="w-4 h-4" /> },
    { path: '/dashboard/history', label: 'History', icon: <MessageSquare className="w-4 h-4" /> },
    { path: '/dashboard/predictions', label: 'Predictions', icon: <TrendingUp className="w-4 h-4" /> },
    { path: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-surface-50 flex">
            {/* Mobile menu button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900"
            >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                {/* Logo */}
                <div className="h-16 flex items-center gap-2 px-5 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display font-bold text-gray-900">GrowthEngine KE</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    <p className="section-label mt-1">Navigation</p>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {isActive(item.path, item.exact) && <ChevronRight className="ml-auto w-4 h-4" />}
                        </Link>
                    ))}
                </nav>

                {/* User info + logout */}
                <div className="p-3 border-t border-gray-200">
                    <div className="glass-card p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                            {user?.business_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.business_name || 'Achieng\'s Fashion'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email || 'OWNER'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Sign out"
                            className="text-gray-400 hover:text-green-600 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center"> 2026 GrowthEngine Kenya. Built for SME resilience.</p>
                        <div className="flex justify-center gap-4 mt-2">
                            <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">Privacy</button>
                            <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">Terms</button>
                            <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">M-Pesa Guide</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className="flex-1 min-h-screen lg:ml-0">
                <div className="pt-16 lg:pt-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
