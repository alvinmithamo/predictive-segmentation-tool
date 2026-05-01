import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, BarChart3, Users, TrendingUp, ArrowRight, FileText, Calendar, Loader2, AlertCircle, Search, Bell, ChevronDown, Cloud, Smartphone, MessageSquare, AlertTriangle, Target, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import api from '../lib/api';

const businessMetrics = [
    { 
        label: 'Total Customers', 
        value: '1,250', 
        change: '+12%', 
        icon: <Users className="w-5 h-5" />, 
        color: 'text-accent-400',
        trend: 'up'
    },
    { 
        label: 'Active Segments', 
        value: '5', 
        change: 'Stable', 
        icon: <Target className="w-5 h-5" />, 
        color: 'text-blue-400',
        trend: 'stable'
    },
    { 
        label: 'Avg. LTV', 
        value: 'KSh 45,000', 
        change: 'KSh 4.2k ▲',
        subtitle: 'Estimated for next 6 months',
        icon: <TrendingUp className="w-5 h-5" />, 
        color: 'text-primary-400',
        trend: 'up'
    },
    { 
        label: 'Churn Rate', 
        value: '12%', 
        change: '-2%', 
        subtitle: 'Critical, +48 risk customers',
        icon: <AlertTriangle className="w-5 h-5" />, 
        color: 'text-yellow-400',
        trend: 'down'
    },
];

const recentInsights = [
    {
        title: 'Churn Risk Alert',
        time: '2 hours ago',
        source: 'Retention AI',
        type: 'alert',
        icon: <AlertTriangle className="w-4 h-4" />
    },
    {
        title: 'New "Loyal" Segment',
        time: 'Yesterday',
        source: 'Segmentation',
        type: 'success',
        icon: <Users className="w-4 h-4" />
    },
    {
        title: 'SMS Campaign ROI',
        time: '2 days ago',
        source: 'Campaigns',
        type: 'info',
        icon: <MessageSquare className="w-4 h-4" />
    },
];

interface AnalysisSummary {
    id: string;
    filename: string;
    status: 'pending' | 'processing' | 'done' | 'failed';
    created_at: string;
    row_count: number;
    error_message?: string;
}

export default function Overview() {
    const { user } = useAuth();
    const [recentAnalyses, setRecentAnalyses] = useState<AnalysisSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const { data } = await api.get('/api/analysis');
                setRecentAnalyses(data.slice(0, 5));
            } catch (err) {
                setError('Failed to load recent analyses.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyses();
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Habari za asubuhi' : hour < 17 ? 'Habari za mchana' : 'Habari za jioni';

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">Business Overview</h1>
                    <p className="text-gray-600 text-sm">Real-time performance metrics and predictive growth insights</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search analytics..."
                            className="bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full"></span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.business_name || 'Achieng Nyong\'o'}</p>
                            <p className="text-xs text-gray-600">OWNER</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-700 font-bold text-sm">
                                {(user?.business_name || 'AN').charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Business Overview Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="font-display text-2xl font-bold mb-2">{greeting}, {user?.business_name || 'Achieng\'s Fashion'}!</h2>
                        <p className="text-gray-600">Here's what's happening with your business today</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="btn-secondary flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Export Report
                        </button>
                        <button className="btn-primary flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            + New Campaign
                        </button>
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {businessMetrics.map((metric, index) => (
                        <div key={index} className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${metric.color}`}>{metric.icon}</div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    metric.trend === 'up' ? 'bg-accent-500/10 text-accent-400' :
                                    metric.trend === 'down' ? 'bg-red-500/10 text-red-400' :
                                    'bg-blue-500/10 text-blue-400'
                                }`}>
                                    {metric.change}
                                </span>
                            </div>
                            <div className="text-2xl font-bold font-display mb-1">{metric.value}</div>
                            <div className="text-gray-600 text-sm font-medium mb-1">{metric.label}</div>
                            {metric.subtitle && (
                                <div className="text-gray-400 text-xs">{metric.subtitle}</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Ingest Data Section */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-2">Ingest Data</h3>
                            <p className="text-gray-600 text-sm mb-6">Import your sales and customer records</p>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">M-PESA POS</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">ERP CONNECTED</span>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500/50 transition-colors cursor-pointer">
                                <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h4 className="font-semibold text-gray-900 mb-2">Drop your customer CSV here</h4>
                                <p className="text-gray-600 text-sm mb-4">Compatible with M-Pesa statements, Tilley reports, and Shopify exports</p>
                                <button className="btn-primary">Browse Files</button>
                            </div>

                            <p className="text-gray-400 text-xs mt-4 text-center">
                                Your data is encrypted and processed locally within Kenya's jurisdiction
                            </p>
                        </div>
                    </div>

                    {/* Recent Insights Section */}
                    <div>
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg">Recent Insights</h3>
                                <Link to="/dashboard/history" className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1">
                                    View All Activity
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {recentInsights.map((insight, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                            insight.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                                            insight.type === 'success' ? 'bg-accent-500/20 text-accent-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {insight.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 mb-1">{insight.title}</p>
                                            <p className="text-xs text-gray-600">{insight.time} • {insight.source}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Automate Retention Section */}
                <div className="mt-6">
                    <div className="glass-card p-8 bg-gradient-to-r from-green-50 to-transparent border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-green-600" />
                                    Automate Retention
                                </h3>
                                <p className="text-gray-600">Set up AI triggers to win back customers automatically</p>
                            </div>
                            <button className="btn-primary flex items-center gap-2">
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
