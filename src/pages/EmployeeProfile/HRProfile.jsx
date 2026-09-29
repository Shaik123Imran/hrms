import { NavLink, Routes, Route, Navigate } from "react-router-dom";

import employeeData from "../../data/data.json";

import Overview from "../../components/employee/profile/Overview.jsx";
import Personal from "../../components/employee/profile/Personal.jsx";
import Employment from "../../components/employee/profile/JobDetails.jsx";
import Performance from "../../components/employee/profile/Performance.jsx";
import Documents from "../../components/employee/profile/Documents.jsx";
import Recruitment from "../../components/employee/profile/Recruitment.jsx";

const HRProfile = () => {

  // Get all employees
  const employees = employeeData?.employees || [];

  // Get current HR
  const hrData = employees.find(
    (employee) => employee.id === "e7"
  );

  // If HR is not found
  if (!hrData) {
    return (
      <div className="page-container">
        <p className="text-error">
          HR data not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HR PROFILE NAVIGATION */}
      <div className="border-b bg-white px-6">

        <nav className="flex gap-6">

         

          <NavLink
            to="/HRProfile/personal"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Personal
          </NavLink>

          <NavLink
            to="/HRProfile/recruitment"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Recruitment
          </NavLink>

          <NavLink
            to="/HRProfile/employment"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Employment
          </NavLink>

          <NavLink
            to="/HRProfile/performance"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Performance
          </NavLink>

          <NavLink
            to="/HRProfile/documents"
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

      {/* PROFILE CONTENT */}
      <main className="p-6">

        <Routes>

          {/* Default route */}


          {/* Overview */}
          <Route
            path="overview"
            element={
              <Overview
                hrData={hrData}
                employees={employees}
                attendance={employeeData?.attendance || []}
              />
            }
          />

          {/* Personal */}
          <Route
            path="personal"
            element={
              <Personal
                hrData={hrData}
              />
            }
          />

          {/* Recruitment */}
          <Route
            path="recruitment"
            element={
              <Recruitment />
            }
          />

          {/* Employment */}
          <Route
            path="employment"
            element={
              <Employment
                hrData={hrData}
              />
            }
          />

          {/* Performance */}
          <Route
            path="performance"
            element={
              <Performance
                hrData={hrData}
              />
            }
          />

          {/* Documents */}
          <Route
            path="documents"
            element={
              <Documents
                hrData={hrData}
              />
            }
          />

        </Routes>

      </main>

    </div>
  );
};

export default HRProfile;
