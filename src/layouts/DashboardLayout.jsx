import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";

export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar title={title} />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}