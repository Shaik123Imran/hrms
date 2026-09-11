import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as dataService from '../../services/dataService.js';
import Button from '../../components/Button.jsx';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  dob: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  department: '',
  designation: '',
  employeeType: 'Full-time',
  salary: '',
  joinDate: '',
  skills: '',
  status: 'Active',
};

export default function EmployeeForm() {
  const { id, employeeId } = useParams();
  const entityId = id || employeeId;
  const navigate = useNavigate();
  const isEdit = Boolean(entityId);

  const [form, setForm] = useState(emptyForm);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([dataService.fetchDepartments(), dataService.fetchDesignations()]).then(
      ([departmentRows, designationRows]) => {
        setDepartments(departmentRows);
        setDesignations(designationRows);
      }
    );

    if (isEdit) {
      dataService.fetchEmployeeById(entityId).then((result) => {
        if (result) {
          setForm({
            ...result,
            salary: String(result.salary),
            skills: Array.isArray(result.skills) ? result.skills.join(', ') : result.skills,
          });
        } else {
          navigate('/employees', { replace: true });
        }
        setLoading(false);
      });
    }
  }, [entityId, isEdit, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      salary: Number(form.salary) || 0,
      skills: form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        await dataService.updateEmployee(entityId, payload);
      } else {
        await dataService.createEmployee(payload);
      }
      navigate('/employees');
    } catch {
      setError('Something went wrong while saving the employee.');
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="muted">Loading…</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
          <p className="page-subtitle">
            {isEdit ? 'Update the employee details below.' : 'Fill in the details to onboard a new employee.'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/employees')}>
          <ArrowLeft size={16} />
          Back to Employees
        </Button>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-danger mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="grid grid-3" style={{ rowGap: 18, columnGap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                className="form-input"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                className="form-input"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone <span className="required">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                className="form-input"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gender">
                Gender
              </label>
              <select id="gender" name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                <option value="">Select…</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dob">
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                className="form-input"
                value={form.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="department">
                Department <span className="required">*</span>
              </label>
              <select
                id="department"
                name="department"
                className="form-select"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">Select…</option>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="designation">
                Designation <span className="required">*</span>
              </label>
              <select
                id="designation"
                name="designation"
                className="form-select"
                value={form.designation}
                onChange={handleChange}
                required
              >
                <option value="">Select…</option>
                {designations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="employeeType">
                Employee Type
              </label>
              <select
                id="employeeType"
                name="employeeType"
                className="form-select"
                value={form.employeeType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salary">
                Salary (CTC)
              </label>
              <input
                id="salary"
                name="salary"
                type="number"
                className="form-input"
                value={form.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="joinDate">
                Join Date
              </label>
              <input
                id="joinDate"
                name="joinDate"
                type="date"
                className="form-input"
                value={form.joinDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select id="status" name="status" className="form-select" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="address">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                className="form-textarea"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="city">
                City
              </label>
              <input id="city" name="city" className="form-input" value={form.city} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="state">
                State
              </label>
              <input id="state" name="state" className="form-input" value={form.state} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="zip">
                ZIP
              </label>
              <input id="zip" name="zip" className="form-input" value={form.zip} onChange={handleChange} />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="skills">
                Skills (comma separated)
              </label>
              <input
                id="skills"
                name="skills"
                className="form-input"
                placeholder="React, Node.js, SQL"
                value={form.skills}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2 mt-6">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Employee'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/employees')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}