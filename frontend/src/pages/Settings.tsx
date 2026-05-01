import { useState } from 'react';
import { Settings as SettingsIcon, Shield, CheckCircle, Key, Smartphone, FileText, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-surface-950">
            {/* Top Bar */}
            <div className="h-16 bg-surface-900 border-b border-white/5 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">Settings</h1>
                    <p className="text-white/60 text-sm">Manage your account and business settings</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center">
                        <span className="text-primary-400 font-bold text-sm">AN</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Business Profile */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4">Business Profile</h3>
                        <p className="text-white/60 text-sm mb-6">Manage your primary enterprise details and industry categorization</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Business Name</label>
                                <input
                                    type="text"
                                    value={formData.business_name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Juma's Fashion"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Industry</label>
                                <select
                                    value={formData.business_type}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">Select industry</option>
                                    {BUSINESS_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Business Registration Number</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="PVT-XXXXXX"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Tax ID (KRA PIN)</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="A00XXXXXXXX"
                                />
                            </div>
                        </div>
                        
                        <button className="btn-primary mt-6">Save Changes</button>
                    </div>

                    {/* Growth Tier */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4">Growth Tier: Premium</h3>
                        <p className="text-white/60 text-sm mb-6">Your SME resilience score is in the top 15% of the Nairobi retail sector</p>
                        
                        <button className="btn-secondary flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Verified Enterprise Status
                        </button>
                    </div>

                    {/* Account Health */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4">Account Health</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">M-Pesa Link</span>
                                <span className="px-2 py-1 bg-accent-500/10 text-accent-400 rounded text-xs font-medium">ACTIVE</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Compliance Score</span>
                                <span className="text-white font-medium">98/100</span>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Notifications */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4">Privacy & Notifications</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Kenya DPA Compliance</p>
                                    <p className="text-white/60 text-xs">Strict adherence to Kenya Data Protection Act protocols</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">M-Pesa Transaction Alerts</p>
                                    <p className="text-white/60 text-xs">Real-time push notifications for business till activity</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">Marketing AI Insights</p>
                                    <p className="text-white/60 text-xs">Weekly reports on customer churn prediction</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Integrations & API */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4">Integrations & API</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Live API Key</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value="ke_live_8829...9281x00a"
                                        className="input flex-1"
                                        readOnly
                                    />
                                    <button className="btn-secondary flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4" />
                                        REGENERATE
                                    </button>
                                    <button className="text-white/40 hover:text-white">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-accent-400" />
                                    <div>
                                        <p className="text-white font-medium">M-Pesa Business API</p>
                                        <p className="text-white/60 text-xs">Connected to C2B/B2C wills</p>
                                    </div>
                                </div>
                                <CheckCircle className="w-5 h-5 text-accent-400" />
                            </div>
                            
                            <button className="btn-secondary flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                Connect POS System
                            </button>
                            <p className="text-white/40 text-xs">Integrate with QuickBooks or Shopify</p>
                        </div>
                    </div>

                    {/* Account Management */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4">Account Management</h3>
                        <p className="text-white/60 text-sm mb-6">Deactivate your account or export all historical business data</p>
                        
                        <div className="space-y-3">
                            <button className="btn-secondary flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Export Data (.CSV)
                            </button>
                            <button className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Deactivate Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
