import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { usePermission } from '../../hooks/usePermission.js';

export default function Layout() {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermission();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Gia Phuc</h2>
        {hasPermission('VIEW_STAFF') && (
          <NavLink to="/staff" className={({ isActive }) => (isActive ? 'active' : '')}>
            Staff
          </NavLink>
        )}
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          Profile
        </NavLink>
        <div style={{ marginTop: 24, fontSize: 13, opacity: 0.85 }}>
          <div>{user?.fullName}</div>
          <div className="muted">{user?.email}</div>
          <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
