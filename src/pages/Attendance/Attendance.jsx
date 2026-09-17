import { useEffect, useMemo, useState } from 'react';
import * as dataService from '../../services/dataService.js';
import Card from '../../components/Card.jsx';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    Promise.all([dataService.fetchAttendance(), dataService.fetchEmployees()]).then(
      ([attendanceData, employeeData]) => {
        setAttendance(attendanceData);
        setEmployees(employeeData);
        setLoading(false);
      }
    );
  }, []);

  const employeeName = (id) => {
    const employee = employees.find((item) => item.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : id;
  };

  const dates = useMemo(
    () => [...new Set(attendance.map((record) => record.date))].sort().reverse(),
    [attendance]
  );

  const filtered = useMemo(() => {
    const rows = dateFilter ? attendance.filter((record) => record.date === dateFilter) : attendance;
    return [...rows].sort((a, b) => b.date.localeCompare(a.date));
  }, [attendance, dateFilter]);

  if (loading) {
    return <p className="muted">Loading attendance…</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Attendance</h2>
          <p className="page-subtitle">Daily check-in and check-out records.</p>
        </div>
        <select
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          style={{
            borderRadius: '0.4rem',
            border: '1px solid #e2e8f0',
            padding: '0.4rem 0.6rem',
            fontSize: '0.85rem',
            color: '#1e293b',
          }}
        >
          <option value="">All dates</option>
          {dates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      <Card title="Attendance Records" subtitle={`${filtered.length} entries`}>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check-in</th>
                <th>Check-out</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id}>
                  <td className="cell-title">{employeeName(record.employeeId)}</td>
                  <td>{record.date}</td>
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