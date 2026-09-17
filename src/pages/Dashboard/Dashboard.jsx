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
import './Dashboard.css';
import * as dataService from '../../services/dataService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Card from '../../components/Card.jsx';
import StatCard from '../../components/StatCard.jsx';

const PIE_COLORS = ['#4f46e5', '#7c3aed', '#0891b2', '#16a34a', '#d97706', '#dc2626'];
const ATTENDANCE_BAR_COLORS = {
  Present: '#16a34a',
  WFH: '#0891b2',
  Late: '#d97706',
  'Half Day': '#94a3b8',
  'On Leave': '#dc2626',
  Absent: '#dc2626',
};

export default function Dashboard() {
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

  return data.viewType === 'self' ? (
    <SelfDashboard data={data} user={user} />
  ) : (
    <OrgDashboard data={data} user={user} />
  );
}

function RoleHeader({ title, subtitle, role }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page-header dashboard-fade-section">
      <div>
        <h2 className="page-title">
          {title}
          <span className="dashboard-role-pill">{role}</span>
        </h2>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <p className="dashboard-today">{today}</p>
    </div>
  );
}

// --- Admin / HR Manager: org-wide dashboard --------------------------------

function OrgDashboard({ data, user }) {
  const { stats, departmentDistribution, attendanceTrend, recentActivities, todayRecords } = data;

  return (
    <div className="dashboard-page">
      <div className="dashboard-orb dashboard-orb-1" aria-hidden="true" />
      <div className="dashboard-orb dashboard-orb-2" aria-hidden="true" />
      <div className="dashboard-grid-texture" aria-hidden="true" />

      <RoleHeader title="Dashboard" subtitle="Welcome back! Here is today's overview." role={user.role} />

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
                    <stop offset="0%" stopColor="#6d28d9" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#6d28d9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="attendanceStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#7c3aed" />
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
                  dot={{ fill: '#4f46e5', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: '#7c3aed' }}
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
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4f46e5" floodOpacity="0.18" />
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

// --- Employee: personal dashboard ------------------------------------------

function SelfDashboard({ data, user }) {
  const { employee, stats, attendanceStrip, leaveTypeBreakdown, recentLeaves, recentActivities } = data;
  const firstName = employee?.firstName || user.name.split(' ')[0];

  return (
    <div className="dashboard-page">
      <div className="dashboard-orb dashboard-orb-1" aria-hidden="true" />
      <div className="dashboard-orb dashboard-orb-2" aria-hidden="true" />
      <div className="dashboard-grid-texture" aria-hidden="true" />

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
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4f46e5" floodOpacity="0.18" />
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