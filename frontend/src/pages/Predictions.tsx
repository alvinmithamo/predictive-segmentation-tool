import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle2, Loader2, FileText, Calendar, TrendingUp,
    AlertTriangle, Zap, Info
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

// Dummy data for predictions (in production, this would come from the backend ML models)
const generateChurnRiskCurve = () => [
    { month: 'Month 1', churn_rate: 5 },
    { month: 'Month 2', churn_rate: 8 },
    { month: 'Month 3', churn_rate: 12 },
    { month: 'Month 4', churn_rate: 18 },
    { month: 'Month 5', churn_rate: 25 },
    { month: 'Month 6', churn_rate: 32 },
];

const generateLTVData = (segments: Segment[]) => 
    segments.map(s => ({
        name: s.segment_name,
        '12-month': Math.round(s.avg_monetary * 12 * (1 + Math.random() * 0.3)),
        '24-month': Math.round(s.avg_monetary * 24 * (1 + Math.random() * 0.5)),
    }));

const generateCohortTable = () => [
    { cohort: 'Jan 2024', m0: 100, m1: 82, m2: 71, m3: 61, m4: 54, m5: 48 },
    { cohort: 'Feb 2024', m0: 120, m1: 95, m2: 81, m3: 71, m4: 63, m5: null },
    { cohort: 'Mar 2024', m0: 150, m1: 112, m2: 96, m3: 85, m4: null, m5: null },
    { cohort: 'Apr 2024', m0: 130, m1: 104, m2: 91, m3: null, m4: null, m5: null },
    { cohort: 'May 2024', m0: 145, m1: 113, m2: null, m3: null, m4: null, m5: null },
];

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
            <div className="flex flex-col items-center justify-center p-20 text-white/40">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Loading predictions...</p>
            </div>
        );
    }

    if (!data) return null;

    const churnRiskCurve = generateChurnRiskCurve();
    const ltvData = generateLTVData(data.segments);
    const cohortTable = generateCohortTable();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link to={`/dashboard/analysis/${id}`} className="text-white/40 hover:text-white text-sm flex items-center gap-2 mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Analysis
                    </Link>
                    <h1 className="font-display text-3xl font-bold flex items-center gap-3">
                        Predictions & Insights
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </h1>
                    <p className="text-white/40 text-sm mt-2">ML-powered forecasts and behavioral analytics</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <p className="text-white/50 text-sm font-semibold">Predicted Churn Rate (6M)</p>
                    </div>
                    <p className="text-3xl font-bold">32%</p>
                    <p className="text-xs text-red-400 mt-2">↑ 2% from baseline</p>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <p className="text-white/50 text-sm font-semibold">Avg 12-Month LTV</p>
                    </div>
                    <p className="text-3xl font-bold">KSh {Math.round(data.avg_ltv * 12).toLocaleString()}</p>
                    <p className="text-xs text-emerald-400 mt-2">Potential revenue per customer</p>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center">
                            <Zap className="w-5 h-5" />
                        </div>
                        <p className="text-white/50 text-sm font-semibold">Highest Value Segment</p>
                    </div>
                    <p className="text-lg font-bold">{data.segments[0]?.segment_name || 'N/A'}</p>
                    <p className="text-xs text-primary-400 mt-2">{data.segments[0]?.revenue_share.toFixed(1)}% of total revenue</p>
                </div>
            </div>

            {/* Churn Risk Over Time */}
            <div className="glass-card p-8">
                <div className="mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Churn Risk Trajectory
                    </h3>
                    <p className="text-white/40 text-sm mt-1">
                        Predicted percentage of customers likely to churn over the next 6 months
                    </p>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={churnRiskCurve}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="month" stroke="#52525b" fontSize={12} />
                            <YAxis stroke="#52525b" fontSize={12} />
                            <Tooltip
                                contentStyle={{ background: '#0a0a0b', border: '1px solid #27272a', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="churn_rate" 
                                stroke="#ef4444" 
                                strokeWidth={3}
                                dot={{ fill: '#ef4444', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* LTV Predictions */}
            <div className="glass-card p-8">
                <div className="mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Customer Lifetime Value Projections
                    </h3>
                    <p className="text-white/40 text-sm mt-1">
                        Estimated total revenue per customer over 12 and 24 months
                    </p>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ltvData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={12} />
                            <YAxis stroke="#52525b" fontSize={12} />
                            <Tooltip
                                contentStyle={{ background: '#0a0a0b', border: '1px solid #27272a', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="12-month" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="24-month" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Cohort Retention Table */}
            <div className="glass-card p-8">
                <div className="mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Cohort Retention Analysis
                    </h3>
                    <p className="text-white/40 text-sm mt-1">
                        Percentage of customers retained by acquisition month
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase">Cohort</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-white/50 uppercase">M0</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-white/50 uppercase">M1</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-white/50 uppercase">M2</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-white/50 uppercase">M3</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-white/50 uppercase">M4</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-white/50 uppercase">M5</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {cohortTable.map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 font-semibold">{row.cohort}</td>
                                    {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5].map((value, colIdx) => {
                                        const percentage = value ? (value / row.m0) * 100 : 0;
                                        return (
                                            <td key={colIdx} className="px-4 py-3 text-center">
                                                {value !== null ? (
                                                    <div className="relative">
                                                        <div 
                                                            className="absolute inset-0 bg-emerald-500/20 rounded transition-all"
                                                            style={{ opacity: percentage / 100 }}
                                                        />
                                                        <span className="relative font-semibold">
                                                            {percentage.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-white/20">—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-white/40 mt-4">
                    <strong>Legend:</strong> M0 = Month of signup, M1 = 1 month after signup, etc.
                    Darker green indicates higher retention rate.
                </p>
            </div>

            {/* Feature Importance */}
            <div className="glass-card p-8">
                <div className="mb-6">
                    <h3 className="text-xl font-bold">Top Predictive Factors</h3>
                    <p className="text-white/40 text-sm mt-1">
                        What matters most when predicting customer behavior
                    </p>
                </div>
                <div className="space-y-4">
                    {[
                        { factor: 'Recency (Days since last purchase)', importance: 85, impact: 'Critical' },
                        { factor: 'Purchase Frequency', importance: 72, impact: 'High' },
                        { factor: 'Total Spend (Monetary)', importance: 68, impact: 'High' },
                        { factor: 'Average Order Value', importance: 54, impact: 'Medium' },
                        { factor: 'Days as Customer', importance: 42, impact: 'Medium' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="w-32 flex-shrink-0">
                                <p className="text-sm font-medium text-white/80">{item.factor}</p>
                            </div>
                            <div className="flex-1">
                                <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all"
                                        style={{ width: `${item.importance}%` }}
                                    />
                                </div>
                            </div>
                            <div className="w-24 text-right">
                                <span className="text-sm font-semibold">{item.importance}%</span>
                                <p className={`text-xs ${
                                    item.impact === 'Critical' ? 'text-red-400' :
                                    item.impact === 'High' ? 'text-amber-400' : 'text-yellow-400'
                                }`}>{item.impact}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insights Summary */}
            <div className="glass-card p-8 bg-primary-500/5 border-primary-500/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary-400" />
                    Key Insights
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-sm">
                        <span className="text-primary-400 font-bold">•</span>
                        <span><strong>Champions segment is your revenue driver</strong> — they represent {data.segments[0]?.revenue_share.toFixed(1)}% of revenue despite being only {((data.segments[0]?.customer_count / data.total_customers) * 100).toFixed(1)}% of customers.</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <span className="text-primary-400 font-bold">•</span>
                        <span><strong>Churn risk is rising</strong> — The 6-month churn trajectory shows increasing risk. Prioritize re-engagement campaigns now.</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <span className="text-primary-400 font-bold">•</span>
                        <span><strong>Recency is the strongest predictor</strong> — Customers who haven't purchased recently are most likely to churn. Set up automated check-ins.</span>
                    </li>
                    <li className="flex gap-3 text-sm">
                        <span className="text-primary-400 font-bold">•</span>
                        <span><strong>LTV varies significantly by segment</strong> — Focus retention efforts on high-LTV customers in Champions and Loyal segments.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
