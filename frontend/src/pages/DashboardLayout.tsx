import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    BarChart3, Upload, History, Settings, LogOut, LayoutDashboard, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PredictionsInsights from './Predictions';

const navItems = [
    { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
    { path: '/dashboard/upload', label: 'Upload Data', icon: <Upload className="w-4 h-4" /> },
    { path: '/dashboard/history', label: 'My Analyses', icon: <History className="w-4 h-4" /> },
    { path: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { path: '/dashboard/predictions', label: 'Predictions', icon: <PredictionsInsights /> },
];

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-surface-950 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface-900 border-r border-white/5 flex flex-col fixed h-full">
                {/* Logo */}
                <div className="h-16 flex items-center gap-2 px-5 border-b border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="font-display font-bold">SME Predictor</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    <p className="section-label mt-1">Navigation</p>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {isActive(item.path, item.exact) && (
                                <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User info + logout */}
                <div className="p-3 border-t border-white/5">
                    <div className="glass-card p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center text-primary-400 font-bold text-sm flex-shrink-0">
                            {user?.business_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.business_name}</p>
                            <p className="text-xs text-white/40 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Sign out"
                            className="text-white/30 hover:text-primary-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="ml-64 flex-1 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
