import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import Upload from './pages/Upload';
import History from './pages/History';
import AnalysisDetails from './pages/AnalysisDetails';

// Placeholder components for other dashboard pages
const SettingsPage = () => <div className="p-8"><h1 className="text-2xl font-bold mb-4">Account Settings</h1><p className="text-white/50">Manage your business profile and preferences.</p></div>;
import './index.css';

// Protect routes — redirect to /auth if not logged in
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
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
        <Route path="history" element={<History />} />
        <Route path="analysis/:id" element={<AnalysisDetails />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
