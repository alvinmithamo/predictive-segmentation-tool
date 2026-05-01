import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface FlowStep {
  id: string;
  name: string;
  description: string;
  path: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface FlowProgressProps {
  uploadId?: string;
  currentStep?: string;
}

export default function FlowProgress({ uploadId }: FlowProgressProps) {
  const location = useLocation();

  // Determine flow steps based on current location and uploadId
  const getFlowSteps = (): FlowStep[] => {
    const basePath = uploadId ? `/dashboard/analysis/${uploadId}` : '/dashboard';
    
    return [
      {
        id: 'upload',
        name: 'Upload',
        description: 'Import your data',
        path: '/dashboard/upload',
        status: location.pathname === '/dashboard/upload' ? 'current' : 'completed'
      },
      {
        id: 'validate',
        name: 'Validate',
        description: 'Data quality checks',
        path: uploadId ? `/dashboard/validate/${uploadId}` : '#',
        status: location.pathname.includes('/validate/') ? 'current' : 
                uploadId ? 'upcoming' : 'upcoming'
      },
      {
        id: 'segment',
        name: 'Segment',
        description: 'Customer segmentation',
        path: uploadId ? `${basePath}/segments` : '#',
        status: location.pathname.includes('/segments') ? 'current' : 'upcoming'
      },
      {
        id: 'predict',
        name: 'Predict',
        description: 'AI predictions',
        path: uploadId ? `${basePath}/predictions` : '#',
        status: location.pathname.includes('/predictions') ? 'current' : 'upcoming'
      },
      {
        id: 'recommend',
        name: 'Recommend',
        description: 'Actionable insights',
        path: uploadId ? `${basePath}/recommendations` : '#',
        status: location.pathname.includes('/recommendations') ? 'current' : 'upcoming'
      }
    ];
  };

  const steps = getFlowSteps();

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'current':
        return <div className="w-5 h-5 rounded-full bg-green-600 border-2 border-white shadow-sm" />;
      case 'upcoming':
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'current':
        return 'text-green-700 bg-green-100 border-green-300 shadow-sm';
      case 'upcoming':
        return 'text-gray-500 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${getStepColor(step.status)}`}>
                {getStepIcon(step.status)}
              </div>
              <div className={`font-medium text-sm mb-1 ${step.status === 'current' ? 'text-green-700' : step.status === 'completed' ? 'text-green-600' : 'text-gray-500'}`}>
                {step.name}
              </div>
              <div className="text-xs text-gray-500 max-w-20">
                {step.description}
              </div>
            </div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <div className="flex items-center justify-center px-2">
                <ArrowRight className={`w-4 h-4 ${index < steps.findIndex(s => s.status === 'current') ? 'text-green-400' : 'text-gray-300'}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
