import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddEmployee from "../pages/EmployeeForm/AddEmployee";
import EditEmployee from "../pages/EmployeeForm/EditEmployee";
import EmployeeForm from "../pages/EmployeeForm/EmployeeForm";
import EmployeeList from "../pages/EmployeeList/EmployeeList";
import EmployeeProfile from "../pages/EmployeeProfile/EmployeeProfile";
import Attendance from "../pages/Attendance/Attendance";
import ApplyLeave from "../pages/LeaveManagement/ApplyLeave";
import Approved from "../pages/LeaveManagement/Approved";
import LeaveRequests from "../pages/LeaveManagement/LeaveRequests";
import Reject from "../pages/LeaveManagement/Reject";


function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/employee/add"
        element={<AddEmployee />}
      />

      <Route
        path="/employee/edit"
        element={<EditEmployee />}
      />

      <Route
        path="/EmployeeForm"
        element={<EmployeeForm />}
      />

      <Route
        path="/EmployeeList"
        element={<EmployeeList />}
      />

      <Route
        path="/EmployeeProfile"
        element={<EmployeeProfile />}
      />

      <Route
        path="/attendance"
        element={<Attendance />}
      />

      <Route
        path="/leave"
        element={<Navigate to="/leave/requests" replace />}
      />

      <Route
        path="/leave/requests"
        element={<LeaveRequests />}
      />

      <Route
        path="/leave/apply"
        element={<ApplyLeave />}
      />

      <Route
        path="/leave/approved"
        element={<Approved />}
      />

      <Route
        path="/leave/rejected"
        element={<Reject />}
      />
      
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;