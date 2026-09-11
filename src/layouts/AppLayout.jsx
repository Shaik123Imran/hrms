import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import NavBar from '../components/NavBar.jsx';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <NavBar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}