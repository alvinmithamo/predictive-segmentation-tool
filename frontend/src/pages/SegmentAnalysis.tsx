import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Loader2, Target, Users, BarChart3, TrendingUp, FileText, Plus, Eye, Star, 
    ArrowUp, ArrowDown, DollarSign, Calendar, Zap, AlertTriangle, ArrowRight, ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api';
import FlowProgress from '../components/FlowProgress';

interface Segment {
    segment_id: number;
    segment_name: string;
    segment_name_sw: string;
    customer_count: number;
    avg_monetary: number;
    total_monetary: number;
    avg_recency_days: number;
    avg_frequency: number;
    revenue_share: number;
    churn_risk: 'low' | 'medium' | 'high';
    recommendation: string;
}

interface AnalysisResult {
    analysis_id: string;
    upload_id: string;
    filename: string;
    created_at: string;
    total_customers: number;
    total_revenue: number;
    avg_ltv: number;
    segments: Segment[];
    status: 'processing' | 'completed' | 'failed';
}

export default function SegmentAnalysis() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const { data } = await api.get(`/api/analysis/${id}`);
                setAnalysis(data);
            } catch (err: any) {
                console.error('Failed to load analysis:', err);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchAnalysis();
    }, [id]);

    const handleRunSegmentation = async () => {
        if (!id) return;
        setIsRunningAnalysis(true);
        try {
            const { data } = await api.post(`/api/analysis/${id}/segment`);
            setAnalysis(data);
        } catch (err: any) {
            console.error('Failed to run segmentation:', err);
        } finally {
            setIsRunningAnalysis(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Loading segmentation analysis...</p>
            </div>
        );
    }

    if (!analysis) return null;

    const getChurnRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'high': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getSegmentIcon = (segmentName: string) => {
        if (segmentName.toLowerCase().includes('champion') || segmentName.toLowerCase().includes('vip')) {
            return <Star className="w-6 h-6 text-yellow-500" />;
        } else if (segmentName.toLowerCase().includes('loyal')) {
            return <Users className="w-6 h-6 text-blue-500" />;
        } else if (segmentName.toLowerCase().includes('risk') || segmentName.toLowerCase().includes('at')) {
            return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
        } else if (segmentName.toLowerCase().includes('lost') || segmentName.toLowerCase().includes('inactive')) {
            return <TrendingUp className="w-6 h-6 text-red-500" />;
        }
        return <Target className="w-6 h-6 text-gray-500" />;
    };

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Flow Progress */}
            <FlowProgress uploadId={id} />

            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">Customer Segmentation</h1>
                    <p className="text-gray-600 text-sm">RFM analysis and customer clustering insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Export Report
                    </button>
                    {analysis.status === 'completed' && (
                        <button 
                            onClick={() => navigate(`/dashboard/analysis/${id}/predictions`)}
                            className="btn-primary flex items-center gap-2"
                        >
                            View Predictions
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6">
                {/* Analysis Status */}
                {analysis.status === 'processing' && (
                    <div className="glass-card p-6 mb-6 border-l-4 border-blue-500">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            <div>
                                <h3 className="font-bold text-lg">Running Segmentation Analysis</h3>
                                <p className="text-gray-600 text-sm">AI is analyzing your customer data and identifying segments...</p>
                            </div>
                        </div>
                    </div>
                )}

                {analysis.status === 'failed' && (
                    <div className="glass-card p-6 mb-6 border-l-4 border-red-500">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <div>
                                <h3 className="font-bold text-lg">Analysis Failed</h3>
                                <p className="text-gray-600 text-sm">There was an issue processing your data. Please try again.</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleRunSegmentation}
                            disabled={isRunningAnalysis}
                            className="btn-primary mt-4"
                        >
                            {isRunningAnalysis ? 'Retrying...' : 'Retry Analysis'}
                        </button>
                    </div>
                )}

                {/* Analysis Summary */}
                {analysis.status === 'completed' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <h3 className="font-bold text-2xl mb-1">{analysis.total_customers.toLocaleString()}</h3>
                            <p className="text-gray-600 text-sm">Total Customers</p>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="font-bold text-2xl mb-1">{analysis.segments.length}</h3>
                            <p className="text-gray-600 text-sm">Segments Identified</p>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                            <h3 className="font-bold text-2xl mb-1">KSh {(analysis.total_revenue / 1000000).toFixed(1)}M</h3>
                            <p className="text-gray-600 text-sm">Total Revenue</p>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="font-bold text-2xl mb-1">KSh {analysis.avg_ltv.toLocaleString()}</h3>
                            <p className="text-gray-600 text-sm">Avg LTV</p>
                        </div>
                    </div>
                )}

                {/* Segments Grid */}
                {analysis.status === 'completed' && analysis.segments.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {analysis.segments.map((segment) => (
                            <div key={segment.segment_id} className="glass-card p-6 border-l-4 border-green-500">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        {getSegmentIcon(segment.segment_name)}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChurnRiskColor(segment.churn_risk)}`}>
                                        {segment.churn_risk.toUpperCase()} RISK
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-2">{segment.segment_name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{segment.segment_name_sw}</p>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Customers:</span>
                                        <span className="font-semibold">{segment.customer_count.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Avg Order:</span>
                                        <span className="font-semibold">KSh {segment.avg_monetary.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Frequency:</span>
                                        <span className="font-semibold">{segment.avg_frequency.toFixed(1)}x/month</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Revenue Share:</span>
                                        <span className="font-semibold">{segment.revenue_share.toFixed(1)}%</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-600 mb-1">Recommendation:</p>
                                    <p className="text-sm text-gray-900">{segment.recommendation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(`/dashboard/validate/${id}`)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Validation
                        </button>
                        
                        {analysis.status !== 'completed' && (
                            <button 
                                onClick={handleRunSegmentation}
                                disabled={isRunningAnalysis}
                                className="btn-primary flex items-center gap-2"
                            >
                                {isRunningAnalysis ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Running Analysis...</>
                                ) : (
                                    <>Run Segmentation <Target className="w-4 h-4" /></>
                                )}
                            </button>
                        )}
                    </div>
                    
                    {analysis.status === 'completed' && (
                        <div className="text-sm text-gray-600">
                            Analysis completed: {format(new Date(analysis.created_at), 'MMM d, yyyy • h:mm a')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
