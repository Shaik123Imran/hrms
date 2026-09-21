import { useState } from "react";
import { NavLink, Routes, Route, Navigate, } from "react-router-dom";
import employeeData from "../../data/HRData.js";
import Overview from "../../components/employee/profile/Overview.jsx";
import Personal from "../../components/employee/profile/Personal.jsx";
import Employment from "../../components/employee/profile/JobDetails.jsx";
import Performance from "../../components/employee/profile/Performance.jsx";
import Documents from "../../components/employee/profile/Documents.jsx";
import Recruitment from "../../components/employee/profile/Recruitment.jsx";

const HRProfile = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Get all employees from HRData.js
  const employees = employeeData?.employees || [];

  // Current HR
  const hrData = employees.find(
    (employee) => employee.id === "e7"
  );

  // If HR is not found
  if (!hrData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">
          HR data not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HR PROFILE HEADER */}
      <div className="border-b bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {hrData.firstName} {hrData.lastName}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {hrData.designation} • {hrData.department}
            </p>
          </div>

          {/* Check In / Check Out */}
          <button
            type="button"
            onClick={() =>
              setIsCheckedIn((previous) => !previous)
            }
            className={`rounded-lg px-5 py-2 font-medium text-white transition ${
              isCheckedIn
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isCheckedIn ? "Check Out" : "Check In"}
          </button>

        </div>
      </div>

      {/* NAVIGATION */}
      <div className="border-b bg-white px-6">
        <nav className="flex gap-6">

          <NavLink
            to="/hr-profile/overview"
            className={({ isActive }) =>
              `border-b-2 py-4 text-sm font-medium transition ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/hr-profile/personal"
            className={({ isActive }) =>
              `border-b-2 py-4 text-sm font-medium transition ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Personal
          </NavLink>

          <NavLink
            to="/hr-profile/recruitment"
            className={({ isActive }) =>
              `border-b-2 py-4 text-sm font-medium transition ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`
            }
          >
           Recruitment
          </NavLink>

          <NavLink
            to="/hr-profile/employment"
            className={({ isActive }) =>
              `border-b-2 py-4 text-sm font-medium transition ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Employment
          </NavLink>

          <NavLink
            to="/hr-profile/performance"
            className={({ isActive }) =>
              `border-b-2 py-4 text-sm font-medium transition ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Performance
          </NavLink>

          <NavLink
            to="/hr-profile/documents"
            className={({ isActive }) =>
              `border-b-2 py-4 text-sm font-medium transition ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`
            }
          >
            Documents
          </NavLink>

        </nav>
      </div>
      <main className="p-6">

        <Routes>

        <Route index element={<Navigate to="overview" replace />} />

        <Route path="overview" element={ <Overview hrData={hrData} employees={employees} attendance={employeeData?.attendance || []} /> } />

        <Route path="personal" element={ <Personal hrData={hrData} /> } />

        <Route path="employment" element={ <Employment hrData={hrData} />}  />

        <Route path="performance" element={ <Performance hrData={hrData} /> } />

        <Route path="documents" element={ <Documents hrData={hrData} /> } />
        
        <Route path="recruitment" element={<Recruitment />} />

      </Routes>

      </main>

    </div>
  );
};

export default HRProfile;