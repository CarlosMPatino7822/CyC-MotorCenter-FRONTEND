import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import CarsPage from './pages/CarsPage';
import BikesPage from './pages/BikesPage';
import './App.css';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout><DashboardPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute>
          <AppLayout><UsersPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/cars" element={
        <ProtectedRoute>
          <AppLayout><CarsPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/bikes" element={
        <ProtectedRoute>
          <AppLayout><BikesPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
    </Routes>
  );
}

export default App;
