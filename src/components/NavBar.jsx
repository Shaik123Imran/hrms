import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './NavBar.css';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <header className="hrms-navbar">
      <div />
      <div className="hrms-navbar-user">
        <span className="hrms-navbar-avatar">{initials}</span>
        <div className="hrms-navbar-user-info">
          <span className="hrms-navbar-user-name">{user?.name}</span>
          <span className="hrms-navbar-user-role">{user?.role}</span>
        </div>
        <button className="hrms-navbar-logout" onClick={handleLogout} aria-label="Logout" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
