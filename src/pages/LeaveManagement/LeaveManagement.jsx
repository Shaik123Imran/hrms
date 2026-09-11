import { useEffect, useMemo, useState } from 'react';
import { CalendarRange, Check, X } from 'lucide-react';
import * as dataService from '../../services/dataService.js';
import { formatShortDate, getInitials } from '../../utils/formatters.js';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';

const leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Comp Off', 'Work From Home'];

const emptyForm = { employeeId: '', type: 'Casual Leave', startDate: '', endDate: '', reason: '' };

export default function LeaveManagement() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dataService.fetchEmployees(), dataService.fetchLeaves()]).then(
      ([employeeRows, leaveRows]) => {
        setEmployees(employeeRows);
        setLeaves(leaveRows);
        setLoading(false);
      }
    );
  }, []);

  const rows = useMemo(() => {
    return leaves
      .filter((leave) => statusFilter === 'All' || leave.status === statusFilter)
      .map((leave) => {
        const employee = employees.find((item) => item.id === leave.employeeId);
        return {
          ...leave,
          employeeName: employee ? `${employee.firstName} ${employee.lastName}` : leave.employeeId,
          department: employee ? employee.department : '—',
          initials: employee ? getInitials(employee.firstName, employee.lastName) : '?',
        };
      })
      .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
  }, [leaves, employees, statusFilter]);

  const pendingCount = useMemo(() => leaves.filter((leave) => leave.status === 'Pending').length, [leaves]);

  const handleStatusChange = async (id, status) => {
    const updated = await dataService.updateLeaveStatus(id, status);
    if (updated) {
      setLeaves((current) => current.map((leave) => (leave.id === id ? updated : leave)));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await dataService.createLeave(form);
    if (created) {
      setLeaves((current) => [created, ...current]);
      setForm(emptyForm);
      setShowForm(false);
    }
  };

  if (loading) {
    return <p className="muted">Loading leaves…</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Leave Management</h2>
          <p className="page-subtitle">
            {pendingCount} pending request{pendingCount === 1 ? '' : 's'}
          </p>
        </div>
        <Button onClick={() => setShowForm((current) => !current)}>
          {showForm ? 'Hide Form' : 'Apply Leave'}
        </Button>
      </div>

      {showForm && (
        <Card title="Apply for Leave" subtitle="Submit a new leave request" className="mb-4">
          <form onSubmit={handleSubmit} className="grid grid-3" style={{ rowGap: 18, columnGap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="employeeId">
                Employee <span className="required">*</span>
              </label>
              <select
                id="employeeId"
                name="employeeId"
                className="form-select"
                value={form.employeeId}
                onChange={handleChange}
                required
              >
                <option value="">Select employee…</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="type">
                Leave Type
              </label>
              <select id="type" name="type" className="form-select" value={form.type} onChange={handleChange}>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="startDate">
                  Start <span className="required">*</span>
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="form-input"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="endDate">
                  End <span className="required">*</span>
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="form-input"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="reason">
                Reason <span className="required">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                className="form-textarea"
                value={form.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Submit Request</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map((item) => (
          <button
            key={item}
            className={`chip${statusFilter === item ? ' active' : ''}`}
            onClick={() => setStatusFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((leave) => (
                <tr key={leave.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-sm">{leave.initials}</div>
                      <div>
                        <div className="cell-title">{leave.employeeName}</div>
                        <div className="cell-subtitle">{leave.department}</div>
                      </div>
                    </div>
                  </td>
                  <td>{leave.type}</td>
                  <td>
                    {formatShortDate(leave.startDate)} → {formatShortDate(leave.endDate)}
                  </td>
                  <td>{leave.days}</td>
                  <td style={{ maxWidth: 240 }}>{leave.reason}</td>
                  <td>
                    <StatusBadge status={leave.status} />
                  </td>
                  <td>
                    <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                      {leave.status === 'Pending' ? (
                        <>
                          <button
                            className="icon-btn"
                            title="Approve"
                            onClick={() => handleStatusChange(leave.id, 'Approved')}
                          >
                            <Check size={16} style={{ color: 'var(--color-success)' }} />
                          </button>
                          <button
                            className="icon-btn danger"
                            title="Reject"
                            onClick={() => handleStatusChange(leave.id, 'Rejected')}
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="muted text-sm">{leave.appliedOn}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="empty-state">
            <CalendarRange size={32} />
            <p className="title">No leave requests</p>
            <p>There are no leave requests matching the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const variants = {
    Approved: 'success',
    Pending: 'warning',
    Rejected: 'danger',
  };
  return <span className={`badge badge-${variants[status] || 'neutral'}`}>{status}</span>;
}