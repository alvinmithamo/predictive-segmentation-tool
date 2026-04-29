import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { BarChart3, Eye, EyeOff, Loader } from 'lucide-react';
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
        <div className="min-h-screen bg-surface-950 mesh-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <span className="font-display font-bold text-xl">Kenya SME Predictor</span>
                </Link>

                <div className="glass-card p-8">
                    {/* Tab toggle */}
                    <div className="flex bg-surface-900 rounded-xl p-1 mb-8">
                        {(['login', 'register'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${mode === m
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'text-white/50 hover:text-white'
                                    }`}
                            >
                                {m === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        ))}
                    </div>

                    <h2 className="font-display text-xl font-bold mb-1">
                        {mode === 'login' ? 'Welcome back!' : 'Start understanding your customers'}
                    </h2>
                    <p className="text-white/40 text-sm mb-6">
                        {mode === 'login'
                            ? 'Sign in to your SME dashboard.'
                            : 'Free account — no credit card needed.'}
                    </p>

                    {error && <div className="alert-error mb-5">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <>
                                <div>
                                    <label className="block text-xs text-white/50 mb-1.5 font-medium">Business Name</label>
                                    <input
                                        name="business_name"
                                        type="text"
                                        placeholder="e.g., Karibu Fashion Store"
                                        value={form.business_name}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-white/50 mb-1.5 font-medium">Business Type</label>
                                    <select
                                        name="business_type"
                                        value={form.business_type}
                                        onChange={handleChange}
                                        className="input"
                                    >
                                        <option value="">Select your industry (optional)</option>
                                        {BUSINESS_TYPES.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-xs text-white/50 mb-1.5 font-medium">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="you@business.ke"
                                value={form.email}
                                onChange={handleChange}
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-white/50 mb-1.5 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={mode === 'register' ? 'Minimum 8 characters' : '••••••••'}
                                    value={form.password}
                                    onChange={handleChange}
                                    className="input pr-12"
                                    required
                                    minLength={mode === 'register' ? 8 : undefined}
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

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                            {loading ? (
                                <><Loader className="w-4 h-4 animate-spin" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                            ) : (
                                mode === 'login' ? 'Sign In' : 'Create Free Account'
                            )}
                        </button>
                    </form>

                    {mode === 'register' && (
                        <p className="text-center text-white/30 text-xs mt-6">
                            By creating an account you agree to our privacy-first approach.<br />
                            Your customer data is never stored — only anonymized results.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
