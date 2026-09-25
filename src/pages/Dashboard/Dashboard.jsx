import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CalendarCheck2, CalendarOff, Clock, TrendingUp,
  Shield, Umbrella, ClipboardList, CheckCircle2, UserPlus, ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import * as dataService from '../../services/dataService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Button from '../../components/ui/Button.jsx';

const CHART = {
  primary: '#2563eb', ink: '#0f172a', teal: '#0284c7', amber: '#d97706',
  green: '#16a34a', muted: '#94a3b8', red: '#dc2626', slate: '#475569',
  grid: '#e2e8f0', axis: '#94a3b8',
};
const PIE_COLORS = ['#0f172a', '#0284c7', '#d97706', '#16a34a', '#64748b', '#dc2626'];
const ATTENDANCE_BAR_COLORS = {
  Present: '#16a34a', WFH: '#0284c7', Late: '#d97706',
  'Half Day': '#94a3b8', 'On Leave': '#dc2626', Absent: '#dc2626',
};

const DASHBOARD_CSS = `
/* ---------- stat tiles ---------- */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--dashboard-grid-gap);
  margin-bottom: var(--section-gap);
}
.stat-card {
  background: var(--card-background);
  border: 1px solid var(--card-border);
  border-radius: var(--dashboard-card-radius);
  box-shadow: var(--card-shadow);
  padding: var(--dashboard-card-padding);
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}
.stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.stat-card-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
.stat-label { font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: var(--color-text-secondary); }
.stat-icon {
  width: 36px; height: 36px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  background: var(--color-primary-light); color: var(--color-primary); flex-shrink: 0;
}
.stat-number {
  margin-top: var(--space-2);
  font-size: var(--stat-number-size);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
}
.stat-suffix { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text-muted); }

/* ---------- layout ---------- */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--section-gap);
  align-items: start;
  margin-bottom: var(--section-gap);
}
.dashboard-chart { width: 100%; height: 260px; }

/* ---------- header extras ---------- */
.dashboard-role-pill {
  display: inline-flex; align-items: center;
  margin-left: var(--space-3); padding: 2px var(--space-3);
  border-radius: var(--radius-full);
  background: var(--color-primary-light); color: var(--color-primary);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  text-transform: uppercase; letter-spacing: 0.04em; vertical-align: middle;
}
.dashboard-today { padding-top: var(--space-2); font-size: var(--font-size-sm); }

/* ---------- activity feed ---------- */
.dashboard-activity { display: flex; flex-direction: column; gap: var(--space-4); }
.activity-item { display: flex; align-items: flex-start; gap: var(--space-3); }
.activity-dot {
  width: 8px; height: 8px; border-radius: var(--radius-full);
  margin-top: 6px; background: var(--color-secondary); flex-shrink: 0;
}
.activity-dot-leave { background: var(--attendance-leave); }
.activity-title { margin: 0; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text-primary); }
.activity-desc { margin: 2px 0 0; font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.activity-time { margin: 2px 0 0; font-size: var(--font-size-xs); color: var(--color-text-muted); }

/* ---------- extra badge variant used by StatusBadge ---------- */
.badge-neutral { background: var(--color-secondary-light); color: var(--color-secondary); }

/* ---------- entrance animation ---------- */
.dashboard-fade-in { animation: dashboard-fade-in var(--transition-slow) ease both; }
@keyframes dashboard-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .dashboard-fade-in { animation: none; } }

/* ---------- responsive ---------- */
@media (max-width: 1200px) { .dashboard-stats { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }
@media (max-width: 640px) {
  .dashboard-stats { grid-template-columns: repeat(2, 1fr); }
  .page-header { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 420px) { .dashboard-stats { grid-template-columns: 1fr; } }
`;

const ROLE_LABELS = {
  'hr manager': 'HR', hr: 'HR', admin: 'Admin', manager: 'Manager', employee: 'Employee',
};

const ATTENDANCE_COLUMNS = [
  { key: 'employeeName', header: 'Employee' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'checkIn', header: 'Check-in', render: (row) => row.checkIn || '—' },
  { key: 'checkOut', header: 'Check-out', render: (row) => row.checkOut || '—' },
];

