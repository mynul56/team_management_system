import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import DailyUpdate from './pages/DailyUpdate';
import Leave from './pages/Leave';
import MyKpis from './pages/MyKpis';
import UserDashboard from './pages/UserDashboard';
import Dashboard from './pages/admin/Dashboard';
import Projects from './pages/admin/Projects';
import Users from './pages/admin/Users';
import LeaveAdmin from './pages/admin/LeaveAdmin';
import KpisAdmin from './pages/admin/KpisAdmin';
import DailyUpdatesAdmin from './pages/admin/DailyUpdatesAdmin';
import AttendanceAdmin from './pages/admin/AttendanceAdmin';
import KpiDistribution from './pages/admin/KpiDistribution';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="daily-update" element={<DailyUpdate />} />
        <Route path="leave" element={<Leave />} />
        <Route path="kpis" element={<MyKpis />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/projects"
          element={
            <ProtectedRoute adminOnly>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute adminOnly>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/leave"
          element={
            <ProtectedRoute adminOnly>
              <LeaveAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/kpis"
          element={
            <ProtectedRoute adminOnly>
              <KpisAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/daily-updates"
          element={
            <ProtectedRoute adminOnly>
              <DailyUpdatesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/attendance"
          element={
            <ProtectedRoute adminOnly>
              <AttendanceAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/kpi-distribution"
          element={
            <ProtectedRoute adminOnly>
              <KpiDistribution />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
