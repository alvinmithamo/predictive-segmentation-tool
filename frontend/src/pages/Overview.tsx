import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, BarChart3, Users, TrendingUp, ArrowRight, FileText, Calendar, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import api from '../lib/api';

const quickStats = [
    { label: 'Total Analyses', value: '0', icon: <BarChart3 className="w-5 h-5" />, color: 'text-primary-400' },
    { label: 'Customers Analysed', value: '0', icon: <Users className="w-5 h-5" />, color: 'text-accent-400' },
    { label: 'Avg. Churn Risk', value: '—', icon: <TrendingUp className="w-5 h-5" />, color: 'text-yellow-400' },
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
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display text-2xl font-bold">
                    {greeting}, {user?.business_name}! 👋
                </h1>
                <p className="text-white/50 mt-1">
                    Upload your customer data to get started with AI-powered insights.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                {quickStats.map((stat) => (
                    <div key={stat.label} className="kpi-card">
                        <div className={`${stat.color} mb-1`}>{stat.icon}</div>
                        <div className="text-2xl font-bold font-display">{stat.value}</div>
                        <div className="text-white/40 text-sm">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Analyses Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="font-display text-xl font-bold">Recent Analyses</h2>
                        <p className="text-white/40 text-sm mt-1">Your latest customer segmentation reports.</p>
                    </div>
                    <Link to="/dashboard/history" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-2">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="glass-card p-8 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-white/40 mr-2" />
                        <p className="text-white/40 text-sm">Loading analyses...</p>
                    </div>
                ) : error ? (
                    <div className="glass-card p-6 flex items-center gap-3 bg-red-500/5 border border-red-500/20">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                ) : recentAnalyses.length === 0 ? (
                    <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
                        <p className="text-white/40 text-sm mb-6 max-w-sm">
                            Upload your transaction data to get started with AI-powered insights.
                        </p>
                        <Link to="/dashboard/upload" className="btn-primary px-8">
                            Upload Your First Dataset
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentAnalyses.map((analysis) => (
                            <Link
                                key={analysis.id}
                                to={analysis.status === 'done' ? `/dashboard/analysis/${analysis.id}` : '#'}
                                className={`glass-card p-4 flex items-center justify-between transition-all hover:bg-white/5 ${analysis.status !== 'done' ? 'cursor-not-allowed opacity-60' : 'hover:border-primary-500/30'}`}
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                                        <BarChart3 className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{analysis.filename}</p>
                                        <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(analysis.created_at), 'MMM d, yyyy')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {analysis.row_count.toLocaleString()} transactions
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ml-4 ${
                                    analysis.status === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
                                    analysis.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                    'bg-amber-500/10 text-amber-400'
                                }`}>
                                    {analysis.status}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Get Started CTA */}
            {recentAnalyses.length === 0 && (
                <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-primary-600/20">
                    <div>
                        <h2 className="font-display text-xl font-bold mb-2">Upload Your First Dataset</h2>
                        <p className="text-white/50 text-sm max-w-md">
                            Drop your M-Pesa statement or POS export (CSV) and we'll automatically segment your
                            customers and identify who needs attention. Takes less than 60 seconds.
                        </p>
                    </div>
                    <Link
                        to="/dashboard/upload"
                        className="btn-primary flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                    >
                        <Upload className="w-4 h-4" />
                        Upload CSV
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {/* What happens next */}
            {recentAnalyses.length === 0 && (
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                    {[
                        { step: '1', title: 'Upload CSV', desc: 'Upload your M-Pesa or POS transaction file.' },
                        { step: '2', title: 'AI Analyses', desc: 'Our RFM engine + ML models segment your customers automatically.' },
                        { step: '3', title: 'Take Action', desc: 'Get segment-specific marketing recommendations in plain language.' },
                    ].map((s) => (
                        <div key={s.step} className="glass-card p-5">
                            <div className="w-8 h-8 rounded-lg bg-primary-600/20 text-primary-400 font-bold text-sm flex items-center justify-center mb-3">
                                {s.step}
                            </div>
                            <h3 className="font-semibold mb-1">{s.title}</h3>
                            <p className="text-white/40 text-sm">{s.desc}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
