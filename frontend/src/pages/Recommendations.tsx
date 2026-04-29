import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle2, Loader2, FileText, Calendar, Target,
    MessageSquare, Gift, TrendingUp, AlertTriangle, Info
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

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const recommendationDetails: Record<string, { icon: any; actions: string[] }> = {
    'Champions': {
        icon: TrendingUp,
        actions: [
            'Keep them happy with exclusive loyalty rewards and early access to new products',
            'Ask for testimonials and reviews to build social proof',
            'Invite them to VIP events or beta testing of new offerings',
            'Create referral incentives to turn them into brand advocates',
            'Personalized thank-you messages and surprise rewards'
        ]
    },
    'Loyal Customers': {
        icon: Gift,
        actions: [
            'Upsell higher-value products or premium tiers',
            'Cross-sell complementary products to increase basket size',
            'Invite them to loyalty programs with tiered benefits',
            'Request their feedback to improve your offerings',
            'Offer exclusive bundles or seasonal promotions'
        ]
    },
    'At Risk': {
        icon: AlertTriangle,
        actions: [
            'Send personalized re-engagement campaigns via email or SMS',
            'Offer a special discount (10-15%) with clear call-to-action',
            'Send a "We miss you" message explaining what\'s new',
            'Quick survey to understand why they\'ve reduced purchases',
            'Limited-time offer with urgency messaging'
        ]
    },
    'Hibernating': {
        icon: MessageSquare,
        actions: [
            'Launch a "Welcome Back" campaign with a massive discount (20-30%)',
            'Clean up your email list if they don\'t respond in 30 days',
            'Try a different channel (SMS, WhatsApp, social media)',
            'Remind them of past purchases they might need replenishment of',
            'Share customer success stories that might inspire them'
        ]
    }
};

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
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link to={`/dashboard/analysis/${id}`} className="text-white/40 hover:text-white text-sm flex items-center gap-2 mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Analysis
                    </Link>
                    <h1 className="font-display text-3xl font-bold flex items-center gap-3">
                        Marketing Recommendations
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </h1>
                    <p className="text-white/40 text-sm mt-2">Actionable strategies for each customer segment</p>
                </div>
            </div>

            {/* Overview */}
            <div className="glass-card p-6 border-primary-500/20 bg-primary-500/5">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">How to use these recommendations</h3>
                        <p className="text-white/60 text-sm">
                            Each recommendation is tailored to the specific characteristics of that customer segment. 
                            Implement these strategies through your preferred marketing channels (WhatsApp, Email, SMS) 
                            to improve engagement, retention, and revenue.
                        </p>
                    </div>
                </div>
            </div>

            {/* Recommendations by Segment */}
            <div className="space-y-8">
                {data.segments
                    .sort((a, b) => b.total_monetary - a.total_monetary)
                    .map((segment, idx) => {
                        const details = recommendationDetails[segment.segment_name] || { 
                            icon: Info,
                            actions: [segment.recommendation]
                        };
                        const IconComponent = details.icon;

                        return (
                            <div 
                                key={segment.segment_id} 
                                className="glass-card overflow-hidden border-l-4 transition-all hover:bg-white/5"
                                style={{ borderColor: COLORS[idx % COLORS.length] }}
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-white/5 to-transparent p-6 border-b border-white/5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div 
                                                className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0"
                                                style={{ 
                                                    backgroundColor: COLORS[idx % COLORS.length] + '15',
                                                    color: COLORS[idx % COLORS.length]
                                                }}
                                            >
                                                <IconComponent className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold flex items-center gap-2">
                                                    {segment.segment_name}
                                                    <span className="text-sm font-normal text-primary-400 italic">
                                                        ({segment.segment_name_sw})
                                                    </span>
                                                </h3>
                                                <p className="text-white/40 text-sm mt-1">
                                                    {segment.customer_count.toLocaleString()} customers · 
                                                    {' '} KSh {Math.round(segment.avg_monetary).toLocaleString()} avg spend · 
                                                    {' '} {segment.revenue_share.toFixed(1)}% of revenue
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0
                                            ${segment.churn_risk === 'low' ? 'bg-emerald-500/10 text-emerald-400' :
                                                segment.churn_risk === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {segment.churn_risk} risk
                                        </div>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="p-6 space-y-4">
                                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-primary-400" />
                                        Recommended Actions
                                    </h4>
                                    
                                    <div className="space-y-3">
                                        {details.actions.map((action, actionIdx) => (
                                            <div key={actionIdx} className="flex gap-3 items-start bg-white/2 p-3 rounded-lg border border-white/5">
                                                <div className="w-5 h-5 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                                                    {actionIdx + 1}
                                                </div>
                                                <p className="text-white/80 text-sm leading-relaxed">{action}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="px-6 pb-6 pt-2 flex flex-wrap gap-2">
                                    <button className="btn-secondary text-sm py-2">
                                        📧 Email Campaign
                                    </button>
                                    <button className="btn-secondary text-sm py-2">
                                        💬 WhatsApp Message
                                    </button>
                                    <button className="btn-secondary text-sm py-2">
                                        📱 SMS Blast
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Implementation Timeline */}
            <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Implementation Timeline</h3>
                <div className="space-y-4">
                    {[
                        { phase: 'Week 1', action: 'Prepare segments and segment lists in your CRM', focus: 'Setup' },
                        { phase: 'Week 2', action: 'Launch targeted campaigns for High-Risk & Hibernating segments', focus: 'Quick wins' },
                        { phase: 'Week 3', action: 'Upsell and cross-sell campaigns for Loyal & Champion segments', focus: 'Revenue growth' },
                        { phase: 'Ongoing', action: 'Monitor engagement metrics and refine messaging based on response rates', focus: 'Optimization' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-b-0">
                            <div className="w-20 flex-shrink-0">
                                <p className="font-semibold text-primary-400 text-sm">{item.phase}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-white/90 mb-1">{item.action}</p>
                                <p className="text-xs bg-primary-600/10 text-primary-400 px-2 py-1 rounded w-fit font-medium">{item.focus}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
