import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FlowProvider } from './context/FlowContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import Upload from './pages/Upload';
import History from './pages/History';
import AnalysisDetails from './pages/AnalysisDetails';
import SegmentsView from './pages/SegmentsView';
import Segmentation from './pages/Segmentation';
import SegmentAnalysis from './pages/SegmentAnalysis';
import Validate from './pages/Validate';
import Predictions from './pages/Predictions';
import PredictionsDashboard from './pages/PredictionsDashboard';
import RecommendationsView from './pages/Recommendations';
import SettingsPage from './pages/Settings';

import './index.css';

// Protect routes — redirect to /auth if not logged in
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

// Redirect logged-in users away from /auth
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="upload" element={<Upload />} />
        <Route path="validate/:id" element={<Validate />} />
        <Route path="analysis/:id/segment" element={<SegmentAnalysis />} />
        <Route path="segmentation" element={<Segmentation />} />
        <Route path="history" element={<History />} />
        <Route path="predictions" element={<PredictionsDashboard />} />
        <Route path="analysis/:id" element={<AnalysisDetails />} />
        <Route path="analysis/:id/segments" element={<SegmentsView />} />
        <Route path="analysis/:id/predictions" element={<Predictions />} />
        <Route path="analysis/:id/recommendations" element={<RecommendationsView />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FlowProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FlowProvider>
    </AuthProvider>
  );
}
