import { useState } from "react";
import { NavLink, Routes, Route, Navigate,} from "react-router-dom";
import employeeData from "../../data/HRData.js";
import EmployeeOverview from "../../components/employee/profile/EmployeeOverview.jsx";
import Personal from "../../components/employee/profile/Personal.jsx";
import Employment from "../../components/employee/profile/JobDetails.jsx";
import Performance from "../../components/employee/profile/Performance.jsx";
import Documents from "../../components/employee/profile/Documents.jsx";

const EmployeeProfile = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Get all employees
  const employees = employeeData?.employees || [];

  // Current employee
  const hrData = employees.find(
    (employee) => employee.id === "e1"
  );

  // If employee is not found
  if (!hrData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">
          Employee data not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900"> {hrData.firstName} {hrData.lastName} </h1>
            <p className="mt-1 text-sm text-gray-500"> {hrData.designation} • {hrData.department} </p>
          </div>
          {/* CHECK IN / CHECK OUT */}
          <button type="button" onClick={() => setIsCheckedIn((previous) => !previous)
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

      <div className="border-b bg-white px-6">
        <nav className="flex gap-6">
          <NavLink
            to="/emp-profile/overview"
            className={({ isActive }) =>`border-b-2 py-4 text-sm font-medium transition ${ isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900" } } >
            Overview
          </NavLink>

          <NavLink
            to="/emp-profile/personal"
            className={({ isActive }) =>`border-b-2 py-4 text-sm font-medium transition ${ isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900" }` } >
            Personal
          </NavLink>

          <NavLink
            to="/emp-profile/employment"
            className={({ isActive }) => `border-b-2 py-4 text-sm font-medium transition ${ isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}` } >
            Employment
          </NavLink>

          <NavLink
            to="/emp-profile/performance"
            className={({ isActive }) => `border-b-2 py-4 text-sm font-medium transition ${ isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900" }` } >
            Performance
          </NavLink>

          <NavLink
            to="/emp-profile/documents"
            className={({ isActive }) => `border-b-2 py-4 text-sm font-medium transition ${ isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900" }` } >
            Documents
          </NavLink>
        </nav>
      </div>


      {/* PAGE CONTENT */}

      <main className="p-6">

        <Routes>
          <Route index element={ <Navigate to="overview" replace /> } />

          <Route path="overview" element={ <EmployeeOverview hrData={hrData} attendance={employeeData?.attendance || []} /> } />

          <Route path="personal" element={ <Personal hrData={hrData} /> } />

          <Route path="employment" element={ <Employment hrData={hrData} /> } />

          <Route path="performance" element={ <Performance hrData={hrData} />  } />

          <Route path="documents" element={ <Documents hrData={hrData} /> } />
        </Routes>

      </main>

    </div>
  );
};

export default EmployeeProfile;
