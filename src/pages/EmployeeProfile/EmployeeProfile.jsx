import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
      <main>

        <Routes>

          <Route
            index
            element={<Navigate to="overview" replace />}
          />

          <Route
            path="overview"
            element={
              <EmployeeOverview
                hrData={hrData}
                attendance={employeeData?.attendance || []}
              />
            }
          />

          <Route
            path="personal"
            element={
              <Personal hrData={hrData} />
            }
          />

          <Route
            path="employment"
            element={
              <Employment hrData={hrData} />
            }
          />

          <Route
            path="performance"
            element={
              <Performance hrData={hrData} />
            }
          />

          <Route
            path="documents"
            element={
              <Documents hrData={hrData} />
            }
          />

        </Routes>

      </main>

    </div>
  );
};

export default EmployeeProfile;