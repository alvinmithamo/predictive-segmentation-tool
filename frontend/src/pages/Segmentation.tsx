// import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users, BarChart3, TrendingUp, FileText, Plus, Star, ArrowUp, Calendar, Zap, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

// interface AnalysisSummary {
//     id: string;
//     filename: string;
//     status: 'pending' | 'processing' | 'done' | 'failed';
//     created_at: string;
//     row_count: number;
//     segments_identified?: number;
//     coverage?: string;
//     thumbnail?: string;
// }

export default function Segmentation() {
    // const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
    // const [isLoading, setIsLoading] = useState(true);

    // Mock data for completed analyses
    // const mockAnalyses = [
    //     {
    //         id: '1',
    //         filename: 'Q3 Harvest Surge',
    //         status: 'done' as const,
    //         created_at: '2024-03-15T10:30:00Z',
    //         row_count: 2847,
    //         segments_identified: 5,
    //         coverage: '87%',
    //         thumbnail: '📊'
    //     },
    //     {
    //         id: '2',
    //         filename: 'Loyalty Churn Audit',
    //         status: 'done' as const,
    //         created_at: '2024-02-28T14:20:00Z',
    //         row_count: 1923,
    //         segments_identified: 4,
    //         coverage: '92%',
    //         thumbnail: '🎯'
    //     },
    //     {
    //         id: '3',
    //         filename: 'Mid-Year Bulk Sales',
    //         status: 'done' as const,
    //         created_at: '2024-01-10T09:15:00Z',
    //         row_count: 3562,
    //         segments_identified: 6,
    //         coverage: '78%',
    //         thumbnail: '📈'
    //     },
    //     {
    //         id: '4',
    //         filename: 'Baseline Performance',
    //         status: 'done' as const,
    //         created_at: '2023-12-05T16:45:00Z',
    //         row_count: 1234,
    //         segments_identified: 3,
    //         coverage: '95%',
    //         thumbnail: '⚡'
    //     },
    // ];

    // useEffect(() => {
    //     // Use mock data for now
    //     setAnalyses(mockAnalyses);
    //     setIsLoading(false);
    // }, []);

    // if (isLoading) {
    //     return (
    //         <div className="flex flex-col items-center justify-center p-20 text-gray-400">
    //             <div className="w-8 h-8 animate-spin mb-4 border-2 border-gray-400 border-t-green-600 rounded-full"></div>
    //             <p>Loading segmentation analyses...</p>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">Customer Segmentation</h1>
                    <p className="text-gray-600 text-sm">RFM analysis and customer clustering insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Export Report
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Analysis
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* Customer Segments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Champions Segment */}
                    <div className="glass-card p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Star className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                15% of customers
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900">Champions</h3>
                        <p className="text-gray-600 text-sm mb-4">Best customers, high frequency and monetary value</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Avg Order Value:</span>
                                <span className="font-semibold text-gray-900">KSh 2,450</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Purchase Frequency:</span>
                                <span className="font-semibold text-gray-900">4.2x/month</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Churn Risk:</span>
                                <span className="font-semibold text-green-600">Low</span>
                            </div>
                        </div>
                    </div>

                    {/* Loyal Customers Segment */}
                    <div className="glass-card p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                25% of customers
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900">Loyal Customers</h3>
                        <p className="text-gray-600 text-sm mb-4">Good customers, regular spending patterns</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Avg Order Value:</span>
                                <span className="font-semibold text-gray-900">KSh 1,850</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Purchase Frequency:</span>
                                <span className="font-semibold text-gray-900">2.8x/month</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Churn Risk:</span>
                                <span className="font-semibold text-blue-600">Medium</span>
                            </div>
                        </div>
                    </div>

                    {/* At Risk Segment */}
                    <div className="glass-card p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                35% of customers
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900">At Risk</h3>
                        <p className="text-gray-600 text-sm mb-4">Recent customers, declining activity</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Avg Order Value:</span>
                                <span className="font-semibold text-gray-900">KSh 950</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Purchase Frequency:</span>
                                <span className="font-semibold text-gray-900">1.2x/month</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Churn Risk:</span>
                                <span className="font-semibold text-yellow-600">High</span>
                            </div>
                        </div>
                    </div>

                    {/* Lost Customers Segment */}
                    <div className="glass-card p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                25% of customers
                            </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900">Lost Customers</h3>
                        <p className="text-gray-600 text-sm mb-4">Inactive customers, no recent purchases</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Avg Order Value:</span>
                                <span className="font-semibold text-gray-900">KSh 450</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Purchase Frequency:</span>
                                <span className="font-semibold text-gray-900">0.3x/month</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Churn Risk:</span>
                                <span className="font-semibold text-red-600">Very High</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Metrics and Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Performance Metrics */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-green-600" />
                            Performance Metrics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Revenue</span>
                                <span className="font-bold text-lg text-gray-900">KSh 2.4M</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Active Customers</span>
                                <span className="font-bold text-lg text-gray-900">1,234</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Avg LTV</span>
                                <span className="font-bold text-lg text-gray-900">KSh 1,945</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Retention Rate</span>
                                <span className="font-bold text-lg text-green-600">78%</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Analysis */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-green-600" />
                            Recent Analysis
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Q3 2024 Analysis</span>
                                    <span className="text-xs text-gray-600">2 days ago</span>
                                </div>
                                <div className="text-sm text-gray-600">4 segments identified • 1,234 customers</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">Q2 2024 Analysis</span>
                                    <span className="text-xs text-gray-600">1 month ago</span>
                                </div>
                                <div className="text-sm text-gray-600">5 segments identified • 987 customers</div>
                            </div>
                            <Link to="/dashboard/history" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                                View All Analyses
                                <ArrowUp className="w-4 h-4 rotate-45" />
                            </Link>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-green-600" />
                            Recommendations
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">Focus retention efforts on At Risk segment (35% of base)</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">Create loyalty program for Loyal Customers</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">Re-engagement campaign for Lost Customers</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                                <p className="text-gray-700 text-sm">VIP program for Champions segment</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard/upload" className="btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Run New Analysis
                        </Link>
                        <Link to="/dashboard/predictions" className="btn-secondary flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            View Predictions
                        </Link>
                    </div>
                    <div className="text-sm text-gray-600">
                        Last updated: {format(new Date(), 'MMM d, yyyy • h:mm a')}
                    </div>
                </div>
            </div>
        </div>
    );
}
