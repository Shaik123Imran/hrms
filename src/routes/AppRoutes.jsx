import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddEmployee from "../pages/EmployeeForm/AddEmployee";
import EditEmployee from "../pages/EmployeeForm/EditEmployee";
import EmployeeForm from "../pages/EmployeeForm/EmployeeForm";
import EmployeeList from "../pages/EmployeeList/EmployeeList";
import EmployeeProfile from "../pages/EmployeeProfile/EmployeeProfile";
import HRProfile from "../pages/EmployeeProfile/HRProfile";
import Attendance from "../pages/Attendance/Attendance";
import ApplyLeave from "../pages/LeaveManagement/ApplyLeave";
import Approved from "../pages/LeaveManagement/Approved";
import LeaveRequests from "../pages/LeaveManagement/LeaveRequests";
import Reject from "../pages/LeaveManagement/Reject";
import DashboardLayout from "../src/layouts/DashboardLayout";

function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/dashboard"
        element={
          <DashboardLayout title="Dashboard">
            <Dashboard />
          </DashboardLayout>
        }
      />

      <Route
        path="/employee/add"
        element={
          <DashboardLayout title="Add Employee">
            <AddEmployee />
          </DashboardLayout>
        }
      />

      <Route
        path="/employee/edit"
        element={
          <DashboardLayout title="Edit Employee">
            <EditEmployee />
          </DashboardLayout>
        }
      />

      <Route
        path="/EmployeeForm"
        element={
          <DashboardLayout title="Employee Form">
            <EmployeeForm />
          </DashboardLayout>
        }
      />

      <Route
        path="/EmployeeList"
        element={
          <DashboardLayout title="Employee List">
            <EmployeeList />
          </DashboardLayout>
        }
      />

      <Route
        path="/EmployeeProfile"
        element={
          <DashboardLayout title="Employee Profile">
            <EmployeeProfile />
          </DashboardLayout>
        }
      />
      <Route
        path="/HRProfile"
        element={
          <DashboardLayout title="HR Profile">
            <HRProfile />
          </DashboardLayout>
        }
      />

      <Route
        path="/attendance"
        element={
          <DashboardLayout title="Attendance">
            <Attendance />
          </DashboardLayout>
        }
      />

      <Route
        path="/leave"
        element={
          <DashboardLayout title="Leave Management">
            <Navigate to="/leave/requests" replace />
          </DashboardLayout>
        }
      />

      <Route
        path="/leave/requests"
        element={
          <DashboardLayout title="Leave Requests">
            <LeaveRequests />
          </DashboardLayout>
        }
      />

      <Route
        path="/leave/apply"
        element={
          <DashboardLayout title="Apply Leave">
            <ApplyLeave />
          </DashboardLayout>
        }
      />

      <Route
        path="/leave/approved"
        element={
          <DashboardLayout title="Approved Leaves">
            <Approved />
          </DashboardLayout>
        }
      />

      <Route
        path="/leave/rejected"
        element={
          <DashboardLayout title="Rejected Leaves">
            <Reject />
          </DashboardLayout>
        }
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