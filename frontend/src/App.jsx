// App.jsx - Root component with routes and context
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ComplaintListPage from './pages/ComplaintListPage';
import ComplaintFormPage from './pages/ComplaintFormPage';
import ComplaintDetailPage from './pages/ComplaintDetailPage';
import ComplaintEditPage from './pages/ComplaintEditPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute><ComplaintListPage /></ProtectedRoute>} />
            <Route path="/complaints/new" element={<ProtectedRoute><ComplaintFormPage /></ProtectedRoute>} />
            <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetailPage /></ProtectedRoute>} />
            <Route path="/complaints/:id/edit" element={<ProtectedRoute><ComplaintEditPage /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;
