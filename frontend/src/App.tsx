import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useAuthStore } from './store/auth.store';

// Pages
import Login from './pages/auth/Login';
import DashboardLayout from './components/layouts/DashboardLayout';
import LiveMap from './pages/dashboard/LiveMap';
import BusesPage from './pages/fleet/Buses';
import UsersPage from './pages/auth/Users';
import RoutesMap from './pages/fleet/RoutesMap';
import GeofencesMap from './pages/alerting/GeofencesMap';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="loading-screen">Cargando plataforma...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/map" replace />} />
          <Route path="map" element={<LiveMap />} />
          <Route path="buses" element={<BusesPage />} />
          <Route path="routes" element={<RoutesMap />} />
          <Route path="alerts" element={<GeofencesMap />} />
          <Route path="users" element={<UsersPage />} />
          {/* other sub-routes will go here */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
