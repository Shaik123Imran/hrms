import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import NavBar from '../components/NavBar.jsx';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <div className="hrms-app-shell">
      <Sidebar />
      <div className="hrms-app-main">
        <NavBar />
        <main className="hrms-app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}