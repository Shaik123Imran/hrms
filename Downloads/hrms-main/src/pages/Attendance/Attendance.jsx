import { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck2,
  Clock,
  CalendarOff,
  Home,
  Plus,
  Search,
} from 'lucide-react';
import * as dataService from '../../services/dataService.js';
import { getInitials } from '../../utils/formatters.js';

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState('2026-09-11');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    employeeId: '',
    date: '2026-09-11',
    status: 'Present',
    checkIn: '',
    checkOut: '',
  });

  useEffect(() => {
    Promise.all([
      dataService.fetchEmployees(),
      dataService.fetchAttendance(),
    ]).then(([employeeRows, attendanceRows]) => {
      setEmployees(employeeRows);
      setRecords(attendanceRows);
      setLoading(false);
    });
  }, []);

  const dates = useMemo(
    () => [...new Set(records.map((record) => record.date))].sort().reverse(),
    [records]
  );

  const rows = useMemo(() => {
    return records
      .filter((record) => record.date === date)
      .filter(
        (record) =>
          statusFilter === 'All' || record.status === statusFilter
      )
      .map((record) => {
        const employee = employees.find(
          (item) => item.id === record.employeeId
        );

        return {
          ...record,
          employeeName: employee
            ? `${employee.firstName} ${employee.lastName}`
            : record.employeeId,
          department: employee ? employee.department : '—',
          initials: employee
            ? getInitials(employee.firstName, employee.lastName)
            : '?',
        };
      })
      .filter((record) =>
        record.employeeName.toLowerCase().includes(search.toLowerCase())
      );
  }, [records, employees, date, statusFilter, search]);

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

  const openAddModal = () => {
    setForm({
      employeeId: employees[0]?.id || '',
      date,
      status: 'Present',
      checkIn: '',
      checkOut: '',
    });

    setShowModal(true);
  };

  const saveAttendance = () => {
    if (!form.employeeId || !form.date || !form.status) return;

    const database = JSON.parse(
      localStorage.getItem('hrms_data') || '{}'
    );

    if (!database.attendance) {
      database.attendance = [];
    }

    const existingIndex = database.attendance.findIndex(
      (record) =>
        record.employeeId === form.employeeId &&
        record.date === form.date
    );

    const attendanceRecord = {
      id:
        existingIndex >= 0
          ? database.attendance[existingIndex].id
          : `att${Date.now()}`,
      employeeId: form.employeeId,
      date: form.date,
      status: form.status,
      checkIn: form.checkIn || '',
      checkOut: form.checkOut || '',
    };

    if (existingIndex >= 0) {
      database.attendance[existingIndex] = attendanceRecord;
    } else {
      database.attendance.push(attendanceRecord);
    }

    localStorage.setItem('hrms_data', JSON.stringify(database));

    setRecords(database.attendance);
    setDate(form.date);
    setShowModal(false);
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) {
      return '—';
    }

    const parseTime = (time) => {
      const value = String(time).trim();

      const match24 = value.match(/^(\d{1,2}):(\d{2})$/);

      if (match24) {
        return {
          hours: Number(match24[1]),
          minutes: Number(match24[2]),
        };
      }

      const match12 = value.match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
      );

      if (match12) {
        let hours = Number(match12[1]);
        const minutes = Number(match12[2]);
        const period = match12[3].toUpperCase();

        if (period === 'PM' && hours !== 12) {
          hours += 12;
        }

        if (period === 'AM' && hours === 12) {
          hours = 0;
        }

        return {
          hours,
          minutes,
        };
      }

      return null;
    };

    const start = parseTime(checkIn);
    const end = parseTime(checkOut);

    if (!start || !end) {
      return '—';
    }

    const startMinutes = start.hours * 60 + start.minutes;
    const endMinutes = end.hours * 60 + end.minutes;

    let difference = endMinutes - startMinutes;

    if (difference < 0) {
      difference += 24 * 60;
    }

    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;

    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return <p className="muted">Loading attendance…</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Attendance</h2>
          <p className="page-subtitle">
            Daily attendance records from the shared data store.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Add Attendance
        </button>
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
            <div className="stat-value">
              {summary.leave + summary.absent}
            </div>
          </div>
        </div>
      </div>

      <div
        className="grid grid-3 mb-4"
        style={{
          gridTemplateColumns: '220px 1fr 280px',
          alignItems: 'center',
        }}
      >
        <select
          className="form-select"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        >
          {dates.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {[
            'All',
            'Present',
            'WFH',
            'Late',
            'Absent',
            'On Leave',
            'Half Day',
          ].map((item) => (
            <button
              key={item}
              className={`chip${
                statusFilter === item ? ' active' : ''
              }`}
              onClick={() => setStatusFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.55,
            }}
          />

          <input
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search employee..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
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
                      <div className="avatar avatar-sm">
                        {row.initials}
                      </div>

                      <span className="cell-title">
                        {row.employeeName}
                      </span>
                    </div>
                  </td>

                  <td>{row.department}</td>

                  <td>{row.date}</td>

                  <td>
                    <StatusBadge status={row.status} />
                  </td>

                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clock size={15} />
                      {row.checkIn || '—'}
                    </div>
                  </td>

                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clock size={15} />
                      {row.checkOut || '—'}
                    </div>
                  </td>

                  <td>
                    {calculateHours(row.checkIn, row.checkOut)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="empty-state">
            <CalendarCheck2 size={32} />
            <p className="title">No attendance records</p>
            <p>
              There are no records matching the selected filters.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>
                  Add / Update Attendance
                </h3>

                <p
                  style={{
                    margin: '5px 0 0',
                    opacity: 0.65,
                  }}
                >
                  Enter employee attendance details.
                </p>
              </div>

              <button
                className="btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label className="form-label">Employee</label>

                <select
                  className="form-select"
                  value={form.employeeId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      employeeId: event.target.value,
                    })
                  }
                >
                  <option value="">Select employee</option>

                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Date</label>

                <input
                  type="date"
                  className="form-input"
                  value={form.date}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      date: event.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="form-label">Status</label>

                <select
                  className="form-select"
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value,
                    })
                  }
                >
                  <option value="Present">Present</option>
                  <option value="WFH">WFH</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <div>
                  <label className="form-label">Check-in</label>

                  <input
                    type="time"
                    className="form-input"
                    value={form.checkIn}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        checkIn: event.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="form-label">Check-out</label>

                  <input
                    type="time"
                    className="form-input"
                    value={form.checkOut}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        checkOut: event.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '8px',
                }}
              >
                <button
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={saveAttendance}
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

  return (
    <span
      className={`badge-${
        variants[status] || 'neutral'
      } badge`}
    >
      {status}
    </span>
  );
}