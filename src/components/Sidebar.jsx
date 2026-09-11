import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck2, CalendarRange, LogOut } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users, end: false },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck2, end: true },
  { to: '/leaves', label: 'Leave Management', icon: CalendarRange, end: true },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">H</div>
        <span className="sidebar-brand-title">HRMS</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink to="/logout" className="nav-link">
          <LogOut size={18} />
          <span>Logout</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">HRMS v1.0 · Mock data</div>
    </aside>
  );
}