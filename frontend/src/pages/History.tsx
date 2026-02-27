import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Users, BarChart2, ChevronRight, AlertCircle, Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api';

interface AnalysisSummary {
    id: string;
    filename: string;
    status: 'pending' | 'processing' | 'done' | 'failed';
    created_at: string;
    row_count: number;
    error_message?: string;
}

export default function History() {
    const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const { data } = await api.get('/api/analysis');
                setAnalyses(data);
            } catch (err: any) {
                setError('Failed to load analysis history.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyses();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-white/40">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Loading your analyses...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="font-display text-3xl font-bold">My Analyses</h1>
                    <p className="text-white/50 mt-1">Review your past customer segmentation reports.</p>
                </div>
                <Link to="/dashboard/upload" className="btn-primary flex items-center gap-2 px-6">
                    New Analysis
                </Link>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {analyses.length === 0 ? (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
                    <p className="text-white/40 max-w-sm mb-6">
                        Upload your transaction data to get AI-powered customer segments and insights.
                    </p>
                    <Link to="/dashboard/upload" className="btn-primary px-8">
                        Upload Your First Dataset
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {analyses.map((a) => (
                        <Link
                            key={a.id}
                            to={a.status === 'done' ? `/dashboard/analysis/${a.id}` : '#'}
                            className={`glass-card p-5 group transition-all
                                ${a.status === 'done' ? 'hover:border-primary-500/40 hover:bg-white/5' : 'opacity-70 cursor-default'}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                                    ${a.status === 'done' ? 'bg-primary-600/20 text-primary-400' :
                                        a.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-white/30'}`}>
                                    {a.status === 'done' ? <BarChart2 className="w-6 h-6" /> :
                                        a.status === 'failed' ? <AlertCircle className="w-6 h-6" /> : <Clock className="w-6 h-6 animate-pulse" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg truncate group-hover:text-primary-300 transition-colors">
                                        {a.filename}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-white/40">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(new Date(a.created_at), 'MMM d, yyyy • HH:mm')}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5" />
                                            {a.row_count.toLocaleString()} transactions
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                        ${a.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            a.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                        {a.status}
                                    </div>
                                    {a.status === 'done' && (
                                        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary-400 transition-all" />
                                    )}
                                </div>
                            </div>

                            {a.status === 'failed' && a.error_message && (
                                <p className="mt-3 text-xs text-red-400/80 pl-[72px]">
                                    Error: {a.error_message}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
