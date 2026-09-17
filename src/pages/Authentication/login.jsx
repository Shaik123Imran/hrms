import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const session = await login(email, password);
    setSubmitting(false);
    if (!session) {
      setError('Invalid email or password.');
      return;
    }
    const redirectTo = location.state?.from?.pathname || '/';
    navigate(redirectTo, { replace: true });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '360px',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          padding: '1.75rem',
          boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '0.5rem',
              background: '#4f46e5',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            H
          </span>
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>HRMS</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Sign in to your account</p>

        {error && (
          <p style={{ background: '#fef2f2', color: '#dc2626', padding: '0.5rem 0.7rem', borderRadius: '0.4rem', fontSize: '0.82rem', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '0.85rem' }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@hrms.com"
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '1.25rem' }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '0.4rem',
            padding: '0.6rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  marginTop: '0.3rem',
  width: '100%',
  borderRadius: '0.4rem',
  border: '1px solid #e2e8f0',
  padding: '0.55rem 0.7rem',
  fontSize: '0.85rem',
  color: '#1e293b',
};
