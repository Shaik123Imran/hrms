import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getInitials } from '../utils/formatters.js';

function findTitle(pathname) {
  if (pathname === '/employees/new') return 'Add Employee';
  if (/^\/employees\/[^/]+\/edit$/.test(pathname)) return 'Edit Employee';
  if (pathname.startsWith('/employees')) return 'Employees';
  if (pathname.startsWith('/attendance')) return 'Attendance';
  if (pathname.startsWith('/leaves')) return 'Leave Management';
  if (pathname.startsWith('/logout')) return 'Logout';
  return 'Dashboard';
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [firstName, ...rest] = (user?.name || '').split(' ');
  const lastName = rest.join(' ');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <h1 className="navbar-title">{findTitle(location.pathname)}</h1>

      <div className="navbar-user">
        <div className="avatar avatar-sm avatar-user">{getInitials(firstName, lastName)}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
          <div className="muted text-sm">{user?.role}</div>
        </div>
        <button className="icon-btn" onClick={handleLogout} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}