import { useEffect, useState } from 'react';
import { profileApi } from '../api/profile.api';
import { PageHeader, FormError } from '../components/common/ui.jsx';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    profileApi
      .me()
      .then((r) => setUser(r.data.data))
      .catch((e) => setError(e));
  }, []);

  return (
    <div>
      <PageHeader title="My Profile" />
      <div className="card">
        <FormError error={error} />
        {!user ? (
          <div className="muted">Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label>Full name</label><div>{user.fullName}</div></div>
            <div><label>Email</label><div>{user.email}</div></div>
            <div><label>Phone</label><div>{user.phone}</div></div>
            <div><label>Address</label><div>{user.address || '-'}</div></div>
            <div><label>Role</label><div>{user.role?.name || '-'}</div></div>
            <div>
              <label>Permissions</label>
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
