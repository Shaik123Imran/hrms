import { NavLink, Routes, Route, Navigate } from "react-router-dom";

import employeeData from "../../data/data.json";

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

      <div className="border-b bg-white px-6">

        <nav className="flex flex-nowrap items-center gap-6 overflow-x-auto">

          <NavLink
            to="/HRProfile/personal"
            className={({ isActive }) =>
              isActive
                ? "nav-link active whitespace-nowrap"
                : "nav-link whitespace-nowrap"
            }
          >
            Personal
          </NavLink>

          <NavLink
            to="/HRProfile/recruitment"
            className={({ isActive }) =>
              isActive
                ? "nav-link active whitespace-nowrap"
                : "nav-link whitespace-nowrap"
            }
          >
            Recruitment
          </NavLink>

          <NavLink
            to="/HRProfile/employment"
            className={({ isActive }) =>
              isActive
                ? "nav-link active whitespace-nowrap"
                : "nav-link whitespace-nowrap"
            }
          >
            Employment
          </NavLink>

          <NavLink
            to="/HRProfile/performance"
            className={({ isActive }) =>
              isActive
                ? "nav-link active whitespace-nowrap"
                : "nav-link whitespace-nowrap"
            }
          >
            Performance
          </NavLink>

          <NavLink
            to="/HRProfile/documents"
            className={({ isActive }) =>
              isActive
                ? "nav-link active whitespace-nowrap"
                : "nav-link whitespace-nowrap"
            }
          >
            Documents
          </NavLink>

        </nav>

      </div>

      <main className="p-6">

        <Routes>

          {/* Default Route */}
          <Route index element={ <Navigate to="personal" replace /> } />
          
          <Route path="personal" element={ <Personal hrData={hrData} /> } />

          <Route path="recruitment" element={ <Recruitment /> } />
          
          <Route path="employment" element={<Employment hrData={hrData} /> } />

          <Route path="performance" element={ <Performance hrData={hrData} /> } />

          <Route path="documents" element={ <Documents hrData={hrData} /> } />

        </Routes>

      </main>

    </div>
  );
};

export default HRProfile;