const LEAVE_COLUMNS = [
  { key: 'type', header: 'Type' },
  {
    key: 'dates', header: 'Dates',
    render: (row) => (row.startDate === row.endDate
      ? row.startDate
      : `${row.startDate} → ${row.endDate}`),
  },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

function StatusBadge({ status }) {
  const variants = {
    Present: 'badge-success', WFH: 'badge-info', Late: 'badge-warning',
    'On Leave': 'badge-danger', Absent: 'badge-danger', 'Half Day': 'badge-neutral',
    Approved: 'badge-success', Pending: 'badge-warning', Rejected: 'badge-danger',
  };
  return <span className={`badge ${variants[status] || 'badge-neutral'}`}>{status}</span>;
}

function RoleHeader({ title, subtitle, role }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  const roleLabel = ROLE_LABELS[String(role).toLowerCase()] || role;

  return (
    <header className="page-header dashboard-fade-in">
      <div>
        <h1 className="page-title">
          {title}
          <span className="dashboard-role-pill">{roleLabel}</span>
        </h1>
        <p className="text-secondary">{subtitle}</p>
      </div>
      <p className="text-muted dashboard-today">{today}</p>
    </header>
  );
}

function StatTile({ icon: Icon, label, value, suffix }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon"><Icon size={20} /></span>
      </div>
      <div className="stat-number">
        {value}
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </div>
    </div>
  );
}

function StatGrid({ children }) {
  return <section className="dashboard-stats">{children}</section>;
}

function ChartFrame({ children }) {
  return <div className="dashboard-chart">{children}</div>;
}

