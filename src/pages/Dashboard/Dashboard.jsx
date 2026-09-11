import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck2,
  CalendarOff,
  Clock,
  TrendingUp,
  Shield,
} from 'lucide-react';
import {
  LineChart,
  Line,
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
import Card from '../../components/Card.jsx';

const PIE_COLORS = ['#4f46e5', '#7c3aed', '#0891b2', '#16a34a', '#d97706', '#dc2626'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.fetchDashboardData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <p className="muted">Loading dashboard…</p>;
  }

  const { stats, departmentDistribution, attendanceTrend, recentActivities, todayRecords } = data;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Welcome back! Here is today&apos;s overview.</p>
        </div>
      </div>

      <div className="grid grid-stats mb-4">
        <div className="stat-card">
          <div className="stat-icon indigo">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{stats.totalEmployees}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <CalendarCheck2 size={22} />
          </div>
          <div>
            <div className="stat-label">Present Today</div>
            <div className="stat-value">{stats.presentToday}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-label">Late Today</div>
            <div className="stat-value">{stats.lateToday}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">
            <CalendarOff size={22} />
          </div>
          <div>
            <div className="stat-label">On Leave Today</div>
            <div className="stat-value">{stats.onLeaveToday}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <Shield size={22} />
          </div>
          <div>
            <div className="stat-label">Pending Leaves</div>
            <div className="stat-value">{stats.pendingLeaves}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon indigo">
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="stat-label">Avg Attendance</div>
            <div className="stat-value">{stats.avgAttendance}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2 mb-4">
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

      <div className="grid grid-2">
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

function StatusBadge({ status }) {
  const variants = {
    Present: 'success',
    WFH: 'info',
    'On Leave': 'warning',
    Late: 'warning',
    Absent: 'danger',
    'Half Day': 'neutral',
  };
  return <span className={`badge badge-${variants[status] || 'neutral'}`}>{status}</span>;
}