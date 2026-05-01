import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { BarChart3, Eye, EyeOff, Loader, TrendingUp, Users, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BUSINESS_TYPES = [
    'Retail / Duka',
    'Tourism & Hospitality',
    'Fashion & Beauty',
    'Food & Beverage',
    'Agriculture',
    'Healthcare',
    'Education',
    'Transport',
    'Other',
];

export default function Auth() {
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState<'login' | 'register'>(
        searchParams.get('mode') === 'register' ? 'register' : 'login'
    );

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: '',
        business_name: '',
        business_type: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
    }, [mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(form.email, form.password);
            } else {
                if (!form.business_name.trim()) {
                    setError('Please enter your business name.');
                    setLoading(false);
                    return;
                }
                await register({
                    email: form.email,
                    password: form.password,
                    business_name: form.business_name,
                    business_type: form.business_type || undefined,
                });
            }
            navigate('/dashboard');
        } catch (err: unknown) {
            console.error('Auth error:', err);
            let msg = 'Something went wrong. Please try again.';
            if (err && typeof err === 'object') {
                const error = err as any;
                msg = error?.response?.data?.detail || 
                      error?.message || 
                      msg;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-950 flex">
            {/* Left Sidebar */}
            <div className="w-80 bg-surface-900 flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="font-display font-bold">GrowthEngine KE</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1">
                    <p className="section-label mt-1">Navigation</p>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/30 cursor-not-allowed">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm font-medium">Overview</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/30 cursor-not-allowed">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Segmentation</span>
                    </div>
                </nav>

                {/* Scale your SME section */}
                <div className="p-6 border-t border-white/5">
                    <h3 className="font-bold text-white mb-2">Scale your SME</h3>
                    <p className="text-white/60 text-sm mb-4">
                        Join 500+ Kenyan businesses using AI to understand customers and boost revenue.
                    </p>
                    <button className="w-full bg-accent-600 hover:bg-accent-500 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex">
                {/* Login Form - Center */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="glass-card p-8">
                            <h1 className="font-display text-2xl font-bold mb-2">Welcome Back</h1>
                            <p className="text-white/60 text-sm mb-8">
                                Sign in to your GrowthEngine dashboard
                            </p>

                            {error && <div className="alert-error mb-6">{error}</div>}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Business Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="business@company.co.ke"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="input pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
                                    {loading ? (
                                        <><Loader className="w-4 h-4 animate-spin" /> Signing in…</>
                                    ) : (
                                        'Login to Account'
                                    )}
                                </button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs text-white/40 uppercase tracking-wider">
                                        Or
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="w-full bg-surface-700 hover:bg-surface-600 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 border border-white/10 flex items-center justify-center gap-3"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Sign in with Google
                                </button>

                                <div className="text-center mt-6">
                                    <Link to="/auth?mode=register" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                                        Register your business →
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Marketing Section - Right */}
                <div className="w-96 bg-surface-900/50 p-8 flex flex-col justify-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-display text-3xl font-bold text-white mb-4">
                                Data-Driven Marketing Made Simple for Kenyan SMEs
                            </h2>
                            <p className="text-white/60 text-lg mb-6">
                                Transform your customer data into actionable insights with AI-powered analytics built for African markets.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-accent-600/20 flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-5 h-5 text-accent-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Increase Revenue</h3>
                                    <p className="text-white/60 text-sm">Identify high-value customers and boost repeat purchases by up to 35%</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Reduce Churn</h3>
                                    <p className="text-white/60 text-sm">AI predicts customer departure before it happens with 89% accuracy</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Smart Segmentation</h3>
                                    <p className="text-white/60 text-sm">Automatically group customers by behavior and purchase patterns</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-800/50 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-primary-600 border-2 border-surface-900"></div>
                                    <div className="w-6 h-6 rounded-full bg-accent-600 border-2 border-surface-900"></div>
                                    <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-surface-900"></div>
                                </div>
                                <span className="text-white/60 text-sm">Trusted by 500+ local retailers across Kenya</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                    </svg>
                                ))}
                                <span className="text-white/60 text-sm ml-1">4.9/5 rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
