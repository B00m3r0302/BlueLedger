import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CRM from './pages/CRM';
import Shipments from './pages/Shipments';
import Contracts from './pages/Contracts';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/crm" 
        element={
          <ProtectedRoute>
            <CRM />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/shipments" 
        element={
          <ProtectedRoute>
            <Shipments />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/contracts" 
        element={
          <ProtectedRoute>
            <Contracts />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;