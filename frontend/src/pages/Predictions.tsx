import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Loader2, TrendingUp,
    AlertTriangle, Zap, FileText, Activity, Target, BarChart3, Users, AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
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
}


export default function PredictionsInsights() {
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
                <p>Loading predictions...</p>
            </div>
        );
    }

    if (!data) return null;


    return (
        <div className="min-h-screen bg-surface-50">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">Retention AI Predictions</h1>
                    <p className="text-gray-600 text-sm">Forecasting churn probability and customer lifetime value using transaction history</p>
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
                {/* Churn Probability Forecast */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                Churn Probability Forecast
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">AI-powered prediction of customer churn over the next 8 weeks</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium">
                            High Alert: 12% increase
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { week: 'Week 1', prediction: 8, baseline: 5 },
                                { week: 'Week 2', prediction: 12, baseline: 7 },
                                { week: 'Week 3', prediction: 18, baseline: 10 },
                                { week: 'Week 4', prediction: 25, baseline: 14 },
                                { week: 'Week 5', prediction: 32, baseline: 18 },
                                { week: 'Week 6', prediction: 38, baseline: 22 },
                                { week: 'Week 7', prediction: 42, baseline: 25 },
                                { week: 'Week 8', prediction: 45, baseline: 28 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                                    itemStyle={{ color: '#111827' }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="prediction" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    name="Retention AI Prediction"
                                    dot={{ fill: '#10b981', r: 4 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="baseline" 
                                    stroke="#ef4444" 
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    name="Baseline Churn"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
                        <span>Week 1</span>
                        <span>Week 4 (Today)</span>
                        <span>Week 8 (Projected)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Loyalty Drivers */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-green-600" />
                            Loyalty Drivers
                        </h3>
                        <div className="space-y-4">
                            {[
                                { factor: 'M-Pesa Habitual use', impact: '+42%', color: 'text-green-600', bg: 'bg-green-100' },
                                { factor: 'Weekend Bulk Purchase', impact: '+18%', color: 'text-blue-600', bg: 'bg-blue-100' },
                                { factor: 'Price Sensitivity', impact: '-24%', color: 'text-red-600', bg: 'bg-red-100' },
                                { factor: 'Last-Mile Interaction', impact: '+9%', color: 'text-yellow-600', bg: 'bg-yellow-100' },
                            ].map((driver, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${driver.bg} flex items-center justify-center`}>
                                            <BarChart3 className={`w-4 h-4 ${driver.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-medium text-sm">{driver.factor}</p>
                                            <p className="text-gray-600 text-xs">Key loyalty factor</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${driver.color}`}>{driver.impact}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-900 text-sm font-medium mb-1">💡 Recommendation</p>
                            <p className="text-gray-600 text-xs">Encourage M-Pesa automated payments to boost retention by 15%</p>
                        </div>
                    </div>

                    {/* Predicted LTV by Segment */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Predicted LTV by Segment (KSh)
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { segment: 'High Spenders', ltv: 125000 },
                                    { segment: 'Loyal', ltv: 85000 },
                                    { segment: 'Occasional', ltv: 35000 },
                                    { segment: 'New Entrants', ltv: 15000 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="segment" stroke="#6b7280" fontSize={11} angle={-45} textAnchor="end" />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                                        itemStyle={{ color: '#111827' }}
                                    />
                                    <Bar dataKey="ltv" fill="#6366f1" radius={[6, 6, 0, 0]}>
                                        {['#6366f1', '#10b981', '#f59e0b', '#ef4444'].map((color, index) => (
                                            <Cell key={`cell-${index}`} fill={color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Churn Risk Heat Map */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-green-600" />
                            Churn Risk Heat Map
                        </h3>
                        <div className="grid grid-cols-8 gap-1 mb-4">
                            {Array.from({ length: 64 }, (_, i) => {
                                const risk = Math.random();
                                let colorClass = 'bg-green-500/20';
                                if (risk > 0.7) colorClass = 'bg-red-500/40';
                                else if (risk > 0.4) colorClass = 'bg-yellow-500/30';
                                
                                return (
                                    <div
                                        key={i}
                                        className={`aspect-square rounded ${colorClass} ${i === 35 ? 'ring-2 ring-red-500' : ''}`}
                                        title={i === 35 ? 'CHURN ZONE' : `Risk: ${(risk * 100).toFixed(0)}%`}
                                    >
                                        {i === 35 && (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-red-400">
                                                ⚠
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Recency (Short → Long)</span>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-100 rounded"></div>
                                <span>Low Risk</span>
                                <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                                <span>Medium</span>
                                <div className="w-3 h-3 bg-red-100 rounded"></div>
                                <span>High Risk</span>
                            </div>
                        </div>
                    </div>

                    {/* Cohort Retention Analysis */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            Cohort Retention Analysis
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left px-2 py-1 text-gray-600 font-semibold">Cohort Month</th>
                                        <th className="text-center px-2 py-1 text-gray-600 font-semibold">users</th>
                                        <th className="text-center px-2 py-1 text-gray-600 font-semibold">Month 1</th>
                                        <th className="text-center px-2 py-1 text-gray-600 font-semibold">Month 2</th>
                                        <th className="text-center px-2 py-1 text-gray-600 font-semibold">Month 3</th>
                                        <th className="text-center px-2 py-1 text-gray-600 font-semibold">Month 4</th>
                                        <th className="text-center px-2 py-1 text-gray-600 font-semibold">Month 5</th>
                                        <th className="text-center px-2 py-1 text-gray-600 font-semibold">Month 6</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { cohort: 'Jan 2024', users: 245, data: [245, 200, 180, 165, 150, 140, 130] },
                                        { cohort: 'Feb 2024', users: 312, data: [312, 265, 240, 220, 200, 185, null] },
                                        { cohort: 'Mar 2024', users: 289, data: [289, 250, 225, 205, 190, null, null] },
                                        { cohort: 'Apr 2024', users: 356, data: [356, 310, 280, 255, null, null, null] },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="px-2 py-1 text-gray-900">{row.cohort}</td>
                                            <td className="px-2 py-1 text-center text-gray-900">{row.users}</td>
                                            {row.data.map((value, colIdx) => {
                                                if (value === null || row.data[0] === null) {
                                                    return <td key={colIdx} className="px-2 py-1 text-center text-gray-400">—</td>;
                                                }
                                                const retention = (value / row.data[0]) * 100;
                                                const bgColor = retention >= 80 ? 'bg-green-100 text-green-600' : 
                                                                 retention >= 60 ? 'bg-yellow-100 text-yellow-600' : 
                                                                 'bg-red-100 text-red-600';
                                                return (
                                                    <td key={colIdx} className={`px-2 py-1 text-center ${bgColor} font-medium`}>
                                                        {retention.toFixed(0)}%
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="glass-card p-6 bg-gradient-to-r from-green-600/10 to-transparent border-green-600/20">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-green-600" />
                        Key Predictions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">Churn risk expected to increase by 12% over next 8 weeks</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">High-value customers show 89% retention probability</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">M-Pesa usage correlates with 42% higher loyalty</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">Weekend purchasers have 18% better retention</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
