import { Link } from 'react-router-dom';
import { BarChart3, Upload, Target, TrendingUp, ArrowRight, Star, ShoppingBag, Plane, Scissors } from 'lucide-react';

const features = [
    {
        icon: <Upload className="w-6 h-6" />,
        title: 'Upload Your Data',
        desc: 'Drop your M-Pesa or POS CSV — we handle the rest, no technical knowledge needed.',
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: 'Smart Segmentation',
        desc: 'AI automatically groups your customers into Champions, Loyal, At Risk, and more.',
    },
    {
        icon: <TrendingUp className="w-6 h-6" />,
        title: 'Predict Churn & LTV',
        desc: 'Know which customers are about to leave and their 12-month lifetime value in KSh.',
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: 'Actionable Recommendations',
        desc: 'Get specific marketing actions tailored for your Kenyan SME — ready to execute.',
    },
];

const industries = [
    { icon: <ShoppingBag className="w-5 h-5" />, name: 'Retail / Mama Mboga' },
    { icon: <Plane className="w-5 h-5" />, name: 'Tourism & Hospitality' },
    { icon: <Scissors className="w-5 h-5" />, name: 'Fashion & Beauty' },
    { icon: <Star className="w-5 h-5" />, name: 'Any Kenyan Business' },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-surface-950 mesh-bg text-white">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="font-display font-bold text-lg">Growth Engine KE</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/auth" className="btn-ghost text-sm">Sign In</Link>
                        <Link to="/auth?mode=register" className="btn-primary text-sm py-2 px-4">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-600/30 text-primary-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
                        <Star className="w-3.5 h-3.5" /> Built for Kenyan SMEs
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                        Grow Your Business with{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                            Smart Customer Insights
                        </span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
                        Upload your M-Pesa or POS data. Our AI segments your customers, predicts who's about to
                        churn, and tells you exactly what to do — in plain Swahili-friendly language. No coding needed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/auth?mode=register" className="btn-primary flex items-center justify-center gap-2 text-base">
                            Start for Free <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/auth" className="btn-secondary flex items-center justify-center gap-2 text-base">
                            Sign In
                        </Link>
                    </div>
                    <p className="text-white/30 text-sm mt-4">No credit card required · Works with M-Pesa exports · Free forever for small datasets</p>
                </div>
            </section>

            {/* Industries */}
            <section className="py-8 border-y border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-6">Perfect for</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {industries.map((ind) => (
                            <div
                                key={ind.name}
                                className="flex items-center gap-2 bg-surface-800/50 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70"
                            >
                                <span className="text-primary-400">{ind.icon}</span>
                                {ind.name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-display text-3xl font-bold text-center mb-3">
                        Everything You Need to Understand Your Customers
                    </h2>
                    <p className="text-white/50 text-center mb-12">
                        From raw transactions to actionable marketing — in minutes.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((f) => (
                            <div key={f.title} className="glass-card p-6 flex gap-4 group hover:border-primary-600/30 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600/30 transition-colors">
                                    {f.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto glass-card p-10 text-center border-primary-600/20">
                    <h2 className="font-display text-3xl font-bold mb-4">Ready to Know Your Customers Better?</h2>
                    <p className="text-white/50 mb-8">Join Kenyan SMEs already making smarter marketing decisions with data.</p>
                    <Link to="/auth?mode=register" className="btn-primary inline-flex items-center gap-2 text-base">
                        Create Free Account <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 px-6 text-center text-white/30 text-sm">
                <p>© 2025 Kenya SME Predictor &nbsp;·&nbsp; Built with ❤️ for Kenyan businesses</p>
            </footer>
        </div>
    );
}
