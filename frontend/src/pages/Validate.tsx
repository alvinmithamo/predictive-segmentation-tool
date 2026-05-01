import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    CheckCircle2, AlertTriangle, XCircle, Loader2, ArrowRight, ArrowLeft, 
    FileText, Download, RefreshCw, Info, CheckCircle, AlertCircle
} from 'lucide-react';
import api from '../lib/api';
import FlowProgress from '../components/FlowProgress';

interface ValidationIssue {
    id: string;
    type: 'error' | 'warning' | 'info';
    severity: 'critical' | 'high' | 'medium' | 'low';
    row?: number;
    column?: string;
    message: string;
    suggestion?: string;
    count?: number;
}

interface ValidationSummary {
    total_rows: number;
    valid_rows: number;
    error_count: number;
    warning_count: number;
    info_count: number;
    data_quality_score: number;
    completion_rate: number;
    issues: ValidationIssue[];
}

interface UploadData {
    upload_id: string;
    filename: string;
    columns: string[];
    preview: any[];
}

export default function Validate() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [uploadData, setUploadData] = useState<UploadData | null>(null);
    const [validation, setValidation] = useState<ValidationSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRevalidating, setIsRevalidating] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'errors' | 'warnings' | 'info'>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get upload data
                const { data: uploadResult } = await api.get(`/api/upload/${id}`);
                setUploadData(uploadResult);

                // Get validation results
                const { data: validationResult } = await api.get(`/api/upload/${id}/validate`);
                setValidation(validationResult);
            } catch (err: any) {
                console.error('Failed to load validation data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleRevalidate = async () => {
        if (!id) return;
        setIsRevalidating(true);
        try {
            const { data: validationResult } = await api.post(`/api/upload/${id}/validate`);
            setValidation(validationResult);
        } catch (err: any) {
            console.error('Failed to revalidate:', err);
        } finally {
            setIsRevalidating(false);
        }
    };

    const handleProceed = () => {
        if (validation && validation.error_count === 0) {
            navigate(`/dashboard/analysis/${id}/segment`);
        } else {
            // Show confirmation dialog for proceeding with errors
            if (confirm('You have errors in your data. Proceeding may affect analysis quality. Continue anyway?')) {
                navigate(`/dashboard/analysis/${id}/segment`);
            }
        }
    };

    const filteredIssues = validation?.issues.filter(issue => {
        if (selectedFilter === 'all') return true;
        return issue.type === selectedFilter;
    }) || [];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Validating data...</p>
            </div>
        );
    }

    if (!uploadData || !validation) return null;

    const getIssueIcon = (type: string) => {
        switch (type) {
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'info': return <Info className="w-4 h-4 text-blue-500" />;
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getIssueColor = (type: string) => {
        switch (type) {
            case 'error': return 'border-red-500/20 bg-red-500/10 text-red-400';
            case 'warning': return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400';
            case 'info': return 'border-blue-500/20 bg-blue-500/10 text-blue-400';
            default: return 'border-gray-500/20 bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Flow Progress */}
            <FlowProgress uploadId={id} />
            
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">Data Validation</h1>
                    <p className="text-gray-600 text-sm">Quality checks and data cleaning recommendations</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <button 
                        onClick={handleRevalidate}
                        disabled={isRevalidating}
                        className="btn-secondary flex items-center gap-2"
                    >
                        {isRevalidating ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Revalidating...</>
                        ) : (
                            <><RefreshCw className="w-4 h-4" /> Revalidate</>
                        )}
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* Validation Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                validation.data_quality_score >= 90 ? 'bg-green-100 text-green-700' :
                                validation.data_quality_score >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {validation.data_quality_score}% Score
                            </span>
                        </div>
                        <h3 className="font-bold text-2xl mb-1">{validation.valid_rows.toLocaleString()}</h3>
                        <p className="text-gray-600 text-sm">Valid Rows</p>
                        <p className="text-gray-500 text-xs mt-1">of {validation.total_rows.toLocaleString()} total</p>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            {validation.error_count > 0 && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                                    Action Required
                                </span>
                            )}
                        </div>
                        <h3 className="font-bold text-2xl mb-1 text-red-600">{validation.error_count}</h3>
                        <p className="text-gray-600 text-sm">Critical Errors</p>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                        <h3 className="font-bold text-2xl mb-1 text-yellow-600">{validation.warning_count}</h3>
                        <p className="text-gray-600 text-sm">Warnings</p>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Info className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="font-bold text-2xl mb-1 text-blue-600">{validation.info_count}</h3>
                        <p className="text-gray-600 text-sm">Info Messages</p>
                    </div>
                </div>

                {/* File Info */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{uploadData.filename}</h3>
                                <p className="text-gray-600 text-sm">Upload ID: {uploadData.upload_id}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-600 text-sm">Completion Rate</p>
                            <p className="font-bold text-lg">{validation.completion_rate}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Columns: {uploadData.columns.length}</span>
                        <span>•</span>
                        <span>Rows: {validation.total_rows.toLocaleString()}</span>
                        <span>•</span>
                        <span>Data Quality: {validation.data_quality_score}/100</span>
                    </div>
                </div>

                {/* Issues List */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Validation Issues</h3>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setSelectedFilter('all')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    selectedFilter === 'all' 
                                        ? 'bg-gray-200 text-gray-900' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                All ({validation.issues.length})
                            </button>
                            <button 
                                onClick={() => setSelectedFilter('errors')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    selectedFilter === 'errors' 
                                        ? 'bg-red-100 text-red-700' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Errors ({validation.error_count})
                            </button>
                            <button 
                                onClick={() => setSelectedFilter('warnings')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    selectedFilter === 'warnings' 
                                        ? 'bg-yellow-100 text-yellow-700' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Warnings ({validation.warning_count})
                            </button>
                            <button 
                                onClick={() => setSelectedFilter('info')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    selectedFilter === 'info' 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Info ({validation.info_count})
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredIssues.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                                <p className="font-medium">No issues found</p>
                                <p className="text-sm">Your data passed all validation checks</p>
                            </div>
                        ) : (
                            filteredIssues.map((issue) => (
                                <div key={issue.id} className={`p-4 rounded-lg border ${getIssueColor(issue.type)}`}>
                                    <div className="flex items-start gap-3">
                                        {getIssueIcon(issue.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium capitalize">{issue.type}</span>
                                                {issue.row && (
                                                    <span className="text-xs opacity-75">Row {issue.row}</span>
                                                )}
                                                {issue.column && (
                                                    <span className="text-xs opacity-75">Column: {issue.column}</span>
                                                )}
                                                {issue.count && issue.count > 1 && (
                                                    <span className="text-xs opacity-75">({issue.count} occurrences)</span>
                                                )}
                                            </div>
                                            <p className="text-sm mb-2">{issue.message}</p>
                                            {issue.suggestion && (
                                                <p className="text-xs opacity-75 italic">
                                                    💡 Suggestion: {issue.suggestion}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8">
                    <button 
                        onClick={() => navigate('/dashboard/upload')}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Upload
                    </button>
                    
                    <div className="flex items-center gap-4">
                        {validation.error_count > 0 && (
                            <div className="text-sm text-red-600">
                                ⚠️ {validation.error_count} errors need attention for best results
                            </div>
                        )}
                        <button 
                            onClick={handleProceed}
                            className={`btn-primary flex items-center gap-2 ${
                                validation.error_count > 0 ? 'border-red-500 hover:border-red-600' : ''
                            }`}
                        >
                            Proceed to Segmentation
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
