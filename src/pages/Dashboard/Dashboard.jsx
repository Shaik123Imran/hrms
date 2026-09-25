import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck2,
  CalendarOff,
  Clock,
  TrendingUp,
  Shield,
  Umbrella,
  ClipboardList,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import * as dataService from '../../services/dataService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Card from '../../components/Card.jsx';
import StatCard from '../../components/StatCard.jsx';

const PIE_COLORS = ['#1e293b', '#0d9488', '#d97706', '#15803d', '#64748b', '#b91c1c'];
const ATTENDANCE_BAR_COLORS = {
  Present: '#16a34a',
  WFH: '#0891b2',
  Late: '#d97706',
  'Half Day': '#94a3b8',
  'On Leave': '#dc2626',
  Absent: '#dc2626',
};

const PARTICLE_COUNT = 16;

function DashboardAtmosphere() {
  return (
    <>
      <div className="dashboard-orb dashboard-orb-1" aria-hidden="true" />
      <div className="dashboard-orb dashboard-orb-2" aria-hidden="true" />
      <div className="dashboard-gradient-bars" aria-hidden="true" />
      <div className="dashboard-particles" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <span key={i} className={`dashboard-particle dashboard-particle-${i + 1}`} />
        ))}
      </div>
    </>
  );
}


const DASHBOARD_CSS = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');\n\n.dashboard-page {\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.dashboard-page {\n  position: relative;\n  padding: 1.75rem 2rem 3rem;\n  overflow: hidden;\n  isolation: isolate;\n  background: linear-gradient(160deg, #f8fafc 0%, #eef1f6 45%, #f4f6fa 100%);\n}\n\n\n.dashboard-orb {\n  position: absolute;\n  border-radius: 9999px;\n  filter: blur(60px);\n  opacity: 0.35;\n  pointer-events: none;\n  z-index: -2;\n}\n\n.dashboard-orb-1 {\n  width: 420px;\n  height: 420px;\n  top: -160px;\n  right: -100px;\n  background: radial-gradient(circle, #475569 0%, transparent 70%);\n}\n\n.dashboard-orb-2 {\n  width: 380px;\n  height: 380px;\n  top: 220px;\n  left: -140px;\n  background: radial-gradient(circle, #94a3b8 0%, transparent 70%);\n  opacity: 0.25;\n}\n\n.dashboard-gradient-bars {\n  position: absolute;\n  inset: -10% -10%;\n  z-index: -1;\n  pointer-events: none;\n  opacity: 0.07;\n  background-image: repeating-linear-gradient(\n    100deg,\n    #0f172a 0%,\n    #475569 8%,\n    #cbd5e1 16%,\n    #f8fafc 24%,\n    #94a3b8 32%,\n    #1e293b 40%,\n    #e2e8f0 48%,\n    #64748b 56%,\n    #0f172a 64%\n  );\n  background-size: 220% 100%;\n  animation: dashboard-bars-loop 36s linear infinite;\n  mask-image: radial-gradient(ellipse 85% 65% at 50% 0%, black 35%, transparent 100%);\n  -webkit-mask-image: radial-gradient(ellipse 85% 65% at 50% 0%, black 35%, transparent 100%);\n}\n\n\n.dashboard-particles {\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  pointer-events: none;\n  overflow: hidden;\n}\n\n.dashboard-particle {\n  position: absolute;\n  bottom: -20px;\n  width: 6px;\n  height: 6px;\n  border-radius: 9999px;\n  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(148, 163, 184, 0.4) 70%, transparent 100%);\n  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);\n  animation-name: dashboard-particle-float;\n  animation-timing-function: ease-in-out;\n  animation-iteration-count: infinite;\n}\n\n.dashboard-particle-1  { left: 4%;  width: 5px;  height: 5px;  animation-duration: 18s; animation-delay: 0s; }\n.dashboard-particle-2  { left: 11%; width: 8px;  height: 8px;  animation-duration: 24s; animation-delay: 2s; }\n.dashboard-particle-3  { left: 18%; width: 4px;  height: 4px;  animation-duration: 15s; animation-delay: 4s; }\n.dashboard-particle-4  { left: 26%; width: 7px;  height: 7px;  animation-duration: 21s; animation-delay: 1s; }\n.dashboard-particle-5  { left: 34%; width: 5px;  height: 5px;  animation-duration: 19s; animation-delay: 6s; }\n.dashboard-particle-6  { left: 42%; width: 9px;  height: 9px;  animation-duration: 26s; animation-delay: 3s; }\n.dashboard-particle-7  { left: 50%; width: 4px;  height: 4px;  animation-duration: 16s; animation-delay: 5s; }\n.dashboard-particle-8  { left: 58%; width: 6px;  height: 6px;  animation-duration: 22s; animation-delay: 0.5s; }\n.dashboard-particle-9  { left: 65%; width: 8px;  height: 8px;  animation-duration: 20s; animation-delay: 7s; }\n.dashboard-particle-10 { left: 72%; width: 5px;  height: 5px;  animation-duration: 17s; animation-delay: 2.5s; }\n.dashboard-particle-11 { left: 79%; width: 7px;  height: 7px;  animation-duration: 23s; animation-delay: 4.5s; }\n.dashboard-particle-12 { left: 85%; width: 4px;  height: 4px;  animation-duration: 15s; animation-delay: 8s; }\n.dashboard-particle-13 { left: 91%; width: 6px;  height: 6px;  animation-duration: 25s; animation-delay: 1.5s; }\n.dashboard-particle-14 { left: 96%; width: 5px;  height: 5px;  animation-duration: 18s; animation-delay: 6.5s; }\n.dashboard-particle-15 { left: 55%; width: 3px;  height: 3px;  animation-duration: 14s; animation-delay: 9s; }\n.dashboard-particle-16 { left: 8%;  width: 3px;  height: 3px;  animation-duration: 13s; animation-delay: 10s; }\n\n\n.dashboard-page .page-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n  margin-bottom: 1.75rem;\n}\n\n.dashboard-page .page-title {\n  font-size: 1.6rem;\n  font-weight: 700;\n  letter-spacing: -0.03em;\n  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #475569 100%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n}\n\n.dashboard-page .page-subtitle {\n  margin-top: 0.35rem;\n  font-size: 0.875rem;\n  font-weight: 400;\n  color: #9c9bad;\n  letter-spacing: -0.005em;\n}\n\n.dashboard-role-pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.35rem;\n  font-size: 0.66rem;\n  font-weight: 600;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  padding: 0.24rem 0.7rem;\n  border-radius: 9999px;\n  background: linear-gradient(135deg, #f1f5f9, #f8fafc);\n  color: #475569;\n  margin-left: 0.65rem;\n  vertical-align: middle;\n  border: 1px solid rgba(15, 23, 42, 0.06);\n}\n\n.dashboard-today {\n  font-size: 0.78rem;\n  color: #b0afc0;\n  font-weight: 500;\n  letter-spacing: 0.01em;\n  padding-top: 0.35rem;\n}\n\n\n.dashboard-page .grid-stats {\n  gap: 1.1rem;\n}\n\n.dashboard-page .stat-card {\n  position: relative;\n  background: rgba(255, 255, 255, 0.6);\n  backdrop-filter: blur(18px) saturate(160%);\n  -webkit-backdrop-filter: blur(18px) saturate(160%);\n  border: 1px solid rgba(255, 255, 255, 0.7);\n  border-radius: 1.1rem;\n  box-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.8),\n    0 1px 2px rgba(15, 23, 42, 0.04),\n    0 12px 28px -14px rgba(15, 23, 42, 0.18);\n  padding: 1.1rem 1.2rem;\n  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease, border-color 0.25s ease;\n  animation: dashboard-tile-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n\n.dashboard-page .grid-stats .stat-card:nth-child(1) { animation-delay: 0ms; }\n.dashboard-page .grid-stats .stat-card:nth-child(2) { animation-delay: 60ms; }\n.dashboard-page .grid-stats .stat-card:nth-child(3) { animation-delay: 120ms; }\n.dashboard-page .grid-stats .stat-card:nth-child(4) { animation-delay: 180ms; }\n.dashboard-page .grid-stats .stat-card:nth-child(5) { animation-delay: 240ms; }\n.dashboard-page .grid-stats .stat-card:nth-child(6) { animation-delay: 300ms; }\n\n.dashboard-page .stat-card:hover {\n  transform: translateY(-4px) scale(1.015);\n  border-color: rgba(30, 41, 59, 0.25);\n  box-shadow:\n    0 1px 2px rgba(15, 23, 42, 0.04),\n    0 20px 36px -14px rgba(15, 23, 42, 0.32);\n}\n\n.dashboard-page .stat-label {\n  font-size: 0.7rem;\n  font-weight: 600;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n  color: #a3a2b5;\n}\n\n.dashboard-page .stat-value {\n  margin-top: 0.15rem;\n  font-size: 1.55rem;\n  font-weight: 700;\n  color: #1e1b3a;\n  letter-spacing: -0.03em;\n  font-variant-numeric: tabular-nums;\n}\n\n.dashboard-page .stat-icon {\n  border-radius: 0.7rem;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);\n}\n\n.dashboard-page .stat-icon.indigo { background: linear-gradient(135deg, #475569, #1e293b); color: #fff; }\n.dashboard-page .stat-icon.green  { background: linear-gradient(135deg, #6ee7b7, #10b981); color: #fff; }\n.dashboard-page .stat-icon.amber  { background: linear-gradient(135deg, #fcd34d, #d97706); color: #fff; }\n.dashboard-page .stat-icon.cyan   { background: linear-gradient(135deg, #94a3b8, #0891b2); color: #fff; }\n.dashboard-page .stat-icon.red    { background: linear-gradient(135deg, #fca5a5, #dc2626); color: #fff; }\n\n\n.dashboard-page .card {\n  background: rgba(255, 255, 255, 0.68);\n  backdrop-filter: blur(16px) saturate(150%);\n  -webkit-backdrop-filter: blur(16px) saturate(150%);\n  border-radius: 1.1rem;\n  border: 1px solid rgba(255, 255, 255, 0.7);\n  box-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.7),\n    0 1px 2px rgba(15, 23, 42, 0.03),\n    0 16px 32px -20px rgba(15, 23, 42, 0.14);\n  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;\n}\n\n.dashboard-page .card:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03), 0 22px 40px -18px rgba(15, 23, 42, 0.22);\n}\n\n.dashboard-page .card-title {\n  font-size: 0.95rem;\n  font-weight: 600;\n  color: #1e1b3a;\n  letter-spacing: -0.01em;\n}\n\n.dashboard-page .card-subtitle {\n  font-size: 0.8rem;\n  font-weight: 400;\n  color: #a3a2b5;\n  letter-spacing: 0;\n}\n\n.dashboard-page .dashboard-chart-card {\n  position: relative;\n}\n\n.dashboard-chart-card .recharts-responsive-container {\n  width: 100% !important;\n  height: 260px !important;\n}\n\n\n.dashboard-fade-section {\n  animation: dashboard-section-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n\n.dashboard-page .activity-list {\n  display: flex;\n  flex-direction: column;\n  gap: 0.9rem;\n}\n\n.dashboard-page .activity-item {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.75rem;\n  padding: 0.4rem 0.5rem;\n  margin: -0.4rem -0.5rem;\n  border-radius: 0.6rem;\n  transition: background 0.18s ease, transform 0.18s ease;\n  animation: dashboard-row-in 0.5s ease both;\n}\n\n.dashboard-page .activity-item:nth-child(1) { animation-delay: 60ms; }\n.dashboard-page .activity-item:nth-child(2) { animation-delay: 120ms; }\n.dashboard-page .activity-item:nth-child(3) { animation-delay: 180ms; }\n.dashboard-page .activity-item:nth-child(4) { animation-delay: 240ms; }\n.dashboard-page .activity-item:nth-child(5) { animation-delay: 300ms; }\n\n.dashboard-page .activity-item:hover {\n  background: rgba(30, 41, 59, 0.05);\n  transform: translateX(2px);\n}\n\n.dashboard-page .activity-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  margin-top: 6px;\n  background-color: #475569;\n  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.1);\n  flex-shrink: 0;\n}\n\n.dashboard-page .activity-item:first-child .activity-dot {\n  animation: dashboard-pulse-dot 2s ease-in-out infinite;\n}\n\n\n.dashboard-page .table tbody tr {\n  transition: background 0.15s ease;\n  animation: dashboard-row-in 0.45s ease both;\n}\n\n.dashboard-page .table tbody tr:hover {\n  background: rgba(30, 41, 59, 0.04);\n}\n\n.dashboard-page .table tbody tr:nth-child(1) { animation-delay: 30ms; }\n.dashboard-page .table tbody tr:nth-child(2) { animation-delay: 60ms; }\n.dashboard-page .table tbody tr:nth-child(3) { animation-delay: 90ms; }\n.dashboard-page .table tbody tr:nth-child(4) { animation-delay: 120ms; }\n.dashboard-page .table tbody tr:nth-child(5) { animation-delay: 150ms; }\n.dashboard-page .table tbody tr:nth-child(n+6) { animation-delay: 180ms; }\n\n.dashboard-page .badge {\n  font-weight: 600;\n  border: 1px solid transparent;\n}\n\n.dashboard-page .badge-warning {\n  animation: dashboard-badge-glow 2.4s ease-in-out infinite;\n}\n\n\n.dashboard-page .btn {\n  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;\n}\n\n.dashboard-page .btn:hover {\n  transform: translateY(-1px);\n  opacity: 0.92;\n}\n\n.dashboard-page .btn:active {\n  transform: translateY(0) scale(0.97);\n}\n\n.dashboard-page a.btn-ghost:hover {\n  text-decoration: underline;\n}\n\n\n.dashboard-chart-skeleton {\n  height: 20rem;\n  border-radius: 1.1rem;\n  border: 1px solid #eef0f6;\n  background-color: #ffffff;\n  animation: dashboard-pulse 1.5s ease-in-out infinite;\n}\n\n.dashboard-list-skeleton {\n  margin-top: 0.85rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n\n.dashboard-skeleton-row {\n  height: 2.1rem;\n  border-radius: 0.5rem;\n  background-color: #f4f4f8;\n  animation: dashboard-pulse 1.5s ease-in-out infinite;\n}\n\n.dashboard-empty-text {\n  font-size: 0.875rem;\n  color: #b3b2c4;\n}\n\n.dashboard-error {\n  border-radius: 1.1rem;\n  border: 1px solid #fed7c8;\n  background-color: #fff6f0;\n  padding: 1rem;\n  font-size: 0.875rem;\n  color: #c2410c;\n}\n\n.dashboard-error-title { font-weight: 600; }\n.dashboard-error-message { margin-top: 0.25rem; }\n\n.dashboard-retry-btn {\n  margin-top: 0.75rem;\n  border-radius: 0.5rem;\n  background-color: #ea580c;\n  color: #ffffff;\n  font-size: 0.75rem;\n  font-weight: 500;\n  padding: 0.4rem 0.85rem;\n  border: none;\n  cursor: pointer;\n  transition: background 0.15s ease, transform 0.15s ease;\n}\n\n.dashboard-retry-btn:hover {\n  background-color: #c2410c;\n  transform: translateY(-1px);\n}\n\n\n@keyframes dashboard-tile-in {\n  from { opacity: 0; transform: translateY(14px) scale(0.98); }\n  to { opacity: 1; transform: translateY(0) scale(1); }\n}\n\n@keyframes dashboard-section-in {\n  from { opacity: 0; transform: translateY(16px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n@keyframes dashboard-row-in {\n  from { opacity: 0; transform: translateX(-6px); }\n  to { opacity: 1; transform: translateX(0); }\n}\n\n@keyframes dashboard-pulse-dot {\n  0%, 100% { box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.12); }\n  50% { box-shadow: 0 0 0 8px rgba(15, 23, 42, 0.03); }\n}\n\n@keyframes dashboard-badge-glow {\n  0%, 100% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.15); }\n  50% { box-shadow: 0 0 0 5px rgba(217, 119, 6, 0); }\n}\n\n@keyframes dashboard-particle-float {\n  0% {\n    transform: translateY(0) translateX(0);\n    opacity: 0;\n  }\n  10% {\n    opacity: 0.7;\n  }\n  50% {\n    transform: translateY(-260px) translateX(14px);\n  }\n  90% {\n    opacity: 0.5;\n  }\n  100% {\n    transform: translateY(-540px) translateX(-10px);\n    opacity: 0;\n  }\n}\n\n@keyframes dashboard-bars-loop {\n  0% { background-position: 0% 0%; }\n  100% { background-position: 100% 0%; }\n}\n\n@keyframes dashboard-pulse {\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0.5; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dashboard-page * {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n}";

