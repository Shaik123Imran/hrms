
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import * as dataService from '../../services/dataService.js';
import Card from '../../components/Card.jsx';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');

  useEffect(() => {
    Promise.all([dataService.fetchEmployees(), dataService.fetchDepartments()]).then(
      ([employeeData, departmentData]) => {
        setEmployees(employeeData);
        setDepartments(departmentData);
        setLoading(false);
      }
    );
  }, []);

  const filtered = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        employee.email.toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === 'All' || employee.department === department;
      return matchesSearch && matchesDept;
    });
  }, [employees, search, department]);

  if (loading) {
    return <p className="muted">Loading employees…</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Employees</h2>
          <p className="page-subtitle">{filtered.length} total</p>
        </div>
        <Link to="/employees/new" className="btn btn-secondary btn-sm">
          + Add Employee
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email…"
          style={inputStyle}
        />
        <select value={department} onChange={(event) => setDepartment(event.target.value)} style={inputStyle}>
          <option>All</option>
          {departments.map((dept) => (
            <option key={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <Card>
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee) => (
                <tr key={employee.id}>
                  <td className="cell-title">
                    <Link to={`/employees/${employee.id}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>
                      {employee.firstName} {employee.lastName}
                    </Link>
                  </td>
                  <td>{employee.department}</td>
                  <td>{employee.designation}</td>
                  <td>
                    <span className={`badge ${employee.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/employees/${employee.id}/edit`} style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="muted" style={{ padding: '1rem' }}>
              No employees match your search.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

const inputStyle = {
  borderRadius: '0.4rem',
  border: '1px solid #e2e8f0',
  padding: '0.45rem 0.7rem',
  fontSize: '0.85rem',
  color: '#1e293b',
};