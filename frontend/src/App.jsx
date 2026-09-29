import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages for optimized performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfileBuilderPage = lazy(() => import('./pages/ProfileBuilderPage'));
const AnalyzingPage = lazy(() => import('./pages/AnalyzingPage'));
const ResultsDashboardPage = lazy(() => import('./pages/ResultsDashboardPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const RolesCatalogPage = lazy(() => import('./pages/RolesCatalogPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));

function PageLoader() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '70vh' }}
    >
      <div className="spinner-border text-info" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Navbar />
            <main className="flex-grow-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfileBuilderPage />} />
                  <Route path="/analyzing" element={<AnalyzingPage />} />
                  <Route path="/results" element={<ResultsDashboardPage />} />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <HistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/roles" element={<RolesCatalogPage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
