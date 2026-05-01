import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Users, TrendingUp, AlertTriangle, ArrowLeft, Calendar, FileText,
    CheckCircle2, Loader2, Target, BarChart3, Activity, Zap, Clock, DollarSign, Star, ArrowUp, ArrowDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import api from '../lib/api';

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

interface AnalysisDetail {
    analysis_id: string;
    filename: string;
    created_at: string;
    total_customers: number;
    total_revenue: number;
    avg_ltv: number;
    churn_risk_count: number;
    segments: Segment[];
    date_range: { start: string; end: string };
    segment_chart_data: { name: string; value: number }[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function SegmentsView() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<AnalysisDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: result } = await api.get(`/api/analysis/${id}`);
                setData(result);
            } catch (err: any) {
                console.error('Failed to load analysis details:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Loading segments...</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">SEGMENTATION</h1>
                    <p className="text-gray-600 text-sm">Customer Clustering Analysis</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Export Report
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Run New Analysis
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* RFM Scores Section */}
                <div className="glass-card p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        Recency, Frequency, Monetary (RFM) Scores
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600 text-sm">Recency Score</span>
                                <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold mb-1 text-gray-900">8.2/10</div>
                            <div className="text-xs text-green-600 flex items-center gap-1">
                                <ArrowUp className="w-3 h-3" />
                                +2.3 from last analysis
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600 text-sm">Frequency Score</span>
                                <Activity className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold mb-1 text-gray-900">7.5/10</div>
                            <div className="text-xs text-green-600 flex items-center gap-1">
                                <ArrowUp className="w-3 h-3" />
                                +1.8 from last analysis
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600 text-sm">Monetary Score</span>
                                <DollarSign className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="text-2xl font-bold mb-1 text-gray-900">9.1/10</div>
                            <div className="text-xs text-red-600 flex items-center gap-1">
                                <ArrowDown className="w-3 h-3" />
                                -0.5 from last analysis
                            </div>
                        </div>
                    </div>
                </div>

                {/* K-Means Clustering and Segment Sizes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* K-Means Customer Clustering */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-600" />
                            K-Means Customer Clustering
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart data={data.segments}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="avg_recency_days" stroke="#6b7280" fontSize={12} />
                                    <YAxis dataKey="avg_frequency" stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                                        itemStyle={{ color: '#111827' }}
                                    />
                                    <Scatter dataKey="customer_count" fill="#8884d8">
                                        {data.segments.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-gray-400 text-xs mt-4 text-center">
                            Clustering based on recency vs frequency patterns
                        </p>
                    </div>

                    {/* Segment Sizes */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            Segment Sizes
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.segment_chart_data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {data.segment_chart_data.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#0a0a0b', border: '1px solid #27272a', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {data.segment_chart_data.map((segment, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-gray-600">{segment.name}:</span>
                                    <span className="text-gray-900 font-medium">{segment.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Distribution Trends */}
                <div className="glass-card p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Distribution Trends
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { month: 'Jan', high: 120, medium: 180, low: 250 },
                                { month: 'Feb', high: 135, medium: 195, low: 220 },
                                { month: 'Mar', high: 150, medium: 210, low: 190 },
                                { month: 'Apr', high: 165, medium: 225, low: 160 },
                                { month: 'May', high: 180, medium: 240, low: 140 },
                                { month: 'Jun', high: 195, medium: 255, low: 120 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                                    itemStyle={{ color: '#111827' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={2} name="High Value" />
                                <Line type="monotone" dataKey="medium" stroke="#f59e0b" strokeWidth={2} name="Medium Value" />
                                <Line type="monotone" dataKey="low" stroke="#10b981" strokeWidth={2} name="Low Value" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Segment Analysis */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-green-600" />
                        Detailed Segment Analysis
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Segment</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customers</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Recency</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Frequency</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Monetary</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Churn Risk</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Key Traits</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.segments.map((segment, idx) => (
                                    <tr key={segment.segment_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">{segment.segment_name}</p>
                                                    <p className="text-xs text-green-600 italic">{segment.segment_name_sw}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-medium text-gray-900">{segment.customer_count.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-gray-900">{segment.avg_recency_days} days</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-gray-900">{segment.avg_frequency.toFixed(1)}x</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-medium text-gray-900">KSh {Math.round(segment.avg_monetary).toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                segment.churn_risk === 'low' ? 'bg-green-500/10 text-green-400' :
                                                segment.churn_risk === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-red-500/10 text-red-400'
                                            }`}>
                                                {segment.churn_risk}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {segment.recommendation.split(',').slice(0, 2).map((trait, i) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                                                        {trait.trim()}
                                                    </span>
                                                ))}
                                            </div>
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
