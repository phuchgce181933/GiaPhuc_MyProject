import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { staffApi } from '../api/staff.api';
import { roleApi } from '../api/role.api';
import { PageHeader, FormError } from '../components/common/ui.jsx';

export default function StaffCreatePage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    roleId: '',
    temporaryPassword: '',
  });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    roleApi
      .list()
      .then((r) => {
        const list = r.data.data || [];
        setRoles(list);
        if (list.length && !form.roleId) {
          setForm((f) => ({ ...f, roleId: list[0].id }));
        }
      })
      .catch((e) => setError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const payload = { ...form };
      if (!payload.temporaryPassword) delete payload.temporaryPassword;
      const { data } = await staffApi.create(payload);
      if (data.data.emailNotificationSent) {
        toast.success('Staff account created. Email notification sent.');
      } else {
        toast('Staff account created. Email notification failed — check logs.', { icon: '⚠️' });
      }
      navigate(`/staff/${data.data.user._id}`);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="Create Staff" subtitle="Provision a new staff account." />
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
            <select value={form.roleId} onChange={set('roleId')} required>
              <option value="">— Select role —</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Address</label>
          <input value={form.address} onChange={set('address')} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Temporary password (optional, min 8 chars)</label>
          <input
            type="text"
            value={form.temporaryPassword}
            onChange={set('temporaryPassword')}
            placeholder="Leave empty to auto-generate"
          />
        </div>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Creating...' : 'Create staff'}
        </button>
      </form>
    </div>
  );
}
