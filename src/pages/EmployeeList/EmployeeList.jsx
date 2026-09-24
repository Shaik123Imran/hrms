import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  UserX,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import * as dataService from '../../services/dataService.js';
import { currencyINR, getInitials } from '../../utils/formatters.js';
import Button from '../../components/Button.jsx';

export default function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [designation, setDesignation] = useState('All');
  const [status, setStatus] = useState('All');

  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(5);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dataService.fetchEmployees(),
      dataService.fetchDepartments(),
      dataService.fetchDesignations(),
    ])
      .then(([employeeRows, departmentRows, designationRows]) => {
        setEmployees(employeeRows);
        setDepartments(departmentRows);
        setDesignations(designationRows);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load employee data:', error);
        setLoading(false);
      });
  }, []);

  const filteredEmployees = useMemo(() => {
    const filtered = employees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();

      const email = employee.email?.toLowerCase() || '';
      const searchValue = search.toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue);

      const matchesDepartment =
        department === 'All' ||
        employee.department === department;

      const matchesDesignation =
        designation === 'All' ||
        employee.designation === designation;

      const matchesStatus =
        status === 'All' ||
        employee.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDesignation &&
        matchesStatus
      );
    });

    if (!sortField) {
      return filtered;
    }

    return [...filtered].sort((firstEmployee, secondEmployee) => {
      let firstValue;
      let secondValue;

      if (sortField === 'name') {
        firstValue =
          `${firstEmployee.firstName} ${firstEmployee.lastName}`.toLowerCase();

        secondValue =
          `${secondEmployee.firstName} ${secondEmployee.lastName}`.toLowerCase();
      } else if (sortField === 'salary') {
        firstValue = Number(firstEmployee.salary) || 0;
        secondValue = Number(secondEmployee.salary) || 0;
      } else {
        firstValue = String(
          firstEmployee[sortField] || ''
        ).toLowerCase();

        secondValue = String(
          secondEmployee[sortField] || ''
        ).toLowerCase();
      }

      if (firstValue < secondValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }, [
    employees,
    search,
    department,
    designation,
    status,
    sortField,
    sortDirection,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    department,
    designation,
    status,
    employeesPerPage,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEmployees.length / employeesPerPage
    )
  );

  const startIndex =
    (currentPage - 1) * employeesPerPage;

  const endIndex =
    startIndex + employeesPerPage;

  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    endIndex
  );

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === 'Active'
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === 'Inactive'
  ).length;

  const handleStatusCardClick = (selectedStatus) => {
    setStatus(selectedStatus);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((direction) =>
        direction === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} />;
    }

    return sortDirection === 'asc' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('All');
    setDesignation('All');
    setStatus('All');
    setSortField('');
    setSortDirection('asc');
    setEmployeesPerPage(5);
    setCurrentPage(1);
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Delete ${employee.firstName} ${employee.lastName}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await dataService.deleteEmployee(employee.id);

      setEmployees((currentEmployees) =>
        currentEmployees.filter(
          (item) => item.id !== employee.id
        )
      );

      if (
        paginatedEmployees.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage((page) => page - 1);
      }
    } catch (error) {
      console.error('Failed to delete employee:', error);
      window.alert(
        'Failed to delete employee. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <p className="muted">
        Loading employees…
      </p>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">
            Employees
          </h2>

          <p className="page-subtitle">
            Manage your organization's employees
          </p>
        </div>

        <Button
          onClick={() =>
            navigate('/employees/new')
          }
        >
          <Plus size={16} />
          Add Employee
        </Button>
      </div>

      <div className="mb-5">
        <div className="flex flex-col gap-1 mb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#172033',
              }}
            >
              Employee Overview
            </h3>

            <p
              style={{
                margin: '4px 0 0',
                fontSize: '0.875rem',
                color: '#64748b',
              }}
            >
              Quick statistics about your team
            </p>
          </div>
        </div>

        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <button
            type="button"
            onClick={() =>
              handleStatusCardClick('All')
            }
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '150px',
              padding: '24px',
              borderRadius: '18px',
              background:
                'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
              border:
                status === 'All'
                  ? '2px solid #2563eb'
                  : '1px solid #dbe7f5',
              borderLeft: '5px solid #2563eb',
              boxShadow:
                '0 8px 24px rgba(15, 23, 42, 0.06)',
              textAlign: 'left',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '-25px',
                bottom: '-35px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: '#eff6ff',
              }}
            />

            <div className="flex items-start gap-4">
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  minWidth: '54px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#e8f0ff',
                  color: '#2563eb',
                }}
              >
                <Users size={27} />
              </div>

              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  Total Employees
                </p>

                <h3
                  style={{
                    margin: '6px 0 0',
                    fontSize: '2rem',
                    lineHeight: 1,
                    fontWeight: 700,
                    color: '#172033',
                  }}
                >
                  {totalEmployees}
                </h3>

                <p
                  style={{
                    margin: '12px 0 0',
                    fontSize: '0.8rem',
                    color: '#64748b',
                  }}
                >
                  Showing all employees
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              handleStatusCardClick('Active')
            }
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '150px',
              padding: '24px',
              borderRadius: '18px',
              background:
                'linear-gradient(135deg, #ffffff 0%, #f8fffb 100%)',
              border:
                status === 'Active'
                  ? '2px solid #16a34a'
                  : '1px solid #dcefe4',
              borderLeft: '5px solid #16a34a',
              boxShadow:
                '0 8px 24px rgba(15, 23, 42, 0.06)',
              textAlign: 'left',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '-25px',
                bottom: '-35px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: '#ecfdf3',
              }}
            />

            <div className="flex items-start gap-4">
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  minWidth: '54px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#e8f8ee',
                  color: '#16a34a',
                }}
              >
                <UserCheck size={27} />
              </div>

              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  Active Employees
                </p>

                <h3
                  style={{
                    margin: '6px 0 0',
                    fontSize: '2rem',
                    lineHeight: 1,
                    fontWeight: 700,
                    color: '#172033',
                  }}
                >
                  {activeEmployees}
                </h3>

                <p
                  style={{
                    margin: '12px 0 0',
                    fontSize: '0.8rem',
                    color: '#16a34a',
                  }}
                >
                  Click to view active
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              handleStatusCardClick('Inactive')
            }
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '150px',
              padding: '24px',
              borderRadius: '18px',
              background:
                'linear-gradient(135deg, #ffffff 0%, #fffafb 100%)',
              border:
                status === 'Inactive'
                  ? '2px solid #ef4444'
                  : '1px solid #f2dfe3',
              borderLeft: '5px solid #ef4444',
              boxShadow:
                '0 8px 24px rgba(15, 23, 42, 0.06)',
              textAlign: 'left',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '-25px',
                bottom: '-35px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: '#fff1f2',
              }}
            />

            <div className="flex items-start gap-4">
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  minWidth: '54px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff0f1',
                  color: '#ef4444',
                }}
              >
                <UserX size={27} />
              </div>

              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  Inactive Employees
                </p>

                <h3
                  style={{
                    margin: '6px 0 0',
                    fontSize: '2rem',
                    lineHeight: 1,
                    fontWeight: 700,
                    color: '#172033',
                  }}
                >
                  {inactiveEmployees}
                </h3>

                <p
                  style={{
                    margin: '12px 0 0',
                    fontSize: '0.8rem',
                    color: '#ef4444',
                  }}
                >
                  Click to view inactive
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div
        className="grid grid-3 mb-4"
        style={{
          gridTemplateColumns:
            'minmax(220px, 1fr) 220px 220px 180px',
          alignItems: 'center',
        }}
      >
        <div className="search-box">
          <Search
            className="search-icon"
            size={16}
          />

          <input
            className="form-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          className="form-select"
          value={department}
          onChange={(event) =>
            setDepartment(event.target.value)
          }
        >
          <option value="All">
            All Departments
          </option>

          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={designation}
          onChange={(event) =>
            setDesignation(event.target.value)
          }
        >
          <option value="All">
            All Designations
          </option>

          {designations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="employeesPerPage">
            Rows per page
          </label>

          <select
            id="employeesPerPage"
            className="form-select"
            value={employeesPerPage}
            onChange={(event) =>
              setEmployeesPerPage(
                Number(event.target.value)
              )
            }
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
          </select>
        </div>

        <Button
          variant="secondary"
          onClick={clearFilters}
        >
          <RotateCcw size={16} />
          Clear Filters
        </Button>
      </div>

      <div className="table-wrap">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() =>
                      handleSort('name')
                    }
                  >
                    Employee
                    {getSortIcon('name')}
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() =>
                      handleSort('department')
                    }
                  >
                    Department
                    {getSortIcon('department')}
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() =>
                      handleSort('designation')
                    }
                  >
                    Designation
                    {getSortIcon('designation')}
                  </button>
                </th>

                <th>
                  Contact
                </th>

                <th>
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() =>
                      handleSort('salary')
                    }
                  >
                    Salary
                    {getSortIcon('salary')}
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    className="flex items-center gap-1"
                    onClick={() =>
                      handleSort('status')
                    }
                  >
                    Status
                    {getSortIcon('status')}
                  </button>
                </th>

                <th
                  style={{
                    textAlign: 'right',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-sm">
                        {getInitials(
                          employee.firstName,
                          employee.lastName
                        )}
                      </div>

                      <div>
                        <div className="cell-title">
                          {employee.firstName}{' '}
                          {employee.lastName}
                        </div>

                        <div className="cell-subtitle">
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    {employee.department}
                  </td>

                  <td>
                    {employee.designation}
                  </td>

                  <td>
                    <div className="cell-subtitle">
                      {employee.phone}
                    </div>
                  </td>

                  <td>
                    {currencyINR(employee.salary)}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        employee.status === 'Active'
                          ? 'badge-success'
                          : 'badge-danger'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>

                  <td>
                    <div
                      className="flex gap-2"
                      style={{
                        justifyContent: 'flex-end',
                      }}
                    >
                      <button
                        className="icon-btn"
                        title="View"
                        aria-label={`View ${employee.firstName} ${employee.lastName}`}
                        onClick={() =>
                          navigate(
                            `/employees/${employee.id}`
                          )
                        }
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="icon-btn"
                        title="Edit"
                        aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
                        onClick={() =>
                          navigate(
                            `/employees/${employee.id}/edit`
                          )
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="icon-btn danger"
                        title="Delete"
                        aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                        onClick={() =>
                          handleDelete(employee)
                        }
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

        {filteredEmployees.length > 0 && (
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              Showing {startIndex + 1} to{' '}
              {Math.min(
                endIndex,
                filteredEmployees.length
              )}{' '}
              of {filteredEmployees.length} employees
            </p>

            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                className="icon-btn"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
              >
                <span className="hidden sm:inline">
                  Previous
                </span>

                <span className="sm:hidden">
                  Prev
                </span>
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  className={`icon-btn ${
                    currentPage === page
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              ))}

              <button
                className="icon-btn"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        )}

        {filteredEmployees.length === 0 && (
          <div className="empty-state">
            <Users size={32} />

            <p className="title">
              No employees found
            </p>

            <p>
              Try adjusting the search or filters.
            </p>

            <Button
              variant="secondary"
              onClick={clearFilters}
            >
              <RotateCcw size={16} />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}