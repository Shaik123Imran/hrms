import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Logout() {
  const { logout } = useAuth();
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((current) => current - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (countdown <= 0) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="auth-page">
      <div className="card login-card">
        <div className="card-body" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>See you soon!</h2>
          <p className="muted">You have been signed out. Redirecting to login in {countdown}s…</p>
        </div>
      </div>
    </div>
  );
}