import { Link } from 'react-router-dom';
import { Upload, BarChart3, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const quickStats = [
    { label: 'Total Analyses', value: '0', icon: <BarChart3 className="w-5 h-5" />, color: 'text-primary-400' },
    { label: 'Customers Analysed', value: '0', icon: <Users className="w-5 h-5" />, color: 'text-accent-400' },
    { label: 'Avg. Churn Risk', value: '—', icon: <TrendingUp className="w-5 h-5" />, color: 'text-yellow-400' },
];

export default function Overview() {
    const { user } = useAuth();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Habari za asubuhi' : hour < 17 ? 'Habari za mchana' : 'Habari za jioni';

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display text-2xl font-bold">
                    {greeting}, {user?.business_name}! 👋
                </h1>
                <p className="text-white/50 mt-1">
                    Upload your customer data to get started with AI-powered insights.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {quickStats.map((stat) => (
                    <div key={stat.label} className="kpi-card">
                        <div className={`${stat.color} mb-1`}>{stat.icon}</div>
                        <div className="text-2xl font-bold font-display">{stat.value}</div>
                        <div className="text-white/40 text-sm">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Get Started CTA */}
            <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-primary-600/20">
                <div>
                    <h2 className="font-display text-xl font-bold mb-2">Upload Your First Dataset</h2>
                    <p className="text-white/50 text-sm max-w-md">
                        Drop your M-Pesa statement or POS export (CSV) and we'll automatically segment your
                        customers and identify who needs attention. Takes less than 60 seconds.
                    </p>
                </div>
                <Link
                    to="/dashboard/upload"
                    className="btn-primary flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                >
                    <Upload className="w-4 h-4" />
                    Upload CSV
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* What happens next */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
                {[
                    { step: '1', title: 'Upload CSV', desc: 'Upload your M-Pesa or POS transaction file.' },
                    { step: '2', title: 'AI Analyses', desc: 'Our RFM engine + ML models segment your customers automatically.' },
                    { step: '3', title: 'Take Action', desc: 'Get segment-specific marketing recommendations in plain language.' },
                ].map((s) => (
                    <div key={s.step} className="glass-card p-5">
                        <div className="w-8 h-8 rounded-lg bg-primary-600/20 text-primary-400 font-bold text-sm flex items-center justify-center mb-3">
                            {s.step}
                        </div>
                        <h3 className="font-semibold mb-1">{s.title}</h3>
                        <p className="text-white/40 text-sm">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
