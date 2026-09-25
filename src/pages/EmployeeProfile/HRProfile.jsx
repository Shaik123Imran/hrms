
import { useState } from "react";
import { NavLink, Routes, Route, Navigate} from "react-router-dom";
import "../../style/tokens.css";
import "../../style/global.css";
import employeeData from "../../data/data.json";
import Overview from "../../components/employee/profile/Overview.jsx";
import Personal from "../../components/employee/profile/Personal.jsx";
import Employment from "../../components/employee/profile/JobDetails.jsx";
import Performance from "../../components/employee/profile/Performance.jsx";
import Documents from "../../components/employee/profile/Documents.jsx";
import Recruitment from "../../components/employee/profile/Recruitment.jsx";

const HRProfile = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

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


      <div className="border-b bg-white px-6 py-5">
        <div className="flex items-center justify-between">

          {/* HR DETAILS */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {hrData.firstName} {hrData.lastName}
            </h1>

            <p className="mt-1 text-sm text-muted">
              {hrData.designation} • {hrData.department}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">

            {/* CHECK IN / CHECK OUT */}
            <button
              type="button"
              onClick={() => setIsCheckedIn((previous) => !previous)}
              className={isCheckedIn ? "btn btn-danger" : "btn btn-success"}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </button>

            {/* LOGOUT */}
            <button type="button" className="btn btn-logout">
              Logout
            </button>

          </div>
        </div>
      </div>


      <div className="border-b bg-white px-6">
        <nav className="flex gap-6">

          <NavLink to="/hr-profile/overview" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Overview</NavLink>

          <NavLink to="/hr-profile/personal" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Personal</NavLink>

          <NavLink to="/hr-profile/recruitment" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Recruitment</NavLink>

          <NavLink to="/hr-profile/employment" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Employment</NavLink>

          <NavLink to="/hr-profile/performance" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Performance</NavLink>

          <NavLink to="/hr-profile/documents" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Documents</NavLink>

        </nav>
      </div>


      <main className="p-6">
        <Routes>

          <Route index element={<Navigate to="overview" replace />} />

          <Route path="overview" element={<Overview hrData={hrData} employees={employees} attendance={employeeData?.attendance || []} />} />

          <Route path="personal" element={<Personal hrData={hrData} />} />

          <Route path="recruitment" element={<Recruitment />} />

          <Route path="employment" element={<Employment hrData={hrData} />} />

          <Route path="performance" element={<Performance hrData={hrData} />} />

          <Route path="documents" element={<Documents hrData={hrData} />} />

        </Routes>
      </main>

    </div>
  );
};

export default HRProfile;
