export function FormError({ error }) {
  if (!error) return null;
  const msg = error.response?.data?.message || error.message || 'Request failed';
  return <div className="error">{msg}</div>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="toolbar" style={{ marginBottom: 16 }}>
      <div>
        <h1 style={{ marginBottom: 4 }}>{title}</h1>
        {subtitle && <div className="muted">{subtitle}</div>}
      </div>
      <div>{actions}</div>
    </div>
  );
}
