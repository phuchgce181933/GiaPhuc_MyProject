import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Permission helper for the frontend.  The backend is the security boundary —
 * this hook exists purely to drive UI affordances (show / hide menus and
 * buttons).
 */
export function usePermission() {
  const { user } = useAuth();
  const granted = new Set();

  if (user && user.role && Array.isArray(user.role.permissions)) {
    for (const p of user.role.permissions) {
      granted.add(typeof p === 'string' ? p : p.name);
    }
  }

  return {
    hasPermission(name) {
      return granted.has(name);
    },
    permissions: Array.from(granted),
  };
}
