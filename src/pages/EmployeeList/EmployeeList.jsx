import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, Users } from 'lucide-react';
import * as dataService from '../../services/dataService.js';
import { currencyINR, getInitials } from '../../utils/formatters.js';
import Button from '../../components/Button.jsx';

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dataService.fetchEmployees(), dataService.fetchDepartments()]).then(
      ([employeeRows, departmentRows]) => {
        setEmployees(employeeRows);
        setDepartments(departmentRows);
        setLoading(false);
      }
    );
  }, []);

  const filtered = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        !search ||
        `${employee.firstName} ${employee.lastName} ${employee.email}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesDepartment = department === 'All' || employee.department === department;
      const matchesStatus = status === 'All' || employee.status === status;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, search, department, status]);

  const handleDelete = async (employee) => {
    if (window.confirm(`Delete ${employee.firstName} ${employee.lastName}? This cannot be undone.`)) {
      await dataService.deleteEmployee(employee.id);
      setEmployees((current) => current.filter((item) => item.id !== employee.id));
    }
  };

  if (loading) {
    return <p className="muted">Loading employees…</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Employees</h2>
          <p className="page-subtitle">{employees.length} employees in total</p>
        </div>
        <Button onClick={() => navigate('/employees/new')}>
          <Plus size={16} />
          Add Employee
        </Button>
      </div>

      <div className="grid grid-3 mb-4" style={{ gridTemplateColumns: '1fr 220px 180px', alignItems: 'center' }}>
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input
            className="form-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          className="form-select"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
        >
          <option value="All">All Departments</option>
          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Contact</th>
                <th>Salary</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-sm">
                        {getInitials(employee.firstName, employee.lastName)}
                      </div>
                      <div>
                        <div className="cell-title">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="cell-subtitle">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{employee.department}</td>
                  <td>{employee.designation}</td>
                  <td>
                    <div className="cell-subtitle">{employee.phone}</div>
                  </td>
                  <td>{currencyINR(employee.salary)}</td>
                  <td>
                    <span
                      className={`badge ${employee.status === 'Active' ? 'badge-success' : 'badge-danger'}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                      <button className="icon-btn" title="View" onClick={() => navigate(`/employees/${employee.id}`)}>
                        <Eye size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        title="Edit"
                        onClick={() => navigate(`/employees/${employee.id}/edit`)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-btn danger"
                        title="Delete"
                        onClick={() => handleDelete(employee)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <Users size={32} />
            <p className="title">No employees found</p>
            <p>Try adjusting the search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}