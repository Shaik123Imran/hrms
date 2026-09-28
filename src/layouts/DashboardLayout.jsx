import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";

export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-[280px] w-[calc(100%-280px)] min-h-screen">
        <TopBar title={title} />
        <main className="w-full overflow-x-hidden p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}