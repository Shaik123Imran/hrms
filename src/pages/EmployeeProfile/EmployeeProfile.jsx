import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as dataService from '../../services/dataService.js';
import Card from '../../components/Card.jsx';

export default function EmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dataService.fetchEmployeeById(id),
      dataService.fetchAttendance(),
      dataService.fetchLeaves(),
    ]).then(([employeeData, attendanceData, leaveData]) => {
      setEmployee(employeeData);
      setAttendance(
        attendanceData
          .filter((record) => record.employeeId === id)
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5)
      );
      setLeaves(leaveData.filter((leave) => leave.employeeId === id));
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="muted">Loading profile…</p>;
  if (!employee) return <p className="muted">Employee not found.</p>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '9999px',
              background: '#eef2ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            {employee.firstName[0]}
          </span>
          <div>
            <h2 className="page-title">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="page-subtitle">{employee.designation}</p>
          </div>
        </div>
        <Link to={`/employees/${employee.id}/edit`} className="btn btn-secondary btn-sm">
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-2 mb-4">
        <Card title="Job Details">
          <DetailRow label="Employee ID" value={employee.id} />
          <DetailRow label="Department" value={employee.department} />
          <DetailRow label="Designation" value={employee.designation} />
          <DetailRow label="Employee Type" value={employee.employeeType} />
          <DetailRow label="Join Date" value={employee.joinDate} />
          <DetailRow label="Status" value={employee.status} />
        </Card>

        <Card title="Contact Details">
          <DetailRow label="Email" value={employee.email} />
          <DetailRow label="Phone" value={employee.phone} />
          <DetailRow label="City" value={employee.city} />
          <DetailRow label="State" value={employee.state} />
        </Card>
      </div>

      <div className="grid grid-2">
        <Card title="Recent Attendance">
          {attendance.length === 0 ? (
            <p className="muted">No attendance records yet.</p>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Leave History">
          {leaves.length === 0 ? (
            <p className="muted">No leave requests yet.</p>
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
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.type}</td>
                      <td>
                        {leave.startDate === leave.endDate ? leave.startDate : `${leave.startDate} → ${leave.endDate}`}
                      </td>
                      <td>{leave.status}</td>
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

function DetailRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span style={{ color: '#1e293b', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}
