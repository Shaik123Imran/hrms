
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as dataService from '../../services/dataService.js';
import Card from '../../components/Card.jsx';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  designation: '',
  employeeType: 'Full-time',
  status: 'Active',
  joinDate: new Date().toISOString().slice(0, 10),
  salary: '',
};

export default function EmployeeForm() {
  const params = useParams();
  const employeeId = params.id || params.employeeId || null;
  const isEditMode = Boolean(employeeId);
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      dataService.fetchDepartments(),
      dataService.fetchDesignations(),
      isEditMode ? dataService.fetchEmployeeById(employeeId) : Promise.resolve(null),
    ]).then(([departmentData, designationData, employee]) => {
      setDepartments(departmentData);
      setDesignations(designationData);
      if (employee) setValues({ ...EMPTY, ...employee });
      else setValues((prev) => ({ ...prev, department: departmentData[0] || '', designation: designationData[0] || '' }));
      setLoading(false);
    });
  }, [employeeId, isEditMode]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!values.firstName || !values.lastName || !values.email) {
      setError('First name, last name, and email are required.');
      return;
    }
    setError('');
    setSaving(true);
    const payload = { ...values, salary: Number(values.salary) || 0 };
    if (isEditMode) {
      await dataService.updateEmployee(employeeId, payload);
      navigate(`/employees/${employeeId}`);
    } else {
      const created = await dataService.createEmployee(payload);
      navigate(`/employees/${created.id}`);
    }
  }

  if (loading) {
    return <p className="muted">Loading…</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">{isEditMode ? 'Edit Employee' : 'Add Employee'}</h2>
          <p className="page-subtitle">
            {isEditMode ? 'Update this employee\u2019s details.' : 'Create a new employee record.'}
          </p>
        </div>
      </div>

      <Card>
        {error && (
          <p style={{ background: '#fef2f2', color: '#dc2626', padding: '0.6rem 0.8rem', borderRadius: '0.4rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="First Name" name="firstName" value={values.firstName} onChange={handleChange} />
          <Field label="Last Name" name="lastName" value={values.lastName} onChange={handleChange} />
          <Field label="Email" name="email" type="email" value={values.email} onChange={handleChange} />
          <Field label="Phone" name="phone" value={values.phone} onChange={handleChange} />

          <SelectField label="Department" name="department" value={values.department} onChange={handleChange} options={departments} />
          <SelectField label="Designation" name="designation" value={values.designation} onChange={handleChange} options={designations} />

          <SelectField
            label="Employee Type"
            name="employeeType"
            value={values.employeeType}
            onChange={handleChange}
            options={['Full-time', 'Part-time']}
          />
          <SelectField
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            options={['Active', 'Inactive']}
          />

          <Field label="Join Date" name="joinDate" type="date" value={values.joinDate} onChange={handleChange} />
          <Field label="Salary (annual)" name="salary" type="number" value={values.salary} onChange={handleChange} />

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={saving} className="btn" style={{ background: '#4f46e5', color: '#fff' }}>
              {saving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange }) {
  return (
    <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569' }}>
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        style={{ marginTop: '0.3rem', width: '100%', borderRadius: '0.4rem', border: '1px solid #e2e8f0', padding: '0.5rem 0.65rem', fontSize: '0.85rem', color: '#1e293b' }}
      />
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569' }}>
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{ marginTop: '0.3rem', width: '100%', borderRadius: '0.4rem', border: '1px solid #e2e8f0', padding: '0.5rem 0.65rem', fontSize: '0.85rem', color: '#1e293b' }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}