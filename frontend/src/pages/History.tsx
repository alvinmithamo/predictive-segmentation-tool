import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2, Plus, Upload, RefreshCw, Eye, TrendingUp, Target, ArrowUp } from 'lucide-react';
import { format } from 'date-fns';
// import api from '../lib/api';

interface AnalysisSummary {
    id: string;
    filename: string;
    status: 'pending' | 'processing' | 'done' | 'failed';
    created_at: string;
    row_count: number;
    error_message?: string;
    segments_identified?: number;
    coverage?: string;
    thumbnail?: string;
}

export default function History() {
    const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);
    const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);

    // Mock data for saved analyses
    const mockAnalyses = [
        {
            id: '1',
            filename: 'Q3 Harvest Surge',
            status: 'done' as const,
            created_at: '2024-03-15T10:30:00Z',
            row_count: 2847,
            segments_identified: 5,
            coverage: '87%',
            thumbnail: '📊'
        },
        {
            id: '2',
            filename: 'Loyalty Churn Audit',
            status: 'done' as const,
            created_at: '2024-02-28T14:20:00Z',
            row_count: 1923,
            segments_identified: 4,
            coverage: '92%',
            thumbnail: '🎯'
        },
        {
            id: '3',
            filename: 'Mid-Year Bulk Sales',
            status: 'done' as const,
            created_at: '2024-01-10T09:15:00Z',
            row_count: 3562,
            segments_identified: 6,
            coverage: '78%',
            thumbnail: '📈'
        },
        {
            id: '4',
            filename: 'Baseline Performance',
            status: 'done' as const,
            created_at: '2023-12-05T16:45:00Z',
            row_count: 1234,
            segments_identified: 3,
            coverage: '95%',
            thumbnail: '⚡'
        },
    ];

    // Mock comparison results
    const comparisonResults = [
        {
            id: 'comp1',
            analysis_pair: 'Q3 Harvest Surge vs Loyalty Churn Audit',
            comparison_date: '2024-03-20',
            growth_delta: '+15.3%',
            status: 'completed'
        },
        {
            id: 'comp2',
            analysis_pair: 'Mid-Year Bulk Sales vs Baseline Performance',
            comparison_date: '2024-02-15',
            growth_delta: '+8.7%',
            status: 'completed'
        },
    ];

    useEffect(() => {
        // Use mock data for now
        setAnalyses(mockAnalyses);
        setIsLoading(false);
    }, []);

    const toggleAnalysisSelection = (analysisId: string) => {
        setSelectedAnalyses(prev => {
            if (prev.includes(analysisId)) {
                return prev.filter(id => id !== analysisId);
            } else if (prev.length < 2) {
                return [...prev, analysisId];
            }
            return prev;
        });
    };

    const executeComparison = () => {
        if (selectedAnalyses.length === 2) {
            // Navigate to comparison page or show comparison modal
            console.log('Comparing analyses:', selectedAnalyses);
        }
    };

    // useEffect(() => {
    //     const fetchAnalyses = async () => {
    //         try {
    //             const { data } = await api.get('/api/analysis');
    //             setAnalyses(data);
    //         } catch (err: any) {
    //             setError('Failed to load analysis history.');
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchAnalyses();
    // }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Loading your analyses...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">Saved Analyses</h1>
                    <p className="text-gray-600 text-sm">Analysis History</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Analysis
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* History Management Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-2xl font-bold">Analysis History</h2>
                        <div className="flex items-center gap-3">
                            <button className="btn-secondary flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Compare ({selectedAnalyses.length}/2 Selected)
                            </button>
                            <button 
                                onClick={executeComparison}
                                disabled={selectedAnalyses.length !== 2}
                                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Execute Comparison
                            </button>
                        </div>
                    </div>

                    {/* Analysis Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Run New Analysis Card */}
                        <div className="glass-card p-6 border-2 border-dashed border-gray-300 hover:border-green-500/50 transition-colors cursor-pointer group">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                                    <Upload className="w-8 h-8 text-green-700" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Run New Analysis</h3>
                                <p className="text-gray-600 text-sm mb-4">Upload transaction history to create new segments</p>
                                <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                                    Get Started <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* Analysis Cards */}
                        {analyses.map((analysis) => (
                            <div 
                                key={analysis.id}
                                className={`glass-card p-6 hover:bg-gray-50 transition-all cursor-pointer ${
                                    selectedAnalyses.includes(analysis.id) ? 'ring-2 ring-green-500 bg-green-50' : ''
                                }`}
                                onClick={() => toggleAnalysisSelection(analysis.id)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                                        {analysis.thumbnail}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            Complete
                                        </span>
                                        {selectedAnalyses.includes(analysis.id) && (
                                            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <h3 className="font-semibold text-gray-900 mb-2">{analysis.filename}</h3>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Date:</span>
                                        <span className="text-gray-900">{format(new Date(analysis.created_at), 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Segments:</span>
                                        <span className="text-gray-900">{analysis.segments_identified}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Coverage:</span>
                                        <span className="text-gray-900">{analysis.coverage}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1">
                                        <RefreshCw className="w-3 h-3" />
                                        Reload
                                    </button>
                                    <Link 
                                        to={`/dashboard/analysis/${analysis.id}`}
                                        className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Eye className="w-3 h-3" />
                                        Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Comparison Results Section */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Recent Comparison Results
                        </h3>
                        <Link to="/dashboard/comparisons" className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1">
                            View All Comparisons
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Analysis Pairing</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Comparison Date</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Growth Delta</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {comparisonResults.map((result) => (
                                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-green-600" />
                                                <span className="text-gray-900">{result.analysis_pair}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-900">{format(new Date(result.comparison_date), 'MMM d, yyyy')}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-green-600 font-medium flex items-center gap-1">
                                                <ArrowUp className="w-3 h-3" />
                                                {result.growth_delta}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                                                Open Report
                                                <ChevronRight className="w-3 h-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
