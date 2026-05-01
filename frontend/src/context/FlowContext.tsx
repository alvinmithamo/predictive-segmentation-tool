import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AnalysisDetail } from '../pages/Recommendations';

export interface FlowState {
  uploadId: string | null;
  filename: string | null;
  currentStep: 'upload' | 'validate' | 'segment' | 'predict' | 'recommend';
  validationData: any | null;
  analysisData: AnalysisDetail | null;
  predictionData: any | null;
  recommendationsData: any | null;
  isComplete: boolean;
  errors: string[];
}

type FlowAction =
  | { type: 'SET_UPLOAD_ID'; payload: string }
  | { type: 'SET_FILENAME'; payload: string }
  | { type: 'SET_CURRENT_STEP'; payload: FlowState['currentStep'] }
  | { type: 'SET_VALIDATION_DATA'; payload: any }
  | { type: 'SET_ANALYSIS_DATA'; payload: AnalysisDetail }
  | { type: 'SET_PREDICTION_DATA'; payload: any }
  | { type: 'SET_RECOMMENDATIONS_DATA'; payload: any }
  | { type: 'SET_COMPLETE' }
  | { type: 'ADD_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET_FLOW' };

const initialState: FlowState = {
  uploadId: null,
  filename: null,
  currentStep: 'upload',
  validationData: null,
  analysisData: null,
  predictionData: null,
  recommendationsData: null,
  isComplete: false,
  errors: [],
};

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'SET_UPLOAD_ID':
      return { ...state, uploadId: action.payload };
    case 'SET_FILENAME':
      return { ...state, filename: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_VALIDATION_DATA':
      return { ...state, validationData: action.payload };
    case 'SET_ANALYSIS_DATA':
      return { ...state, analysisData: action.payload };
    case 'SET_PREDICTION_DATA':
      return { ...state, predictionData: action.payload };
    case 'SET_RECOMMENDATIONS_DATA':
      return { ...state, recommendationsData: action.payload };
    case 'SET_COMPLETE':
      return { ...state, isComplete: true };
    case 'ADD_ERROR':
      return { ...state, errors: [...state.errors, action.payload] };
    case 'CLEAR_ERRORS':
      return { ...state, errors: [] };
    case 'RESET_FLOW':
      return initialState;
    default:
      return state;
  }
}

interface FlowContextType {
  state: FlowState;
  setUploadId: (id: string) => void;
  setFilename: (name: string) => void;
  setCurrentStep: (step: FlowState['currentStep']) => void;
  setValidationData: (data: any) => void;
  setAnalysisData: (data: AnalysisDetail) => void;
  setPredictionData: (data: any) => void;
  setRecommendationsData: (data: any) => void;
  completeFlow: () => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  resetFlow: () => void;
  canProceedToStep: (step: FlowState['currentStep']) => boolean;
  getStepProgress: () => { completed: number; total: number };
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flowReducer, initialState);

  const setUploadId = (id: string) => dispatch({ type: 'SET_UPLOAD_ID', payload: id });
  const setFilename = (name: string) => dispatch({ type: 'SET_FILENAME', payload: name });
  const setCurrentStep = (step: FlowState['currentStep']) => dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  const setValidationData = (data: any) => dispatch({ type: 'SET_VALIDATION_DATA', payload: data });
  const setAnalysisData = (data: AnalysisDetail) => dispatch({ type: 'SET_ANALYSIS_DATA', payload: data });
  const setPredictionData = (data: any) => dispatch({ type: 'SET_PREDICTION_DATA', payload: data });
  const setRecommendationsData = (data: any) => dispatch({ type: 'SET_RECOMMENDATIONS_DATA', payload: data });
  const completeFlow = () => dispatch({ type: 'SET_COMPLETE' });
  const addError = (error: string) => dispatch({ type: 'ADD_ERROR', payload: error });
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });
  const resetFlow = () => dispatch({ type: 'RESET_FLOW' });

  const canProceedToStep = (step: FlowState['currentStep']): boolean => {
    const steps: FlowState['currentStep'][] = ['upload', 'validate', 'segment', 'predict', 'recommend'];
    const currentStepIndex = steps.indexOf(state.currentStep);
    const targetStepIndex = steps.indexOf(step);

    if (targetStepIndex <= currentStepIndex) return true; // Can go back to previous steps

    // Check prerequisites for forward movement
    switch (step) {
      case 'validate':
        return !!state.uploadId;
      case 'segment':
        return !!state.uploadId && !!state.validationData;
      case 'predict':
        return !!state.uploadId && !!state.validationData && !!state.analysisData;
      case 'recommend':
        return !!state.uploadId && !!state.validationData && !!state.analysisData && !!state.predictionData;
      default:
        return false;
    }
  };

  const getStepProgress = () => {
    const steps = ['upload', 'validate', 'segment', 'predict', 'recommend'];
    const currentStepIndex = steps.indexOf(state.currentStep);
    return {
      completed: currentStepIndex + 1,
      total: steps.length,
    };
  };

  const value: FlowContextType = {
    state,
    setUploadId,
    setFilename,
    setCurrentStep,
    setValidationData,
    setAnalysisData,
    setPredictionData,
    setRecommendationsData,
    completeFlow,
    addError,
    clearErrors,
    resetFlow,
    canProceedToStep,
    getStepProgress,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}
