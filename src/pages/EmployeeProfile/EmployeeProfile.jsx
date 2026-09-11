import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Mail, Phone, MapPin, Building2, Briefcase, CalendarDays, IdCard, Layers } from 'lucide-react';
import * as dataService from '../../services/dataService.js';
import { currencyINR, formatDate, getInitials } from '../../utils/formatters.js';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.fetchEmployeeById(id).then((result) => {
      setEmployee(result);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <p className="muted">Loading profile…</p>;
  }

  if (!employee) {
    return (
      <div className="empty-state">
        <p className="title">Employee not found</p>
        <Button onClick={() => navigate('/employees')}>Back to Employees</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <Button variant="ghost" size="sm" onClick={() => navigate('/employees')}>
          <ArrowLeft size={16} />
          Back to Employees
        </Button>
        <Button onClick={() => navigate(`/employees/${employee.id}/edit`)}>
          <Pencil size={16} />
          Edit Profile
        </Button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="avatar avatar-lg">{getInitials(employee.firstName, employee.lastName)}</div>
            <div style={{ flex: 1 }}>
              <h2 className="page-title" style={{ marginBottom: 4 }}>
                {employee.firstName} {employee.lastName}
              </h2>
              <div className="flex gap-2 items-center" style={{ flexWrap: 'wrap' }}>
                <span className="badge badge-success">{employee.status}</span>
                <span className="badge badge-info">{employee.department}</span>
                <span className="badge badge-neutral">{employee.employeeType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        <Card title="Personal Details" subtitle={employee.email}>
          <InfoRow icon={Mail} label="Email" value={employee.email} />
          <InfoRow icon={Phone} label="Phone" value={employee.phone} />
          <InfoRow icon={MapPin} label="Location" value={`${employee.city}, ${employee.state}`} />
          <InfoRow icon={IdCard} label="Date of Birth" value={formatDate(employee.dob)} />
          <InfoRow icon={Layers} label="Gender" value={employee.gender} />
        </Card>

        <Card title="Employment Details" subtitle="Role and compensation">
          <InfoRow icon={Building2} label="Department" value={employee.department} />
          <InfoRow icon={Briefcase} label="Designation" value={employee.designation} />
          <InfoRow icon={CalendarDays} label="Joined" value={formatDate(employee.joinDate)} />
          <InfoRow icon={IdCard} label="Employee Type" value={employee.employeeType} />
          <InfoRow label="Salary (CTC)" value={currencyINR(employee.salary)} />
        </Card>

        <Card title="Skills & Address" subtitle="Additional information">
          <div className="mb-4">
            {employee.skills && employee.skills.length > 0 ? (
              employee.skills.map((skill) => (
                <span className="skill-chip" key={skill}>
                  {skill}
                </span>
              ))
            ) : (
              <p className="muted text-sm">No skills listed.</p>
            )}
          </div>
          <div className="divider" />
          <p className="muted text-sm">
            {employee.address}, {employee.city}, {employee.state} — {employee.zip}
          </p>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-2" style={{ padding: '10px 0', alignItems: 'flex-start' }}>
      {Icon && <Icon size={16} className="muted" style={{ marginTop: 2 }} />}
      <div>
        <div className="text-sm muted">{label}</div>
        <div style={{ fontWeight: 600 }}>{value || '—'}</div>
      </div>
    </div>
  );
}