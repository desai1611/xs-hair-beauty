import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!loading && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await login(email, password);
    setSubmitting(false);
    if (res.ok) {
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } else {
      setError(res.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-mid border border-pink-100 p-8">
        <div className="flex items-center gap-2.5 font-display text-xl font-bold text-plum-900 mb-1 justify-center">
          <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--color-pink-300), var(--color-pink-600))' }}>XS</span>
          XS Hair &amp; Beauty
        </div>
        <p className="text-center text-sm text-text-light mb-7">Admin Dashboard Login</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field mb-4">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="field mb-6">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={submitting} className="btn btn-primary btn-block disabled:opacity-60">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
