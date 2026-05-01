import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Loader2, Target,
    TrendingUp, AlertTriangle, FileText, MoreVertical, Clock, Phone, Smartphone, Zap, Plus
} from 'lucide-react';
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

export interface AnalysisDetail {
    analysis_id: string;
    filename: string;
    created_at: string;
    total_customers: number;
    total_revenue: number;
    avg_ltv: number;
    churn_risk_count: number;
    segments: Segment[];
}


export default function RecommendationsView() {
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
                <p>Loading recommendations...</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-surface-950">
            {/* Top Bar */}
            <div className="h-16 bg-surface-900 border-b border-white/5 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">Retention Recommendations</h1>
                    <p className="text-white/60 text-sm">AI-powered retention strategies for at-risk customers</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Export PDF
                    </button>
                    <button className="btn-secondary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        CSV
                    </button>
                    <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center">
                        <span className="text-primary-400 font-bold text-sm">AN</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white/60 text-sm">TOTAL AT-RISK</h3>
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-medium">ACTION REQUIRED</span>
                        </div>
                        <div className="text-3xl font-bold mb-2">1,248</div>
                        <div className="text-red-400 text-sm flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +12% vs last month
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white/60 text-sm">AVG. CONFIDENCE SCORE</h3>
                        </div>
                        <div className="text-3xl font-bold mb-2">89.4%</div>
                        <div className="text-accent-400 text-sm">High Accuracy</div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white/60 text-sm">PROJECTED RECOVERY</h3>
                        </div>
                        <div className="text-3xl font-bold mb-2">KSh 4.2M</div>
                        <div className="text-accent-400 text-sm">Potential Uplift</div>
                    </div>
                </div>

                {/* Prioritized AI Recommendations */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-2xl font-bold">Prioritized AI Recommendations</h2>
                        <button className="btn-secondary flex items-center gap-2">
                            Highest Confidence First
                            <TrendingUp className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recommendation Card 1 */}
                        <div className="glass-card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-accent-500/20 text-accent-400 rounded text-xs font-bold">92% CONFIDENCE</span>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">AT-RISK SEGMENT</span>
                                </div>
                                <button className="text-white/40 hover:text-white">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
                                <Clock className="w-3 h-3" />
                                Expires in 4 days
                            </div>

                            <h3 className="font-bold text-lg mb-2">Offer 15% discount to At-Risk segment via WhatsApp before Easter</h3>
                            <p className="text-white/60 text-sm mb-4">Targeting 412 customers who haven't purchased in 30 days but historically buy during holiday seasons.</p>

                            <div className="flex items-center gap-2 text-accent-400 text-sm font-medium mb-4">
                                <Zap className="w-4 h-4" />
                                SIMULATED UPLIFT: +8% Revenue
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                                    <Smartphone className="w-3 h-3 text-green-400" />
                                </div>
                                <span className="text-white/60 text-sm">CHANNEL: WhatsApp Business</span>
                            </div>

                            <button className="btn-primary w-full">Apply to Campaign</button>
                        </div>

                        {/* Recommendation Card 2 */}
                        <div className="glass-card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">87% CONFIDENCE</span>
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">HIGH SPENDER LAPSED</span>
                                </div>
                                <button className="text-white/40 hover:text-white">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
                                <Target className="w-3 h-3" />
                                High Value Target
                            </div>

                            <h3 className="font-bold text-lg mb-2">Direct Relationship Call for Top 20 "Churking" VIPs</h3>
                            <p className="text-white/60 text-sm mb-4">Personalized loyalty outreach for customers with Lifetime Value (LTV) &gt; KSh 150k who showed reduced activity.</p>

                            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
                                <TrendingUp className="w-4 h-4" />
                                SIMULATED UPLIFT: KSh 450k+
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                                    <Phone className="w-3 h-3 text-blue-400" />
                                </div>
                                <span className="text-white/60 text-sm">CHANNEL: Direct Voice</span>
                            </div>

                            <button className="btn-secondary w-full">Assign to Sales Rep</button>
                        </div>

                        {/* Recommendation Card 3 */}
                        <div className="glass-card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">76% CONFIDENCE</span>
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold">NEW CUSTOMER DROPOFF</span>
                                </div>
                                <button className="text-white/40 hover:text-white">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
                                <AlertTriangle className="w-3 h-3" />
                                Critical Window
                            </div>

                            <h3 className="font-bold text-lg mb-2">M-Pesa Cashback incentive for 2nd purchase within 7 days</h3>
                            <p className="text-white/60 text-sm mb-4">Encourage retention for first-time shoppers using KSh 50 M-Pesa reversal credits on their next purchase.</p>

                            <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-4">
                                <Target className="w-4 h-4" />
                                SIMULATED UPLIFT: +15% Retention
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                                    <Smartphone className="w-3 h-3 text-green-400" />
                                </div>
                                <span className="text-white/60 text-sm">CHANNEL: M-Pesa API</span>
                            </div>

                            <button className="btn-primary w-full">Enable Integration</button>
                        </div>

                        {/* Custom Insight Card */}
                        <div className="glass-card p-6 border-2 border-dashed border-white/20 hover:border-primary-500/50 transition-colors cursor-pointer">
                            <div className="flex flex-col items-center text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-primary-600/20 flex items-center justify-center mb-4">
                                    <Plus className="w-8 h-8 text-primary-400" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Custom Insight</h3>
                                <p className="text-white/60 text-sm">Configure a custom manual retention trigger for your team</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Implementation Strategy */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary-400" />
                        Implementation Strategy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">1</div>
                                <div>
                                    <p className="text-white font-medium mb-1">Immediate Actions (0-7 days)</p>
                                    <p className="text-white/60 text-sm">Deploy high-confidence WhatsApp campaigns for at-risk segments</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">2</div>
                                <div>
                                    <p className="text-white font-medium mb-1">Medium Term (1-4 weeks)</p>
                                    <p className="text-white/60 text-sm">Set up automated M-Pesa cashback triggers for new customers</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">3</div>
                                <div>
                                    <p className="text-white font-medium mb-1">Long Term (1-3 months)</p>
                                    <p className="text-white/60 text-sm">Establish VIP calling program for high-value customers</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">4</div>
                                <div>
                                    <p className="text-white font-medium mb-1">Continuous Optimization</p>
                                    <p className="text-white/60 text-sm">Monitor performance and refine AI models weekly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
