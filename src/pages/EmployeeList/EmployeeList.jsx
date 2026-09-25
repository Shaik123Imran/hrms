import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

import * as dataService from "../../services/dataService.js";
import { currencyINR, getInitials } from "../../utils/formatters.js";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";

export default function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [designation, setDesignation] = useState("All");
  const [status, setStatus] = useState("All");

  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

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
        console.error("Failed to load employee data:", error);
        setLoading(false);
      });
  }, []);

  const filteredEmployees = useMemo(() => {
    const filtered = employees.filter((employee) => {
      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();

      const email = employee.email?.toLowerCase() || "";
      const searchValue = search.toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue);

      const matchesDepartment =
        department === "All" || employee.department === department;

      const matchesDesignation =
        designation === "All" || employee.designation === designation;

      const matchesStatus =
        status === "All" || employee.status === status;

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

      if (sortField === "name") {
        firstValue =
          `${firstEmployee.firstName} ${firstEmployee.lastName}`.toLowerCase();

        secondValue =
          `${secondEmployee.firstName} ${secondEmployee.lastName}`.toLowerCase();
      } else if (sortField === "salary") {
        firstValue = Number(firstEmployee.salary) || 0;
        secondValue = Number(secondEmployee.salary) || 0;
      } else {
        firstValue = String(
          firstEmployee[sortField] || ""
        ).toLowerCase();

        secondValue = String(
          secondEmployee[sortField] || ""
        ).toLowerCase();
      }

      if (firstValue < secondValue) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return sortDirection === "asc" ? 1 : -1;
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
    Math.ceil(filteredEmployees.length / employeesPerPage)
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
    (employee) => employee.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  const handleStatusCardClick = (selectedStatus) => {
    setStatus(selectedStatus);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((direction) =>
        direction === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  const clearFilters = () => {
    setSearch("");
    setDepartment("All");
    setDesignation("All");
    setStatus("All");
    setSortField("");
    setSortDirection("asc");
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
      console.error("Failed to delete employee:", error);

      window.alert(
        "Failed to delete employee. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p className="text-muted">
          Loading employees…
        </p>
      </div>
    );
  }

  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (employee) => (
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full bg-[var(--color-primary-light)]
              text-sm font-semibold
              text-[var(--color-primary)]
            "
          >
            {getInitials(
              employee.firstName,
              employee.lastName
            )}
          </div>

          <div className="min-w-0">
            <p className="font-medium text-[var(--color-text-primary)]">
              {employee.firstName} {employee.lastName}
            </p>

            <p className="text-xs text-[var(--color-text-muted)]">
              {employee.email}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "department",
      header: "Department",
      render: (employee) => employee.department,
    },

    {
      key: "designation",
      header: "Designation",
      render: (employee) => employee.designation,
    },

    {
      key: "phone",
      header: "Contact",
      render: (employee) => employee.phone || "-",
    },

    {
      key: "salary",
      header: (
        <button
          type="button"
          onClick={() => handleSort("salary")}
          className="flex items-center gap-1"
        >
          Salary
          {getSortIcon("salary")}
        </button>
      ),
      render: (employee) =>
        currencyINR(employee.salary),
    },

    {
      key: "status",
      header: (
        <button
          type="button"
          onClick={() => handleSort("status")}
          className="flex items-center gap-1"
        >
          Status
          {getSortIcon("status")}
        </button>
      ),
      render: (employee) => (
        <span
          className={`badge ${
            employee.status === "Active"
              ? "badge-success"
              : "badge-error"
          }`}
        >
          {employee.status}
        </span>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      render: (employee) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            title="View employee"
            aria-label={`View ${employee.firstName} ${employee.lastName}`}
            onClick={() =>
              navigate(`/employees/${employee.id}`)
            }
          >
            <Eye size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            title="Edit employee"
            aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
            onClick={() =>
              navigate(
                `/employees/${employee.id}/edit`
              )
            }
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="danger"
            size="sm"
            title="Delete employee"
            aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
            onClick={() => handleDelete(employee)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">


      <div className="page-header">
        <div>
          <h1 className="page-title">
            Employees
          </h1>

          <p className="text-muted mt-1">
            Manage your organization's employees
          </p>
        </div>

        <Button
          onClick={() =>
            navigate("/employees/new")
          }
          icon={Plus}
        >
          Add Employee
        </Button>
      </div>

      <Card
        title="Employee Overview"
        subtitle="Quick statistics about your team"
        className="mb-6"
      >
        <div className="grid gap-4 md:grid-cols-3">

          <button
            type="button"
            onClick={() =>
              handleStatusCardClick("All")
            }
            className={`
              rounded-xl border p-5 text-left
              transition
              hover:shadow-md
              ${
                status === "All"
                  ? "border-[var(--color-primary)] bg-[var(--color-surface-selected)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]"
              }
            `}
          >
            <div className="flex items-center gap-4">

              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-[var(--color-primary-light)]
                  text-[var(--color-primary)]
                "
              >
                <Users size={24} />
              </div>

              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Total Employees
                </p>

                <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
                  {totalEmployees}
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                  Showing all employees
                </p>
              </div>

            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              handleStatusCardClick("Active")
            }
            className={`
              rounded-xl border p-5 text-left
              transition
              hover:shadow-md
              ${
                status === "Active"
                  ? "border-[var(--color-success)] bg-[var(--color-success-light)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]"
              }
            `}
          >
            <div className="flex items-center gap-4">

              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-[var(--color-success-light)]
                  text-[var(--color-success)]
                "
              >
                <UserCheck size={24} />
              </div>

              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Active Employees
                </p>

                <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
                  {activeEmployees}
                </p>

                <p className="mt-1 text-xs text-[var(--color-success)]">
                  Click to view active
                </p>
              </div>

            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              handleStatusCardClick("Inactive")
            }
            className={`
              rounded-xl border p-5 text-left
              transition
              hover:shadow-md
              ${
                status === "Inactive"
                  ? "border-[var(--color-error)] bg-[var(--color-error-light)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]"
              }
            `}
          >
            <div className="flex items-center gap-4">

              <div
                className="
                  flex h-12 w-12 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-[var(--color-error-light)]
                  text-[var(--color-error)]
                "
              >
                <UserX size={24} />
              </div>

              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Inactive Employees
                </p>

                <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
                  {inactiveEmployees}
                </p>

                <p className="mt-1 text-xs text-[var(--color-error)]">
                  Click to view inactive
                </p>
              </div>

            </div>
          </button>

        </div>
      </Card>

      <Card
        title="Employee Directory"
        subtitle="Search and filter employees"
        className="mb-6"
      >

        <div className="grid gap-4 lg:grid-cols-4">

          <div className="relative lg:col-span-1">

            <Search
              size={18}
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-[var(--color-text-muted)]
              "
            />

            <Input
              aria-label="Search employees"
              placeholder="Search by name or email…"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="pl-10"
            />
          </div>

          <div>
            <label
              htmlFor="department"
              className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]"
            >
              Department
            </label>

            <select
              id="department"
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
              className="
                h-10 w-full rounded-lg
                border border-[var(--color-border)]
                bg-[var(--color-surface)]
                px-3
                text-sm
                text-[var(--color-text-primary)]
                outline-none
                transition
                focus:border-[var(--color-primary)]
              "
            >
              <option value="All">
                All Departments
              </option>

              {departments.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="designation"
              className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]"
            >
              Designation
            </label>

            <select
              id="designation"
              value={designation}
              onChange={(event) =>
                setDesignation(event.target.value)
              }
              className="
                h-10 w-full rounded-lg
                border border-[var(--color-border)]
                bg-[var(--color-surface)]
                px-3
                text-sm
                text-[var(--color-text-primary)]
                outline-none
                transition
                focus:border-[var(--color-primary)]
              "
            >
              <option value="All">
                All Designations
              </option>

              {designations.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="
                h-10 w-full rounded-lg
                border border-[var(--color-border)]
                bg-[var(--color-surface)]
                px-3
                text-sm
                text-[var(--color-text-primary)]
                outline-none
                transition
                focus:border-[var(--color-primary)]
              "
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
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-2">

            <label
              htmlFor="employeesPerPage"
              className="text-sm text-[var(--color-text-secondary)]"
            >
              Rows per page
            </label>

            <select
              id="employeesPerPage"
              value={employeesPerPage}
              onChange={(event) =>
                setEmployeesPerPage(
                  Number(event.target.value)
                )
              }
              className="
                h-9 rounded-lg
                border border-[var(--color-border)]
                bg-[var(--color-surface)]
                px-3
                text-sm
                text-[var(--color-text-primary)]
                outline-none
                focus:border-[var(--color-primary)]
              "
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
            icon={RotateCcw}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          rows={paginatedEmployees}
          emptyTitle="No employees found"
          emptyDescription="Try adjusting the search or filters."
        />

        {filteredEmployees.length > 0 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-4 sm:flex-row">

            <p className="text-sm text-[var(--color-text-muted)]">
              Showing{" "}
              {startIndex + 1} to{" "}
              {Math.min(
                endIndex,
                filteredEmployees.length
              )}{" "}
              of{" "}
              {filteredEmployees.length} employees
            </p>

            <div className="flex items-center gap-1">

              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
              >
                Previous
              </Button>
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={
                    currentPage === page
                      ? "primary"
                      : "ghost"
                  }
                  size="sm"
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
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
              </Button>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
}