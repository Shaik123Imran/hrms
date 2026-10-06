import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";

export default function DashboardLayout({ children, title }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar collapsed={sidebarCollapsed} />

      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[280px]"
        }`}
      >
        <TopBar
          title={title}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="min-w-0 overflow-x-hidden p-4 md:p-6">
          {children}
        </main>
      </div>

    </div>
  );
}