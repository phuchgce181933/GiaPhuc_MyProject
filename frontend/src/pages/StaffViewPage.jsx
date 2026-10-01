import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { staffApi } from '../api/staff.api';
import { PageHeader, FormError } from '../components/common/ui.jsx';
import { usePermission } from '../hooks/usePermission.js';

export default function StaffViewPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { hasPermission } = usePermission();

  useEffect(() => {
    staffApi
      .get(id)
      .then((r) => setUser(r.data.data))
      .catch((e) => setError(e));
  }, [id]);

  return (
    <div>
      <PageHeader
        title={user ? user.fullName : 'Staff'}
        subtitle={user ? user.email : ''}
        actions={
          <>
            <Link to="/staff" className="btn btn-secondary" style={{ marginRight: 8 }}>
              ← Back
            </Link>
            {hasPermission('UPDATE_STAFF') && user && (
              <Link to={`/staff/${id}/edit`} className="btn btn-primary">Edit</Link>
            )}
          </>
        }
      />
      <div className="card">
        <FormError error={error} />
        {!user ? (
          <div className="muted">Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label>Phone</label><div>{user.phone}</div></div>
            <div><label>Address</label><div>{user.address || '-'}</div></div>
            <div><label>Role</label><div>{user.role?.name || '-'}</div></div>
            <div>
              <label>Status</label>
              <div>
                <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div>
              <label>Permissions granted to this user</label>
              <div className="muted">
                {(user.role?.permissions || []).map((p) => (typeof p === 'string' ? p : p.name)).join(', ') || '-'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
