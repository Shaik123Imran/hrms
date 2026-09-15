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
  return (
    <div className="page-header dashboard-fade-section">
      <div>
        <h2 className="page-title">
          {title}
          <span className="dashboard-role-pill">{role}</span>
        </h2>
        <p className="page-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}



function OrgDashboard({ data, user }) {
  const { stats, departmentDistribution, attendanceTrend, recentActivities, todayRecords } = data;

  return (
    <div>
      <RoleHeader title="Dashboard" subtitle="Welcome back! Here is today's overview." role={user.role} />

      <div className="grid grid-stats mb-4">
        <StatCard icon={Users} iconTone="indigo" label="Total Employees" value={stats.totalEmployees} delayMs={0} />
        <StatCard icon={CalendarCheck2} iconTone="green" label="Present Today" value={stats.presentToday} delayMs={40} />
        <StatCard icon={Clock} iconTone="amber" label="Late Today" value={stats.lateToday} delayMs={80} />
        <StatCard icon={CalendarOff} iconTone="cyan" label="On Leave Today" value={stats.onLeaveToday} delayMs={120} />
        <StatCard icon={Shield} iconTone="red" label="Pending Leaves" value={stats.pendingLeaves} delayMs={160} />
        <StatCard icon={TrendingUp} iconTone="indigo" label="Avg Attendance" value={stats.avgAttendance} suffix="%" delayMs={200} />
      </div>

      <div className="grid grid-2 mb-4 dashboard-fade-section">
        <Card title="Attendance Trend (2026)" subtitle="Monthly average attendance percentage">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[88, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ fill: '#4f46e5', r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Department Distribution" subtitle="Employees by department">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  animationDuration={900}
                >
                  {departmentDistribution.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-2 dashboard-fade-section">
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
    <div>
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

      <div className="grid grid-2 mb-4 dashboard-fade-section">
        <Card title="My Attendance" subtitle="Last recorded days">
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={attendanceStrip}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip formatter={(_, __, props) => [props.payload.status, 'Status']} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} animationDuration={900}>
                  {attendanceStrip.map((entry, index) => (
                    <Cell key={index} fill={ATTENDANCE_BAR_COLORS[entry.status] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="My Leave Usage" subtitle="Days taken by leave type">
          {leaveTypeBreakdown.length === 0 ? (
            <p className="muted">No leave history yet.</p>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={leaveTypeBreakdown}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}d`}
                    labelLine={false}
                    animationDuration={900}
                  >
                    {leaveTypeBreakdown.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-2 dashboard-fade-section">
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