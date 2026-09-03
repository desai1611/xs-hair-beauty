import { createContext, useContext, useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem('xs_admin_profile');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('xs_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => {
        setAdmin(res.data.admin);
        localStorage.setItem('xs_admin_profile', JSON.stringify(res.data.admin));
      })
      .catch(() => {
        localStorage.removeItem('xs_admin_token');
        localStorage.removeItem('xs_admin_profile');
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('xs_admin_token', res.data.token);
      localStorage.setItem('xs_admin_profile', JSON.stringify(res.data.admin));
      setAdmin(res.data.admin);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: extractErrorMessage(err, 'Login failed') };
    }
  }

  function logout() {
    localStorage.removeItem('xs_admin_token');
    localStorage.removeItem('xs_admin_profile');
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
