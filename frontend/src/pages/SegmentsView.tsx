import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Users, TrendingUp, AlertTriangle, ArrowLeft, Download, Calendar, FileText,
    CheckCircle2, Loader2, Info, ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
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
            <div className="flex flex-col items-center justify-center p-20 text-white/40">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Loading segments...</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link to={`/dashboard/analysis/${id}`} className="text-white/40 hover:text-white text-sm flex items-center gap-2 mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Analysis
                    </Link>
                    <h1 className="font-display text-3xl font-bold flex items-center gap-3">
                        Customer Segments
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                        <div className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {data.filename}</div>
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {data.date_range.start} to {data.date_range.end}</div>
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Customers', val: data.total_customers.toLocaleString(), icon: Users, color: 'text-primary-400' },
                    { label: 'Total Revenue', val: `KSh ${data.total_revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400' },
                    { label: 'Avg. Customer Value', val: `KSh ${Math.round(data.avg_ltv).toLocaleString()}`, icon: Info, color: 'text-primary-400' },
                    { label: 'High Churn Risk', val: data.churn_risk_count.toLocaleString(), icon: AlertTriangle, color: 'text-red-400' },
                ].map((s, i) => (
                    <div key={i} className="glass-card p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                            <s.icon className={`w-6 h-6 ${s.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-white/30">{s.label}</p>
                            <p className="text-2xl font-bold mt-0.5">{s.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visualization Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Segments Pie Chart */}
                <div className="glass-card p-8 flex flex-col h-[450px]">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold">Distribution</h3>
                        <p className="text-white/40 text-sm">How many customers are in each segment.</p>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.segment_chart_data}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
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
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue per Segment */}
                <div className="glass-card p-8 flex flex-col h-[450px]">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold">Revenue Performance</h3>
                        <p className="text-white/40 text-sm">Total revenue contributed by each segment.</p>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.segments}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="segment_name" stroke="#52525b" fontSize={11} />
                                <YAxis stroke="#52525b" fontSize={11} />
                                <Tooltip
                                    contentStyle={{ background: '#0a0a0b', border: '1px solid #27272a', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="total_monetary" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed Segment Table */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold">Segment Details</h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-white/50 uppercase">Segment</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-white/50 uppercase">Customers</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-white/50 uppercase">Revenue Share</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-white/50 uppercase">Avg Spend</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-white/50 uppercase">Frequency</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-white/50 uppercase">Risk Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.segments.sort((a, b) => b.total_monetary - a.total_monetary).map((segment, idx) => (
                                <tr key={segment.segment_id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                            />
                                            <div>
                                                <p className="font-semibold">{segment.segment_name}</p>
                                                <p className="text-xs text-primary-400 italic">{segment.segment_name_sw}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <p className="font-semibold">{segment.customer_count.toLocaleString()}</p>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <p className="font-semibold">{segment.revenue_share.toFixed(1)}%</p>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <p className="font-semibold">KSh {Math.round(segment.avg_monetary).toLocaleString()}</p>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <p className="font-semibold">{segment.avg_frequency.toFixed(1)}x</p>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-block
                                            ${segment.churn_risk === 'low' ? 'bg-emerald-500/10 text-emerald-400' :
                                                segment.churn_risk === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {segment.churn_risk}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Segment Cards */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold">Segment Overview</h3>
                <div className="grid gap-6">
                    {data.segments.sort((a, b) => b.total_monetary - a.total_monetary).map((s, i) => (
                        <div key={i} className="glass-card hover:bg-white/5 transition-colors overflow-hidden border-l-4" style={{ borderColor: COLORS[i % COLORS.length] }}>
                            <div className="p-8 flex flex-col lg:flex-row gap-8">
                                <div className="lg:w-1/3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-2xl font-bold">{s.segment_name}</h4>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                            ${s.churn_risk === 'low' ? 'bg-emerald-500/10 text-emerald-400' :
                                                s.churn_risk === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                                            Risk: {s.churn_risk}
                                        </div>
                                    </div>
                                    <p className="text-primary-400 font-medium italic mb-4">{s.segment_name_sw}</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Customers</p>
                                            <p className="text-lg font-bold">{s.customer_count}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Avg Spend</p>
                                            <p className="text-lg font-bold">KSh {Math.round(s.avg_monetary).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Total Revenue</p>
                                            <p className="text-lg font-bold">KSh {Math.round(s.total_monetary).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Revenue Share</p>
                                            <p className="text-lg font-bold">{s.revenue_share.toFixed(1)}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-2/3 lg:border-l border-white/5 lg:pl-8 flex flex-col justify-center">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center flex-shrink-0">
                                            <Info className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-sm font-semibold mb-1 uppercase tracking-wider">Characteristics</p>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-white/40 text-xs">Avg Recency</p>
                                                    <p className="font-semibold">{s.avg_recency_days} days ago</p>
                                                </div>
                                                <div>
                                                    <p className="text-white/40 text-xs">Avg Frequency</p>
                                                    <p className="font-semibold">{s.avg_frequency.toFixed(1)} purchases</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
