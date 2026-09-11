import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck2, Clock, CalendarOff, Home } from 'lucide-react';
import * as dataService from '../../services/dataService.js';
import { getInitials, hoursBetween } from '../../utils/formatters.js';

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState('2026-09-11');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dataService.fetchEmployees(), dataService.fetchAttendance()]).then(
      ([employeeRows, attendanceRows]) => {
        setEmployees(employeeRows);
        setRecords(attendanceRows);
        setLoading(false);
      }
    );
  }, []);

  const dates = useMemo(
    () => [...new Set(records.map((record) => record.date))].sort().reverse(),
    [records]
  );

  const rows = useMemo(() => {
    return records
      .filter((record) => record.date === date)
      .filter((record) => statusFilter === 'All' || record.status === statusFilter)
      .map((record) => {
        const employee = employees.find((item) => item.id === record.employeeId);
        return {
          ...record,
          employeeName: employee ? `${employee.firstName} ${employee.lastName}` : record.employeeId,
          department: employee ? employee.department : '—',
          initials: employee ? getInitials(employee.firstName, employee.lastName) : '?',
        };
      });
  }, [records, employees, date, statusFilter]);

  const summary = useMemo(() => {
    const daily = records.filter((record) => record.date === date);
    return {
      present: daily.filter((record) => record.status === 'Present').length,
      wfh: daily.filter((record) => record.status === 'WFH').length,
      late: daily.filter((record) => record.status === 'Late').length,
      absent: daily.filter((record) => record.status === 'Absent').length,
      leave: daily.filter((record) => record.status === 'On Leave').length,
    };
  }, [records, date]);

  if (loading) {
    return <p className="muted">Loading attendance…</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Attendance</h2>
          <p className="page-subtitle">Daily attendance records from the shared data store.</p>
        </div>
      </div>

      <div className="grid grid-stats mb-4">
        <div className="stat-card">
          <div className="stat-icon green">
            <CalendarCheck2 size={22} />
          </div>
          <div>
            <div className="stat-label">Present</div>
            <div className="stat-value">{summary.present}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">
            <Home size={22} />
          </div>
          <div>
            <div className="stat-label">Work From Home</div>
            <div className="stat-value">{summary.wfh}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-label">Late</div>
            <div className="stat-value">{summary.late}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <CalendarOff size={22} />
          </div>
          <div>
            <div className="stat-label">On Leave / Absent</div>
            <div className="stat-value">{summary.leave + summary.absent}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-3 mb-4" style={{ gridTemplateColumns: '220px 1fr', alignItems: 'center' }}>
        <select className="form-select" value={date} onChange={(event) => setDate(event.target.value)}>
          {dates.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {['All', 'Present', 'WFH', 'Late', 'Absent', 'On Leave'].map((item) => (
            <button
              key={item}
              className={`chip${statusFilter === item ? ' active' : ''}`}
              onClick={() => setStatusFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-sm">{row.initials}</div>
                      <span className="cell-title">{row.employeeName}</span>
                    </div>
                  </td>
                  <td>{row.department}</td>
                  <td>{row.date}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td>{row.checkIn || '—'}</td>
                  <td>{row.checkOut || '—'}</td>
                  <td>{hoursBetween(row.checkIn, row.checkOut) || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="empty-state">
            <CalendarCheck2 size={32} />
            <p className="title">No attendance records</p>
            <p>There are no records matching the selected filters.</p>
          </div>
        )}
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