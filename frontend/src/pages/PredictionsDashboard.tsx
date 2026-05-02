import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Loader2, TrendingUp, AlertTriangle, Target, BarChart3, Users, Zap, FileText, Activity
} from 'lucide-react';
// import api from '../lib/api';

interface AnalysisSummary {
    id: string;
    filename: string;
    status: 'pending' | 'processing' | 'done' | 'failed';
    created_at: string;
    row_count: number;
    segments_identified?: number;
    coverage?: string;
}

export default function PredictionsDashboard() {
    const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data for completed analyses
    const mockAnalyses = [
        {
            id: '1',
            filename: 'Q3 Harvest Surge',
            status: 'done' as const,
            created_at: '2024-03-15T10:30:00Z',
            row_count: 2847,
            segments_identified: 5,
            coverage: '87%'
        },
        {
            id: '2',
            filename: 'Loyalty Churn Audit',
            status: 'done' as const,
            created_at: '2024-02-28T14:20:00Z',
            row_count: 1923,
            segments_identified: 4,
            coverage: '92%'
        },
        {
            id: '3',
            filename: 'Mid-Year Bulk Sales',
            status: 'done' as const,
            created_at: '2024-01-10T09:15:00Z',
            row_count: 3562,
            segments_identified: 6,
            coverage: '78%'
        },
    ];

    useEffect(() => {
        // Use mock data for now
        setAnalyses(mockAnalyses);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Loading predictions...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">Retention AI Predictions</h1>
                    <p className="text-gray-600 text-sm">Forecasting churn probability and customer lifetime value</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Export Report
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Run Prediction Model
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* Select Analysis for Predictions */}
                <div className="glass-card p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Select Analysis for Predictions
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                        Choose a completed analysis to view retention AI predictions and insights
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analyses.map((analysis) => (
                            <Link
                                key={analysis.id}
                                to={`/dashboard/analysis/${analysis.id}/predictions`}
                                className="glass-card p-6 hover:bg-gray-50 transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                        Complete
                                    </span>
                                </div>
                                
                                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                    {analysis.filename}
                                </h3>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Segments:</span>
                                        <span className="text-gray-900">{analysis.segments_identified}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Coverage:</span>
                                        <span className="text-gray-900">{analysis.coverage}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Records:</span>
                                        <span className="text-gray-900">{analysis.row_count.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                    View Predictions
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Target className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Active Analyses</h4>
                                <p className="text-gray-600 text-sm">Ready for predictions</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{analyses.length}</div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Total Customers</h4>
                                <p className="text-gray-600 text-sm">Across all analyses</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {analyses.reduce((sum, a) => sum + a.row_count, 0).toLocaleString()}
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Avg Segments</h4>
                                <p className="text-gray-600 text-sm">Per analysis</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {analyses.length > 0 ? Math.round(analyses.reduce((sum, a) => sum + (a.segments_identified || 0), 0) / analyses.length) : 0}
                        </div>
                    </div>
                </div>

                {/* Getting Started */}
                <div className="glass-card p-6 bg-gradient-to-r from-green-600/10 to-transparent border-green-600/20">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-green-600" />
                        Getting Started with Predictions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">Select a completed analysis from above to view detailed predictions</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">View churn probability forecasts and customer lifetime value predictions</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">Analyze cohort retention patterns and loyalty drivers</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">Export detailed reports for strategic planning</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
