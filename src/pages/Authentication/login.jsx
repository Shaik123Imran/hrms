import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/Button.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const session = await login(email, password);
    setLoading(false);
    if (!session) {
      setError('Invalid email or password. Try the demo credentials below.');
    }
  };

  return (
    <div className="auth-page">
      <div className="card login-card">
        <div className="card-body">
          <div className="auth-brand">
            <div className="sidebar-brand-logo">H</div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>HRMS</h2>
              <p className="muted text-sm">Human Resource Management System</p>
            </div>
          </div>

          {error && <div className="alert alert-danger mb-4">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="admin@hrms.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <Button type="submit" className="btn-block" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <div className="divider" />

          <div className="alert alert-info text-sm">
            <strong>Demo credentials</strong>
            <br />
            admin@hrms.com / admin123
            <br />
            hr@hrms.com / hr123
          </div>
        </div>
      </div>
    </div>
  );
}