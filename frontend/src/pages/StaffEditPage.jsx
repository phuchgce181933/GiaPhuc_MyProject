import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { staffApi } from '../api/staff.api';
import { roleApi } from '../api/role.api';
import { usePermission } from '../hooks/usePermission.js';
import { PageHeader, FormError } from '../components/common/ui.jsx';

export default function StaffEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [u, r] = await Promise.all([staffApi.get(id), roleApi.list()]);
        const user = u.data.data;
        setForm({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          roleId: user.role?._id || user.role?.id || '',
          isActive: user.isActive,
        });
        setRoles(r.data.data || []);
      } catch (e) {
        setError(e);
      }
    })();
  }, [id]);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { roleId, ...rest } = form;
      await staffApi.update(id, rest);
      if (hasPermission('ASSIGN_ROLE')) {
        await staffApi.assignRole(id, roleId);
      }
      toast.success('Staff updated');
      navigate(`/staff/${id}`);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const onToggleActive = async () => {
    try {
      await staffApi.setActive(id, !form.isActive);
      setForm((f) => ({ ...f, isActive: !f.isActive }));
      toast.success(`Staff ${!form.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      setError(err);
    }
  };

  if (!form) return <div className="muted">Loading...</div>;

  return (
    <div>
      <PageHeader title={`Edit Staff`} subtitle={`Updating ${form.fullName}`} />
      <form className="card" onSubmit={onSubmit}>
        <FormError error={error} />
        <div className="row">
          <div>
            <label>Full name *</label>
            <input value={form.fullName} onChange={set('fullName')} required />
          </div>
          <div>
            <label>Email *</label>
            <input type="email" value={form.email} onChange={set('email')} required />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Phone *</label>
            <input value={form.phone} onChange={set('phone')} required />
          </div>
          <div>
            <label>Role *</label>
            {hasPermission('ASSIGN_ROLE') ? (
              <select
                value={form.roleId}
                onChange={set('roleId')}
                required
              >
                <option value="">— Select role —</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            ) : (
              <div className="muted">
                {roles.find((r) => r.id === form.roleId)?.name || '-'}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Address</label>
          <input value={form.address} onChange={set('address')} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving...' : 'Save changes'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onToggleActive}>
            {form.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </form>
    </div>
  );
}
