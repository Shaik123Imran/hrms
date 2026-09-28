import { Routes, Route, Navigate } from "react-router-dom";
import employeeData from "../../data/data.json";

import Overview from "../../components/employee/profile/Overview.jsx";
import Personal from "../../components/employee/profile/Personal.jsx";
import Employment from "../../components/employee/profile/JobDetails.jsx";
import Performance from "../../components/employee/profile/Performance.jsx";
import Documents from "../../components/employee/profile/Documents.jsx";
import Recruitment from "../../components/employee/profile/Recruitment.jsx";

const HRProfile = () => {
  const employees = employeeData?.employees || [];

  const hrData = employees.find(
    (employee) => employee.id === "e7"
  );

  if (!hrData) {
    return (
      <div className="page-container">
        <p className="text-error">HR data not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

    

      {/* PROFILE CONTENT */}
      <main className="p-6">
        <Routes>

          <Route
            index
            element={<Navigate to="overview" replace />}
          />

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

          <Route
            path="personal"
            element={
              <Personal hrData={hrData} />
            }
          />

          <Route
            path="recruitment"
            element={
              <Recruitment />
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

export default HRProfile;