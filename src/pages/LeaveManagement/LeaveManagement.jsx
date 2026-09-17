
import { useEffect, useState } from 'react';
import * as dataService from '../../services/dataService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Card from '../../components/Card.jsx';

const ORG_VIEW_ROLES = ['Admin', 'HR Manager'];
const LEAVE_TYPES = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Work From Home', 'Comp Off'];

export default function LeaveManagement() {
  const { user } = useAuth();
  const isOrgView = ORG_VIEW_ROLES.includes(user?.role);
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dataService.fetchLeaves(), dataService.fetchEmployees()]).then(
      ([leaveData, employeeData]) => {
        setLeaves(leaveData);
        setEmployees(employeeData);
        setLoading(false);
      }
    );
  }, []);

  async function handleStatusChange(id, status) {
    const updated = await dataService.updateLeaveStatus(id, status);
    setLeaves((prev) => prev.map((leave) => (leave.id === id ? updated : leave)));
  }

  function employeeName(employeeId) {
    const employee = employees.find((item) => item.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
  }

  if (loading) return <p className="muted">Loading leave requests…</p>;

  return isOrgView ? (
    <OrgLeaveView leaves={leaves} employeeName={employeeName} onStatusChange={handleStatusChange} />
  ) : (
    <SelfLeaveView leaves={leaves} user={user} setLeaves={setLeaves} />
  );
}

function OrgLeaveView({ leaves, employeeName, onStatusChange }) {
  const sorted = [...leaves].sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Leave Management</h2>
          <p className="page-subtitle">Review and act on leave requests across the organization.</p>
        </div>
      </div>

      <Card title="All Leave Requests" subtitle={`${sorted.length} total`}>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((leave) => (
                <tr key={leave.id}>
                  <td className="cell-title">{employeeName(leave.employeeId)}</td>
                  <td>{leave.type}</td>
                  <td>{leave.startDate === leave.endDate ? leave.startDate : `${leave.startDate} → ${leave.endDate}`}</td>
                  <td>{leave.days}</td>
                  <td>
                    <StatusBadge status={leave.status} />
                  </td>
                  <td>
                    {leave.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => onStatusChange(leave.id, 'Approved')}
                          className="btn btn-sm"
                          style={{ background: '#ecfdf5', color: '#16a34a' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onStatusChange(leave.id, 'Rejected')}
                          className="btn btn-sm"
                          style={{ background: '#fef2f2', color: '#dc2626' }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SelfLeaveView({ leaves, user, setLeaves }) {
  const myLeaves = leaves
    .filter((leave) => leave.employeeId === user.employeeId)
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));

  const [form, setForm] = useState({ type: LEAVE_TYPES[0], startDate: '', endDate: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.startDate || !form.endDate) {
      setMessage('Please select both start and end dates.');
      return;
    }
    setSubmitting(true);
    const days = Math.max(
      1,
      Math.round((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1
    );
    const created = await dataService.createLeave({
      employeeId: user.employeeId,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason,
    });
    setLeaves((prev) => [...prev, created]);
    setForm({ type: LEAVE_TYPES[0], startDate: '', endDate: '', reason: '' });
    setMessage('Leave request submitted.');
    setSubmitting(false);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Leave Management</h2>
          <p className="page-subtitle">Request leave and track your own history.</p>
        </div>
      </div>

      <div className="grid grid-2 mb-4">
        <Card title="Request Leave">
          {message && (
            <p style={{ fontSize: '0.82rem', color: '#16a34a', marginBottom: '0.75rem' }}>{message}</p>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
            <label style={fieldLabel}>
              Type
              <select name="type" value={form.type} onChange={handleChange} style={fieldInput}>
                {LEAVE_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label style={fieldLabel}>
                Start Date
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} style={fieldInput} />
              </label>
              <label style={fieldLabel}>
                End Date
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} style={fieldInput} />
              </label>
            </div>
            <label style={fieldLabel}>
              Reason
              <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} style={fieldInput} />
            </label>
            <button type="submit" disabled={submitting} className="btn" style={{ background: '#4f46e5', color: '#fff', width: 'fit-content' }}>
              {submitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </form>
        </Card>

        <Card title="My Leave History" subtitle={`${myLeaves.length} requests`}>
          {myLeaves.length === 0 ? (
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
                  {myLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="cell-title">{leave.type}</td>
                      <td>{leave.startDate === leave.endDate ? leave.startDate : `${leave.startDate} → ${leave.endDate}`}</td>
                      <td>
                        <StatusBadge status={leave.status} />
                      </td>
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

function StatusBadge({ status }) {
  const variants = { Approved: 'success', Pending: 'warning', Rejected: 'danger' };
  return <span className={`badge badge-${variants[status] || 'neutral'}`}>{status}</span>;
}

const fieldLabel = { display: 'block', fontSize: '0.8rem', color: '#475569' };
const fieldInput = {
  marginTop: '0.3rem',
  width: '100%',
  borderRadius: '0.4rem',
  border: '1px solid #e2e8f0',
  padding: '0.5rem 0.65rem',
  fontSize: '0.85rem',
  color: '#1e293b',
  fontFamily: 'inherit',
};