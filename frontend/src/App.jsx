import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import StaffListPage from './pages/StaffListPage.jsx';
import StaffCreatePage from './pages/StaffCreatePage.jsx';
import StaffEditPage from './pages/StaffEditPage.jsx';
import StaffViewPage from './pages/StaffViewPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function PrivateRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/staff" replace />} />
        <Route path="staff" element={<StaffListPage />} />
        <Route path="staff/new" element={<StaffCreatePage />} />
        <Route path="staff/:id" element={<StaffViewPage />} />
        <Route path="staff/:id/edit" element={<StaffEditPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
