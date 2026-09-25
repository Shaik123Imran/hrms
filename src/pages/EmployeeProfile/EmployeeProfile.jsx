
import { useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import "../../style/tokens.css";
import "../../style/global.css";
import employeeData from "../../data/data.json";
import EmployeeOverview from "../../components/employee/profile/EmployeeOverview.jsx";
import Personal from "../../components/employee/profile/Personal.jsx";
import Employment from "../../components/employee/profile/JobDetails.jsx";
import Performance from "../../components/employee/profile/Performance.jsx";
import Documents from "../../components/employee/profile/Documents.jsx";

const EmployeeProfile = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Get all employees from data.json
  const employees = employeeData?.employees || [];

  // Current employee
  const hrData = employees.find(
    (employee) => employee.id === "e1"
  );

  // If employee is not found
  if (!hrData) {
    return (
      <div className="page-container">
        <p className="text-error">Employee data not found.</p>
      </div>
    );
  }

  return (
    <div className="page-container">


      <div className="page-header">

        {/* EMPLOYEE DETAILS */}
        <div>
          <h1 className="page-title">
            {hrData.firstName} {hrData.lastName}
          </h1>

          <p className="text-muted">
            {hrData.designation} • {hrData.department}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">

          {/* CHECK IN / CHECK OUT */}
          <button
            type="button"
            onClick={() => setIsCheckedIn((previous) => !previous)}
            className={
              isCheckedIn
                ? "btn btn-danger"
                : "btn btn-success"
            }
          >
            {isCheckedIn ? "Check Out" : "Check In"}
          </button>

          <button type="button" className="btn btn-logout">
            Logout
          </button>

        </div>

      </div>


      <div className="surface-card">

        <nav className="flex gap-6">

          <NavLink to="/emp/overview" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Overview</NavLink>

          <NavLink to="/emp/personal" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Personal</NavLink>

          <NavLink to="/emp/employment" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Employment</NavLink>

          <NavLink to="/emp/performance" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Performance</NavLink>

          <NavLink to="/emp/documents" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Documents</NavLink>

        </nav>

      </div>

      <main>

        <Routes>

          <Route index element={<Navigate to="overview" replace />} />

          <Route path="overview" element={<EmployeeOverview hrData={hrData} attendance={employeeData?.attendance || []} />} />

          <Route path="personal" element={<Personal hrData={hrData} />} />

          <Route path="employment" element={<Employment hrData={hrData} />} />

          <Route path="performance" element={<Performance hrData={hrData} />} />

          <Route path="documents" element={<Documents hrData={hrData} />} />

        </Routes>

      </main>

    </div>
  );
};

export default EmployeeProfile;