function ActivityList({ items }) {
  return (
    <div className="dashboard-activity">
      {items.map((activity) => (
        <div className="activity-item" key={activity.id}>
          <span className="activity-dot" />
          <div>
            <p className="activity-title">{activity.title}</p>
            <p className="activity-desc">{activity.description}</p>
            <p className="activity-time">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeaveRequestsList({ items }) {
  if (items.length === 0) {
    return <EmptyState title="Nothing pending" description="You're all caught up." />;
  }
  return (
    <div className="dashboard-activity">
      {items.map((leave) => (
        <div className="activity-item" key={leave.id}>
          <span className="activity-dot activity-dot-leave" />
          <div>
            <p className="activity-title">{leave.employeeName}</p>
            <p className="activity-desc">
              {leave.type} · {leave.startDate === leave.endDate
                ? leave.startDate
                : `${leave.startDate} → ${leave.endDate}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  fontSize: 'var(--font-size-sm)',
};

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
    return (
      <div className="page-container">
        <EmptyState title="Loading dashboard…" />
      </div>
    );
  }

  if (data.viewType === 'self') return <SelfDashboard data={data} user={user} />;
  if (data.viewType === 'team') return <TeamDashboard data={data} user={user} />;
  if (user?.role === 'HR Manager' || data.viewType === 'hr') {
    return <HRDashboard data={data} user={user} />;
  }
  return <AdminDashboard data={data} user={user} />;
}

function AdminDashboard({ data, user }) {
  const { stats, departmentDistribution, attendanceTrend, recentActivities, todayRecords } = data;

  return (
    <div className="page-container">
      <RoleHeader title="Admin Dashboard" subtitle="Organization-wide overview" role={user.role} />

      <StatGrid>
        <StatTile icon={Users} label="Total Employees" value={stats.totalEmployees} />
        <StatTile icon={CalendarCheck2} label="Present Today" value={stats.presentToday} />
        <StatTile icon={Clock} label="Late Today" value={stats.lateToday} />
        <StatTile icon={CalendarOff} label="On Leave Today" value={stats.onLeaveToday} />
        <StatTile icon={Shield} label="Pending Leaves" value={stats.pendingLeaves} />
        <StatTile icon={TrendingUp} label="Avg Attendance" value={stats.avgAttendance} suffix="%" />
      </StatGrid>

      <div className="dashboard-grid dashboard-fade-in" style={{ animationDelay: '120ms' }}>
        <Card title="Attendance Trend (2026)" subtitle="Monthly average attendance percentage">
          <ChartFrame>
            <ResponsiveContainer>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.primary} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CHART.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: CHART.axis }} axisLine={false} tickLine={false} />
                <YAxis domain={[88, 100]} tick={{ fontSize: 12, fill: CHART.axis }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="attendance" stroke={CHART.primary} strokeWidth={2.5}
                  fill="url(#attendanceFill)" dot={{ fill: CHART.primary, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }} animationDuration={900} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>

        <Card title="Department Distribution" subtitle="Employees by department">
          <ChartFrame>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={departmentDistribution} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                  paddingAngle={4} cornerRadius={6} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false} animationDuration={900}>
                  {departmentDistribution.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>
      </div>

      <div className="dashboard-grid dashboard-fade-in" style={{ animationDelay: '220ms' }}>
        <Card title="Recent Activity" subtitle="Latest updates across the system">
          {recentActivities.length === 0
            ? <EmptyState title="No recent activity" />
            : <ActivityList items={recentActivities} />}
        </Card>

        <Card
          title="Today's Attendance"
          subtitle={`${todayRecords.length} entries`}
          action={<Link to="/attendance"><Button variant="ghost" size="sm">View All</Button></Link>}
        >
          <Table columns={ATTENDANCE_COLUMNS} rows={todayRecords}
            emptyTitle="No attendance recorded today" />
          <div className="divider" />
          <Link to="/leaves">
            <Button variant="secondary" size="sm" icon={ArrowRight}>
              Review Pending Leaves ({stats.pendingLeaves})
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function HRDashboard({ data, user }) {
  const {
    stats, departmentDistribution = [], leaveTrend = [],
    pendingLeaveRequests = [], todayRecords = [], recentActivities = [],
  } = data;

  return (
    <div className="page-container">
      <RoleHeader title="HR Dashboard" subtitle="People operations at a glance" role={user.role} />

      <StatGrid>
        <StatTile icon={Users} label="Total Employees" value={stats.totalEmployees} />
        <StatTile icon={UserPlus} label="New Joiners" value={stats.newJoiners ?? 0} />
        <StatTile icon={CalendarOff} label="On Leave Today" value={stats.onLeaveToday} />
        <StatTile icon={Shield} label="Pending Leaves" value={stats.pendingLeaves} />
        <StatTile icon={CheckCircle2} label="Approved This Month" value={stats.approvedThisMonth ?? 0} />
        <StatTile icon={TrendingUp} label="Avg Attendance" value={stats.avgAttendance} suffix="%" />
      </StatGrid>

      <div className="dashboard-grid dashboard-fade-in" style={{ animationDelay: '120ms' }}>
        <Card title="Leave Requests Trend" subtitle="Monthly leave requests this year">
          <ChartFrame>
            <ResponsiveContainer>
              <AreaChart data={leaveTrend}>
                <defs>
                  <linearGradient id="hrLeaveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.teal} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CHART.teal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: CHART.axis }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 'auto']} tick={{ fontSize: 12, fill: CHART.axis }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="requests" stroke={CHART.teal} strokeWidth={2.5}
                  fill="url(#hrLeaveFill)" dot={{ fill: CHART.teal, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }} animationDuration={900} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>

        <Card title="Department Distribution" subtitle="Employees by department">
          <ChartFrame>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={departmentDistribution} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                  paddingAngle={4} cornerRadius={6} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false} animationDuration={900}>
                  {departmentDistribution.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>
      </div>

      <div className="dashboard-grid dashboard-fade-in" style={{ animationDelay: '220ms' }}>
        <Card
          title="Pending Leave Requests"
          subtitle={`${pendingLeaveRequests.length} awaiting HR review`}
          action={<Link to="/leaves"><Button variant="ghost" size="sm">View All</Button></Link>}
        >
          <LeaveRequestsList items={pendingLeaveRequests} />
          <div className="divider" />
          <Link to="/leaves">
            <Button variant="secondary" size="sm" icon={ArrowRight}>
              Review Pending Leaves ({stats.pendingLeaves})
            </Button>
          </Link>
        </Card>

        <Card
          title="Today's Attendance"
          subtitle={`${todayRecords.length} entries`}
          action={<Link to="/attendance"><Button variant="ghost" size="sm">View All</Button></Link>}
        >
          <Table columns={ATTENDANCE_COLUMNS} rows={todayRecords}
            emptyTitle="No attendance recorded today" />
        </Card>
      </div>

      <div className="dashboard-fade-in" style={{ animationDelay: '320ms' }}>
        <Card title="Recent Activity" subtitle="Latest updates across the system">
          {recentActivities.length === 0
            ? <EmptyState title="No recent activity" />
            : <ActivityList items={recentActivities} />}
        </Card>
      </div>
    </div>
  );
}

function TeamDashboard({ data, user }) {
  const { manager, stats, attendanceStrip, todayRecords, pendingApprovalsList } = data;
  const firstName = manager?.firstName || user.name.split(' ')[0];

  return (
    <div className="page-container">
      <RoleHeader title={`${firstName}'s Team`} subtitle="How your team is doing today" role={user.role} />

      <StatGrid>
        <StatTile icon={Users} label="Team Size" value={stats.teamSize} />
        <StatTile icon={CalendarCheck2} label="Present Today" value={stats.presentToday} />
        <StatTile icon={Clock} label="Late Today" value={stats.lateToday} />
        <StatTile icon={CalendarOff} label="On Leave Today" value={stats.onLeaveToday} />
        <StatTile icon={Shield} label="Pending Approvals" value={stats.pendingApprovals} />
      </StatGrid>

      <div className="dashboard-grid dashboard-fade-in" style={{ animationDelay: '120ms' }}>
        <Card title="Team Attendance" subtitle="Present rate, last recorded days">
          <ChartFrame>
            <ResponsiveContainer>
              <AreaChart data={attendanceStrip}>
                <defs>
                  <linearGradient id="teamFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.slate} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CHART.slate} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: CHART.axis }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: CHART.axis }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="score" stroke={CHART.ink} strokeWidth={2.5}
                  fill="url(#teamFill)" dot={{ fill: CHART.ink, r: 3 }} animationDuration={900} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>

        <Card title="Pending Approvals" subtitle={`${pendingApprovalsList.length} awaiting your review`}>
          <LeaveRequestsList items={pendingApprovalsList} />
          <div className="divider" />
          <Link to="/leaves">
            <Button variant="secondary" size="sm" icon={ArrowRight}>Review in Leave Management</Button>
          </Link>
        </Card>
      </div>

      <div className="dashboard-fade-in" style={{ animationDelay: '220ms' }}>
        <Card
          title="Today's Team Attendance"
          subtitle={`${todayRecords.length} records`}
          action={<Link to="/attendance"><Button variant="ghost" size="sm">View All</Button></Link>}
        >
          <Table columns={ATTENDANCE_COLUMNS} rows={todayRecords}
            emptyTitle="No attendance recorded for your team today" />
        </Card>
      </div>
    </div>
  );
}

function SelfDashboard({ data, user }) {
  const { employee, stats, attendanceStrip, leaveTypeBreakdown, recentLeaves, recentActivities } = data;
  const firstName = employee?.firstName || user.name.split(' ')[0];

  return (
    <div className="page-container">
      <RoleHeader title={`Welcome back, ${firstName}`} subtitle="Your personal overview" role={user.role} />

      <StatGrid>
        <StatTile icon={CalendarCheck2} label="Attendance This Month" value={stats.attendancePct} suffix="%" />
        <StatTile icon={Umbrella} label="Leave Balance" value={stats.leaveBalance} suffix=" days" />
        <StatTile icon={ClipboardList} label="Pending Requests" value={stats.pendingRequests} />
        <StatTile icon={Clock} label="Late Days" value={stats.lateCount} />
      </StatGrid>

      <div className="dashboard-grid dashboard-fade-in" style={{ animationDelay: '120ms' }}>
        <Card title="My Attendance" subtitle="Last recorded days">
          <ChartFrame>
            <ResponsiveContainer>
              <BarChart data={attendanceStrip}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: CHART.axis }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: CHART.axis }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(_, __, props) => [props.payload.status, 'Status']}
                  contentStyle={tooltipStyle} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} animationDuration={900}>
                  {attendanceStrip.map((entry, index) => (
                    <Cell key={index} fill={ATTENDANCE_BAR_COLORS[entry.status] || CHART.muted} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>

        <Card title="My Leave Usage" subtitle="Days taken by leave type">
          {leaveTypeBreakdown.length === 0 ? (
            <EmptyState title="No leave history yet" />
          ) : (
            <ChartFrame>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={leaveTypeBreakdown} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                    paddingAngle={4} cornerRadius={6} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}d`}
                    labelLine={false} animationDuration={900}>
                    {leaveTypeBreakdown.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartFrame>
          )}
        </Card>
      </div>

      <div className="dashboard-grid dashboard-fade-in" style={{ animationDelay: '220ms' }}>
        <Card
          title="My Recent Leave Requests"
          subtitle={`${recentLeaves.length} requests`}
          action={<Link to="/leaves"><Button variant="ghost" size="sm">View All</Button></Link>}
        >
          <Table columns={LEAVE_COLUMNS} rows={recentLeaves}
            emptyTitle="No leave requests yet"
            emptyDescription="Request your first leave to get started." />
          <div className="divider" />
          <Link to="/leaves">
            <Button variant="secondary" size="sm" icon={ArrowRight}>Request Leave</Button>
          </Link>
        </Card>

        <Card title="Company Announcements" subtitle="Latest updates across the system">
          {recentActivities.length === 0
            ? <EmptyState title="No announcements" />
            : <ActivityList items={recentActivities} />}
        </Card>
      </div>
    </div>
  );
}
