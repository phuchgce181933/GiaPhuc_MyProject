import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { staffApi } from '../api/staff.api';
import { usePermission } from '../hooks/usePermission.js';
import { PageHeader, FormError } from '../components/common/ui.jsx';

export default function StaffListPage() {
  const { hasPermission } = usePermission();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await staffApi.list();
      setItems(data.data.items || []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageHeader
        title="Staff Management"
        subtitle="Create, view, update and assign roles to staff members."
        actions={
          hasPermission('CREATE_STAFF') && (
            <Link to="/staff/new" className="btn btn-primary">+ Create Staff</Link>
          )
        }
      />
      <div className="card">
        <FormError error={error} />
        {loading ? (
          <div className="muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="muted">No staff yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Full name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.role?.name || '-'}</td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-active' : 'badge-inactive'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/staff/${u._id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
