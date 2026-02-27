import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, X, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../lib/api';

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

    // Mapping State
    const [mapping, setMapping] = useState({
        customer_id: '',
        transaction_date: '',
        amount: '',
        product: ''
    });

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

        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await api.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(data);
            if (data.mapping_suggestion) {
                setMapping(data.mapping_suggestion);
            }
            setStep(2);
        } catch (err: any) {
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
            setError(err.response?.data?.detail || 'Analysis failed. Please check your column mapping.');
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
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="font-display text-2xl font-bold">
                    {step === 1 ? 'Upload Customer Data' : 'Configure Column Mapping'}
                </h1>
                <p className="text-white/50 mt-1">
                    {step === 1
                        ? 'Upload your CSV transaction data (M-Pesa, POS, or Excel export) to start.'
                        : 'Confirm which columns in your file represent the key transaction data.'}
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6 animate-in fade-in zoom-in duration-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {step === 1 ? (
                <div className="space-y-6">
                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`glass-card border-2 border-dashed p-12 flex flex-col items-center justify-center transition-colors cursor-pointer
                            ${isDragActive ? 'border-primary-500 bg-primary-500/5' : 'border-white/10 hover:border-white/20'}`}
                    >
                        <input {...getInputProps()} />
                        <div className="w-16 h-16 rounded-2xl bg-primary-600/20 flex items-center justify-center mb-4">
                            <UploadIcon className="w-8 h-8 text-primary-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1 text-center">
                            {file ? file.name : 'Click or drag CSV here'}
                        </h3>
                        <p className="text-white/40 text-sm text-center">
                            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Only .csv files are supported (max 50MB)'}
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        {file && (
                            <button
                                onClick={clearFile}
                                disabled={isUploading}
                                className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className="btn-primary px-8 flex items-center gap-2"
                        >
                            {isUploading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                            ) : (
                                'Upload & Preview'
                            )}
                        </button>
                    </div>
                </div>
            ) : result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mapping Form */}
                        <div className="space-y-6">
                            <div className="glass-card p-6 space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    Map your columns
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-white/50 mb-1.5">Customer Identifier (ID/Phone)</label>
                                        <select
                                            value={mapping.customer_id}
                                            onChange={(e) => setMapping({ ...mapping, customer_id: e.target.value })}
                                            className="input text-sm"
                                        >
                                            <option value="">Select column...</option>
                                            {result.columns.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-white/50 mb-1.5">Transaction Date</label>
                                        <select
                                            value={mapping.transaction_date}
                                            onChange={(e) => setMapping({ ...mapping, transaction_date: e.target.value })}
                                            className="input text-sm"
                                        >
                                            <option value="">Select column...</option>
                                            {result.columns.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-white/50 mb-1.5">Transaction Amount (KSh)</label>
                                        <select
                                            value={mapping.amount}
                                            onChange={(e) => setMapping({ ...mapping, amount: e.target.value })}
                                            className="input text-sm"
                                        >
                                            <option value="">Select column...</option>
                                            {result.columns.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Back to upload
                                </button>
                                <button
                                    onClick={handleRunAnalysis}
                                    disabled={isAnalyzing || !mapping.customer_id || !mapping.transaction_date || !mapping.amount}
                                    className="btn-primary px-10 flex items-center gap-2"
                                >
                                    {isAnalyzing ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                                    ) : (
                                        <>Run AI Analysis <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="glass-card flex flex-col h-full max-h-[400px]">
                            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary-400" />
                                    <span className="font-semibold text-sm">Data Preview</span>
                                </div>
                                <span className="text-[10px] text-white/40 font-bold uppercase">{result.filename}</span>
                            </div>
                            <div className="overflow-auto flex-1">
                                <table className="w-full text-left text-[11px] border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 sticky top-0">
                                            {result.columns.slice(0, 4).map((col) => (
                                                <th key={col} className="p-3 font-semibold text-white/60 border-b border-white/5">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.preview.map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 last:border-0">
                                                {result.columns.slice(0, 4).map((col) => (
                                                    <td key={col} className="p-3 text-white/30 truncate max-w-[120px]">
                                                        {String(row[col])}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step indicator */}
            <div className="mt-12 flex items-center justify-center gap-8">
                {[
                    { label: 'Upload', active: step === 1 },
                    { label: 'Map Columns', active: step === 2 },
                    { label: 'Run Analysis', active: false }
                ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center
                            ${s.active ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-surface-800 text-white/30'}`}>
                            {i + 1}
                        </div>
                        <span className={`text-xs font-medium ${s.active ? 'text-white' : 'text-white/30'}`}>
                            {s.label}
                        </span>
                        {i < 2 && <div className="w-12 h-[1px] bg-white/5 ml-4" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
