import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, X, CheckCircle2, AlertCircle, Loader2, ArrowRight, Cloud, AlertTriangle, FileSpreadsheet, Clock, Filter } from 'lucide-react';
import api from '../lib/api';
import FlowProgress from '../components/FlowProgress';

interface UploadResponse {
    upload_id: string;
    filename: string;
    rows: number;
    columns: string[];
    preview: any[];
    detected_format: string;
    mapping_suggestion: any;
}

export default function Upload() {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<UploadResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [validationAlerts, setValidationAlerts] = useState([
        { id: 1, type: 'warning', message: '12 rows have missing M-Pesa IDs' },
        { id: 2, type: 'error', message: 'Date format mismatch in column 2' }
    ]);

    // Mapping State
    const [mapping, setMapping] = useState({
        customer_id: '',
        transaction_date: '',
        amount: '',
        product: ''
    });

    // Mock data for preview
    const mockPreviewData = [
        { customer_id: '#KE-9021', customer_name: 'John Kamau', purchase_date: '24 Oct, 2024', amount: '12,500.00', product_category: 'ELECTRONICS', method: 'M-Pesa' },
        { customer_id: '#KE-9022', customer_name: 'Mary Wanjiku', purchase_date: '23 Oct, 2024', amount: '8,750.00', product_category: 'FASHION', method: 'M-Pesa' },
        { customer_id: '#KE-9023', customer_name: 'David Ochieng', purchase_date: '22 Oct, 2024', amount: '3,200.00', product_category: 'FOOD', method: 'Cash' },
        { customer_id: '#KE-9024', customer_name: 'Grace Atieno', purchase_date: '21 Oct, 2024', amount: '15,000.00', product_category: 'ELECTRONICS', method: 'M-Pesa' },
        { customer_id: '#KE-9025', customer_name: 'Samuel Kiprop', purchase_date: '20 Oct, 2024', amount: '5,600.00', product_category: 'FASHION', method: 'Card' },
        { customer_id: '#KE-9026', customer_name: 'Esther Muthoni', purchase_date: '19 Oct, 2024', amount: '9,800.00', product_category: 'HOME', method: 'M-Pesa' },
        { customer_id: '#KE-9027', customer_name: 'Peter Njoroge', purchase_date: '18 Oct, 2024', amount: '7,200.00', product_category: 'FOOD', method: 'Cash' },
        { customer_id: '#KE-9028', customer_name: 'Lucy Chebet', purchase_date: '17 Oct, 2024', amount: '11,300.00', product_category: 'ELECTRONICS', method: 'M-Pesa' },
        { customer_id: '#KE-9029', customer_name: 'James Mutua', purchase_date: '16 Oct, 2024', amount: '4,500.00', product_category: 'FASHION', method: 'Card' },
        { customer_id: '#KE-9030', customer_name: 'Sarah Akinyi', purchase_date: '15 Oct, 2024', amount: '6,800.00', product_category: 'HOME', method: 'M-Pesa' },
    ];

    const columns = ['customer_id', 'customer_name', 'purchase_date', 'amount (KSh)', 'product_category', 'method'];

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setResult(null);
            setStep(1);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false
    });

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);
        setProcessingProgress(0);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            setProcessingProgress(prev => {
                if (prev >= 85) {
                    clearInterval(progressInterval);
                    return 85;
                }
                return prev + 5;
            });
        }, 200);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await api.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            clearInterval(progressInterval);
            setProcessingProgress(100);
            setResult(data);
            if (data.mapping_suggestion) {
                setMapping(data.mapping_suggestion);
            }
            // Navigate to validation step
            navigate(`/dashboard/validate/${data.upload_id}`);
        } catch (err: any) {
            clearInterval(progressInterval);
            setError(err.response?.data?.detail || 'Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRunAnalysis = async () => {
        if (!result) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            await api.post('/api/analysis/run', mapping, {
                params: { upload_id: result.upload_id }
            });
            // Redirect to history for now, or dashboard
            navigate('/dashboard/history');
        } catch (err: any) {
            const message = err.response?.data?.detail || err.message || 'Analysis failed. Please check your network connection and session.';
            setError(message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setResult(null);
        setError(null);
        setStep(1);
    };

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Flow Progress */}
            <FlowProgress />
            
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h1 className="font-display text-xl font-bold">UPLOAD DATA</h1>
                    <p className="text-gray-600 text-sm">Data Import</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" />
                        Export Template
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Help
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upload Section - Left */}
                    <div className="lg:col-span-2">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-2">Data Import</h3>
                            <p className="text-gray-600 text-sm mb-6">Upload your sales data for AI-powered segmentation</p>
                            
                            {/* Dropzone */}
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                                    ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
                            >
                                <input {...getInputProps()} />
                                <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    {file ? file.name : 'Drop your customer CSV here'}
                                </h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'Compatible with .csv, .xlsx, .xls (Max 50MB)'}
                                </p>
                                <button className="btn-primary">Browse Files</button>
                            </div>

                            {file && (
                                <div className="mt-6 flex items-center justify-between">
                                    <button
                                        onClick={clearFile}
                                        disabled={isUploading}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={!file || isUploading}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {isUploading ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                        ) : (
                                            'Upload Data'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Data Preview Section */}
                        {(file || step === 2) && (
                            <div className="glass-card mt-6">
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-green-600" />
                                        <span className="font-semibold text-sm">Data Preview</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-900">
                                            <option>Sort: Newest</option>
                                            <option>Sort: Oldest</option>
                                            <option>Sort: Amount</option>
                                        </select>
                                        <Filter className="w-4 h-4 text-gray-400 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                {columns.map((col) => (
                                                    <th key={col} className="p-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockPreviewData.map((row, i) => (
                                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                    <td className="p-3 text-gray-900 font-mono text-xs">{row.customer_id}</td>
                                                    <td className="p-3 text-gray-900">{row.customer_name}</td>
                                                    <td className="p-3 text-gray-900">{row.purchase_date}</td>
                                                    <td className="p-3 text-gray-900 font-semibold">{row.amount}</td>
                                                    <td className="p-3 text-gray-900">
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-900">
                                                            {row.product_category}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-gray-900">
                                                        <span className={`px-2 py-1 rounded text-xs ${
                                                            row.method === 'M-Pesa' ? 'bg-green-100 text-green-700' :
                                                            row.method === 'Card' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {row.method}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                                    <p className="text-gray-600 text-sm">Total rows detected: 1,428 entries</p>
                                    <div className="flex items-center gap-3">
                                        <button className="btn-secondary">Cancel</button>
                                        <button 
                                            onClick={handleRunAnalysis}
                                            disabled={isAnalyzing}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            {isAnalyzing ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                            ) : (
                                                <>Proceed to Analyze <ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Current Upload */}
                        {file && (
                            <div className="glass-card p-6">
                                <h3 className="font-bold text-lg mb-4">CURRENT UPLOAD</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <FileSpreadsheet className="w-5 h-5 text-green-700" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                                            <p className="text-gray-600 text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600">Processing</span>
                                            <span className="text-gray-900 font-medium">{processingProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${processingProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {isUploading && (
                                        <div className="flex items-center gap-2 text-green-600 text-sm">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Analyzing data structure...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Validation Alerts */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                Validation Alerts
                            </h3>
                            <div className="space-y-3">
                                {validationAlerts.map((alert) => (
                                    <div key={alert.id} className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                                        alert.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                    }`}>
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span>{alert.message}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-400 text-xs mt-4">
                                These issues should be resolved before proceeding with analysis for best results.
                            </p>
                        </div>

                        {/* Quick Tips */}
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-4">Quick Tips</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                                    <p className="text-gray-600 text-sm">Ensure customer IDs are consistent across all transactions</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                                    <p className="text-gray-600 text-sm">Date format should be DD/MM/YYYY or MM/DD/YYYY</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></div>
                                    <p className="text-gray-600 text-sm">Include at least 3 months of data for accurate predictions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