function DashboardStyles() {
  return <style dangerouslySetInnerHTML={{ __html: DASHBOARD_CSS }} />;
}

export default function Dashboard() {
  return (
    <>
      <DashboardStyles />
      <DashboardContent />
    </>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    dataService.fetchDashboardForUser(user).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [user]);

  if (loading || !data) {
    return <p className="muted">Loading dashboard…</p>;
  }

  if (data.viewType === 'self') return <SelfDashboard data={data} user={user} />;
  if (data.viewType === 'team') return <TeamDashboard data={data} user={user} />;

  if (user?.role === 'HR Manager' || data.viewType === 'hr') {
    return <HRDashboard data={data} user={user} />;
  }

  return <AdminDashboard data={data} user={user} />;
}

const ROLE_LABELS = {
  'hr manager': 'HR',
  hr: 'HR',
  admin: 'Admin',
  manager: 'Manager',
  employee: 'Employee',
};

function RoleHeader({ title, subtitle, role }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const roleLabel = ROLE_LABELS[String(role).toLowerCase()] || role;

  return (
    <div className="page-header dashboard-fade-section">
      <div>
        <h2 className="page-title">
          {title}
          <span className="dashboard-role-pill">{roleLabel}</span>
        </h2>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <p className="dashboard-today">{today}</p>
    </div>
  );
}

