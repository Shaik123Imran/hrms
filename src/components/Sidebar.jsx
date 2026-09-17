import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck2, CalendarDays, LogOut } from 'lucide-react';
import './Sidebar.css';

const LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck2 },
  { to: '/leaves', label: 'Leave Management', icon: CalendarDays },
];

export default function Sidebar() {
  return (
    <aside className="hrms-sidebar">
      <div className="hrms-sidebar-logo">
        <span className="hrms-sidebar-logo-mark">H</span>
        <span className="hrms-sidebar-logo-text">HRMS</span>
      </div>

      <nav className="hrms-sidebar-nav">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `hrms-sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink to="/logout" className="hrms-sidebar-link hrms-sidebar-logout">
        <LogOut size={18} />
        <span>Logout</span>
      </NavLink>
    </aside>
  );
}