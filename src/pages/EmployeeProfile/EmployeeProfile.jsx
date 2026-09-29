import { NavLink, Routes, Route, Navigate } from "react-router-dom";

import employeeData from "../../data/data.json";

import EmployeeOverview from "../../components/employee/profile/EmployeeOverview.jsx";
import Personal from "../../components/employee/profile/Personal.jsx";
import Employment from "../../components/employee/profile/JobDetails.jsx";
import Performance from "../../components/employee/profile/Performance.jsx";
import Documents from "../../components/employee/profile/Documents.jsx";

const EmployeeProfile = () => {

  // Get all employees from data.json
  const employees = employeeData?.employees || [];

  // Get current employee
  const employee = employees.find(
    (employee) => employee.id === "e1"
  );

  // If employee is not found
  if (!employee) {
    return (
      <div className="page-container">
        <p className="text-error">
          Employee data not found.
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="surface-card">
        <nav className="flex gap-6 px-4">

          <NavLink
            to="/employee/profile/overview"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/employee/profile/personal"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Personal
          </NavLink>

          <NavLink
            to="/employee/profile/employment"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Employment
          </NavLink>

          <NavLink
            to="/employee/profile/performance"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Performance
          </NavLink>

          <NavLink
            to="/employee/profile/documents"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Documents
          </NavLink>

        </nav>

      </div>

      <main className="mt-6">

        <Routes>

          <Route index element={ <Navigate to="overview" replace /> } />

          <Route
            path="overview"
            element={
              <EmployeeOverview
                hrData={employee}
                attendance={employeeData?.attendance || []}
              />
            }
          />

          <Route path="personal" element={ <Personal hrData={employee} /> } />

          <Route path="employment" element={ <Employment hrData={employee} /> } />

          <Route path="performance" element={ <Performance hrData={employee} /> } />

          <Route path="documents" element={ <Documents hrData={employee} /> } />

        </Routes>

      </main>

    </div>
  );
};

export default EmployeeProfile;