function AdminDashboard({ data, user }) {
  const { stats, departmentDistribution, attendanceTrend, recentActivities, todayRecords } = data;

  return (
    <div className="dashboard-page">
      <DashboardAtmosphere />

      <RoleHeader title="Admin Dashboard" subtitle="Avengers Assemble..." role={user.role} />

      <div className="grid grid-stats mb-4">
        <StatCard icon={Users} iconTone="indigo" label="Total Employees" value={stats.totalEmployees} delayMs={0} />
        <StatCard icon={CalendarCheck2} iconTone="green" label="Present Today" value={stats.presentToday} delayMs={40} />
        <StatCard icon={Clock} iconTone="amber" label="Late Today" value={stats.lateToday} delayMs={80} />
        <StatCard icon={CalendarOff} iconTone="cyan" label="On Leave Today" value={stats.onLeaveToday} delayMs={120} />
        <StatCard icon={Shield} iconTone="red" label="Pending Leaves" value={stats.pendingLeaves} delayMs={160} />
        <StatCard icon={TrendingUp} iconTone="indigo" label="Avg Attendance" value={stats.avgAttendance} suffix="%" delayMs={200} />
      </div>

      <div className="grid grid-2 mb-4 dashboard-fade-section" style={{ animationDelay: '120ms' }}>
        <Card title="Attendance Trend (2026)" subtitle="Monthly average attendance percentage" className="dashboard-chart-card">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#1e293b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="attendanceStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[88, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6', boxShadow: '0 8px 24px -8px rgba(79,70,229,0.25)' }}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="url(#attendanceStroke)"
                  strokeWidth={3}
                  fill="url(#attendanceFill)"
                  dot={{ fill: '#1e293b', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: '#334155' }}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Department Distribution" subtitle="Employees by department" className="dashboard-chart-card">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <defs>
                  <filter id="donutGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1e293b" floodOpacity="0.18" />
                  </filter>
                </defs>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  cornerRadius={6}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  style={{ filter: 'url(#donutGlow)' }}
                >
                  {departmentDistribution.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-2 dashboard-fade-section" style={{ animationDelay: '220ms' }}>
        <Card title="Recent Activity" subtitle="Latest updates across the system">
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div className="activity-item" key={activity.id}>
                <div className={`activity-dot ${activity.type}`} />
                <div>
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-desc">{activity.description}</div>
                  <div className="activity-time">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Today's Attendance"
          subtitle={`Today's records — ${todayRecords.length} entries`}
          action={
            <Link to="/attendance" className="btn btn-ghost btn-sm">
              View All
            </Link>
          }
        >
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Status</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                </tr>
              </thead>
              <tbody>
                {todayRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="cell-title">{record.employeeName}</td>
                    <td>
                      <StatusBadge status={record.status} />
                    </td>
                    <td>{record.checkIn || '—'}</td>
                    <td>{record.checkOut || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divider" />
          <Link to="/leaves" className="btn btn-secondary btn-sm">
            Review Pending Leaves ({stats.pendingLeaves})
          </Link>
        </Card>
      </div>
    </div>
  );
}

function HRDashboard({ data, user }) {
  const {
    stats,
    departmentDistribution = [],
    leaveTrend = [],
    pendingLeaveRequests = [],
    todayRecords = [],
    recentActivities = [],
  } = data;

  return (
    <div className="dashboard-page">
      <DashboardAtmosphere />

      <RoleHeader title="HR Dashboard" subtitle="the hell answers to me..." role={user.role} />

      <div className="grid grid-stats mb-4">
        <StatCard icon={Users} iconTone="indigo" label="Total Employees" value={stats.totalEmployees} delayMs={0} />
        <StatCard icon={UserPlus} iconTone="cyan" label="New Joiners" value={stats.newJoiners ?? 0} delayMs={40} />
        <StatCard icon={CalendarOff} iconTone="cyan" label="On Leave Today" value={stats.onLeaveToday} delayMs={80} />
        <StatCard icon={Shield} iconTone="red" label="Pending Leaves" value={stats.pendingLeaves} delayMs={120} />
        <StatCard icon={CheckCircle2} iconTone="green" label="Approved This Month" value={stats.approvedThisMonth ?? 0} delayMs={160} />
        <StatCard icon={TrendingUp} iconTone="indigo" label="Avg Attendance" value={stats.avgAttendance} suffix="%" delayMs={200} />
      </div>

      <div className="grid grid-2 mb-4 dashboard-fade-section" style={{ animationDelay: '120ms' }}>
        <Card title="Leave Requests Trend" subtitle="Monthly leave requests this year" className="dashboard-chart-card">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={leaveTrend}>
                <defs>
                  <linearGradient id="hrLeaveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 'auto']} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6' }} />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#0f766e"
                  strokeWidth={3}
                  fill="url(#hrLeaveFill)"
                  dot={{ fill: '#0f766e', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: '#0d9488' }}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Department Distribution" subtitle="Employees by department" className="dashboard-chart-card">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <defs>
                  <filter id="hrDonutGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0d9488" floodOpacity="0.18" />
                  </filter>
                </defs>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  cornerRadius={6}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  style={{ filter: 'url(#hrDonutGlow)' }}
                >
                  {departmentDistribution.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-2 dashboard-fade-section" style={{ animationDelay: '220ms' }}>
        <Card
          title="Pending Leave Requests"
          subtitle={`${pendingLeaveRequests.length} awaiting HR review`}
          action={
            <Link to="/leaves" className="btn btn-ghost btn-sm">
              View All
            </Link>
          }
        >
          {pendingLeaveRequests.length === 0 ? (
            <p className="muted">No pending leave requests.</p>
          ) : (
            <div className="activity-list">
              {pendingLeaveRequests.map((leave) => (
                <div className="activity-item" key={leave.id}>
                  <div className="activity-dot leave" />
                  <div>
                    <div className="activity-title">{leave.employeeName}</div>
                    <div className="activity-desc">
                      {leave.type} · {leave.startDate === leave.endDate ? leave.startDate : `${leave.startDate} → ${leave.endDate}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="divider" />
          <Link to="/leaves" className="btn btn-secondary btn-sm">
            Review Pending Leaves ({stats.pendingLeaves})
          </Link>
        </Card>

        <Card
          title="Today's Attendance"
          subtitle={`Today's records — ${todayRecords.length} entries`}
          action={
            <Link to="/attendance" className="btn btn-ghost btn-sm">
              View All
            </Link>
          }
        >
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Status</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                </tr>
              </thead>
              <tbody>
                {todayRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="cell-title">{record.employeeName}</td>
                    <td>
                      <StatusBadge status={record.status} />
                    </td>
                    <td>{record.checkIn || '—'}</td>
                    <td>{record.checkOut || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="dashboard-fade-section" style={{ animationDelay: '320ms' }}>
        <Card title="Recent Activity" subtitle="Latest updates across the system">
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div className="activity-item" key={activity.id}>
                <div className={`activity-dot ${activity.type}`} />
                <div>
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-desc">{activity.description}</div>
                  <div className="activity-time">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function TeamDashboard({ data, user }) {
  const { manager, stats, attendanceStrip, todayRecords, pendingApprovalsList } = data;
  const firstName = manager?.firstName || user.name.split(' ')[0];

  return (
    <div className="dashboard-page">
      <DashboardAtmosphere />

      <RoleHeader
        title={`${firstName}'s Team`}
        subtitle="Here's how your team is doing today."
        role={user.role}
      />

      <div className="grid grid-stats mb-4">
        <StatCard icon={Users} iconTone="indigo" label="Team Size" value={stats.teamSize} delayMs={0} />
        <StatCard icon={CalendarCheck2} iconTone="green" label="Present Today" value={stats.presentToday} delayMs={40} />
        <StatCard icon={Clock} iconTone="amber" label="Late Today" value={stats.lateToday} delayMs={80} />
        <StatCard icon={CalendarOff} iconTone="cyan" label="On Leave Today" value={stats.onLeaveToday} delayMs={120} />
        <StatCard icon={Shield} iconTone="red" label="Pending Approvals" value={stats.pendingApprovals} delayMs={160} />
      </div>

      <div className="grid grid-2 mb-4 dashboard-fade-section" style={{ animationDelay: '120ms' }}>
        <Card title="Team Attendance" subtitle="Present rate, last recorded days" className="dashboard-chart-card">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={attendanceStrip}>
                <defs>
                  <linearGradient id="teamFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#334155" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#334155" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6' }} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#0f172a"
                  strokeWidth={2.5}
                  fill="url(#teamFill)"
                  dot={{ fill: '#0f172a', r: 4 }}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Pending Approvals" subtitle={`${pendingApprovalsList.length} awaiting your review`}>
          {pendingApprovalsList.length === 0 ? (
            <p className="muted">Nothing pending — you're all caught up.</p>
          ) : (
            <div className="activity-list">
              {pendingApprovalsList.map((leave) => (
                <div className="activity-item" key={leave.id}>
                  <div className="activity-dot leave" />
                  <div>
                    <div className="activity-title">{leave.employeeName}</div>
                    <div className="activity-desc">
                      {leave.type} · {leave.startDate === leave.endDate ? leave.startDate : `${leave.startDate} → ${leave.endDate}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="divider" />
          <Link to="/leaves" className="btn btn-secondary btn-sm">
            Review in Leave Management
          </Link>
        </Card>
      </div>

      <div className="dashboard-fade-section" style={{ animationDelay: '220ms' }}>
        <Card
          title="Today's Team Attendance"
          subtitle={`${todayRecords.length} records`}
          action={
            <Link to="/attendance" className="btn btn-ghost btn-sm">
              View All
            </Link>
          }
        >
          {todayRecords.length === 0 ? (
            <p className="muted">No attendance recorded for your team today.</p>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                  </tr>
                </thead>
                <tbody>
                  {todayRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="cell-title">{record.employeeName}</td>
                      <td>
                        <StatusBadge status={record.status} />
                      </td>
                      <td>{record.checkIn || '—'}</td>
                      <td>{record.checkOut || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function SelfDashboard({ data, user }) {
  const { employee, stats, attendanceStrip, leaveTypeBreakdown, recentLeaves, recentActivities } = data;
  const firstName = employee?.firstName || user.name.split(' ')[0];

  return (
    <div className="dashboard-page">
      <DashboardAtmosphere />

      <RoleHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Here's your personal overview."
        role={user.role}
      />

      <div className="grid grid-stats mb-4">
        <StatCard icon={CalendarCheck2} iconTone="green" label="Attendance This Month" value={stats.attendancePct} suffix="%" delayMs={0} />
        <StatCard icon={Umbrella} iconTone="indigo" label="Leave Balance" value={stats.leaveBalance} suffix=" days" delayMs={40} />
        <StatCard icon={ClipboardList} iconTone="amber" label="Pending Requests" value={stats.pendingRequests} delayMs={80} />
        <StatCard icon={Clock} iconTone="cyan" label="Late Days" value={stats.lateCount} delayMs={120} />
      </div>

      <div className="grid grid-2 mb-4 dashboard-fade-section" style={{ animationDelay: '120ms' }}>
        <Card title="My Attendance" subtitle="Last recorded days" className="dashboard-chart-card">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={attendanceStrip}>
                <defs>
                  <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.22" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(_, __, props) => [props.payload.status, 'Status']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} animationDuration={1000} animationEasing="ease-out" style={{ filter: 'url(#barGlow)' }}>
                  {attendanceStrip.map((entry, index) => (
                    <Cell key={index} fill={ATTENDANCE_BAR_COLORS[entry.status] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="My Leave Usage" subtitle="Days taken by leave type" className="dashboard-chart-card">
          {leaveTypeBreakdown.length === 0 ? (
            <p className="muted">No leave history yet.</p>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <defs>
                    <filter id="leaveDonutGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1e293b" floodOpacity="0.18" />
                    </filter>
                  </defs>
                  <Pie
                    data={leaveTypeBreakdown}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    cornerRadius={6}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}d`}
                    labelLine={false}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    style={{ filter: 'url(#leaveDonutGlow)' }}
                  >
                    {leaveTypeBreakdown.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef0f6' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-2 dashboard-fade-section" style={{ animationDelay: '220ms' }}>
        <Card
          title="My Recent Leave Requests"
          subtitle={`${recentLeaves.length} requests`}
          action={
            <Link to="/leaves" className="btn btn-ghost btn-sm">
              View All
            </Link>
          }
        >
          {recentLeaves.length === 0 ? (
            <p className="muted">You haven't requested any leave yet.</p>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="cell-title">{leave.type}</td>
                      <td>
                        {leave.startDate === leave.endDate
                          ? leave.startDate
                          : `${leave.startDate} → ${leave.endDate}`}
                      </td>
                      <td>
                        <StatusBadge status={leave.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="divider" />
          <Link to="/leaves" className="btn btn-secondary btn-sm">
            Request Leave
          </Link>
        </Card>

        <Card title="Company Announcements" subtitle="Latest updates across the system">
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div className="activity-item" key={activity.id}>
                <div className={`activity-dot ${activity.type}`} />
                <div>
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-desc">{activity.description}</div>
                  <div className="activity-time">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const variants = {
    Present: 'success',
    WFH: 'info',
    'On Leave': 'warning',
    Late: 'warning',
    Absent: 'danger',
    'Half Day': 'neutral',
    Approved: 'success',
    Pending: 'warning',
    Rejected: 'danger',
  };
  return <span className={`badge badge-${variants[status] || 'neutral'}`}>{status}</span>;
}
