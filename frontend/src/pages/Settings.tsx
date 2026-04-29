import { useState } from 'react';
import { Settings as SettingsIcon, LogOut, Mail, Bell, Lock, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

export default function Settings() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'preferences' | 'security'>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        business_name: user?.business_name || '',
        business_type: user?.business_type || '',
        notifications_email: true,
        notifications_sms: false,
        data_retention: '90',
        two_factor: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as any;
        const { name, value, checked, type } = target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        
        // Simulate API call
        setTimeout(() => {
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            setIsSaving(false);
        }, 1500);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="p-8 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display text-3xl font-bold flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8" />
                    Settings
                </h1>
                <p className="text-white/50 mt-2">Manage your account and preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/10">
                {[
                    { id: 'profile', label: 'Account Profile', icon: '👤' },
                    { id: 'business', label: 'Business Info', icon: '🏢' },
                    { id: 'preferences', label: 'Notifications', icon: '🔔' },
                    { id: 'security', label: 'Security', icon: '🔒' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                            activeTab === tab.id
                                ? 'border-primary-500 text-white'
                                : 'border-transparent text-white/50 hover:text-white'
                        }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                    message.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{message.text}</p>
                </div>
            )}

            {/* Content */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="glass-card p-8">
                                <h2 className="text-xl font-bold mb-6">Account Information</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="input bg-white/5 opacity-60 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-white/40 mt-1">Email cannot be changed. Contact support to update.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Account Created</label>
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                            <p className="text-white/70">{new Date(user?.created_at || '').toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-amber-400">Delete Account</p>
                                            <p className="text-sm text-amber-400/80 mt-1">
                                                Deleting your account will permanently remove all your data, including analyses and settings.
                                            </p>
                                            <button className="mt-3 px-4 py-2 border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 rounded-lg text-sm font-medium transition-colors">
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Business Tab */}
                    {activeTab === 'business' && (
                        <div className="space-y-6">
                            <div className="glass-card p-8">
                                <h2 className="text-xl font-bold mb-6">Business Information</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Business Name</label>
                                        <input
                                            type="text"
                                            name="business_name"
                                            value={formData.business_name}
                                            onChange={handleChange}
                                            placeholder="e.g., Nairobi Fashion Boutique"
                                            className="input"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Business Type</label>
                                        <select
                                            name="business_type"
                                            value={formData.business_type}
                                            onChange={handleChange}
                                            className="input"
                                        >
                                            <option value="">Select business type...</option>
                                            {BUSINESS_TYPES.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">💡 Tip</h3>
                                        <p className="text-sm text-white/80">
                                            Your business type helps us tailor recommendations specifically for your industry. 
                                            Tourism businesses see seasonal patterns, while retail sees daily trends.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div className="glass-card p-8">
                                <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-primary-400" />
                                            <div>
                                                <p className="font-semibold">Email Notifications</p>
                                                <p className="text-xs text-white/40">Analysis complete, tips, and updates</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="notifications_email"
                                                checked={formData.notifications_email}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <Bell className="w-5 h-5 text-amber-400" />
                                            <div>
                                                <p className="font-semibold">SMS Notifications</p>
                                                <p className="text-xs text-white/40">Urgent alerts and critical updates</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="notifications_sms"
                                                checked={formData.notifications_sms}
                                                onChange={handleChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">📧 Email Digest</h3>
                                        <p className="text-sm text-white/80">
                                            We recommend email notifications for weekly analysis summaries and helpful tips. 
                                            SMS notifications are best for urgent alerts about data issues.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="glass-card p-8">
                                <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="flex text-sm font-medium mb-4 items-center gap-2">
                                            <Lock className="w-4 h-4" />
                                            Change Password
                                        </label>
                                        <div className="space-y-3">
                                            <input
                                                type="password"
                                                placeholder="Current password"
                                                className="input"
                                            />
                                            <input
                                                type="password"
                                                placeholder="New password"
                                                className="input"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                className="input"
                                            />
                                        </div>
                                        <button className="mt-4 px-6 py-2 btn-secondary text-sm">Update Password</button>
                                    </div>

                                    <div className="border-t border-white/10 pt-6">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <Lock className="w-5 h-5 text-emerald-400" />
                                                <div>
                                                    <p className="font-semibold">Two-Factor Authentication</p>
                                                    <p className="text-xs text-white/40">Add extra security to your account</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="two_factor"
                                                    checked={formData.two_factor}
                                                    onChange={handleChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                                        <h3 className="font-semibold mb-2">🛡️ Security Tip</h3>
                                        <p className="text-sm text-white/80">
                                            Use a strong password with a mix of uppercase, lowercase, numbers, and symbols. 
                                            Enable two-factor authentication for maximum security.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>

                    {/* Info Cards */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="font-semibold text-sm">Account Status</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/50">Status</span>
                                <span className="text-emerald-400 font-medium">✓ Active</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Analyses</span>
                                <span className="font-medium">Unlimited</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Max File Size</span>
                                <span className="font-medium">50 MB</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Support</span>
                                <span className="text-primary-400 font-medium">Community</span>
                            </div>
                        </div>
                    </div>

                    {/* Help */}
                    <div className="glass-card p-6 bg-primary-500/5 border-primary-500/20">
                        <h3 className="font-semibold text-sm mb-3">Need Help?</h3>
                        <p className="text-xs text-white/60 mb-4">
                            Check our documentation or contact support.
                        </p>
                        <button className="w-full text-sm btn-secondary">
                            View Documentation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
