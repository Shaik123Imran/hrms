import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import Login from './pages/Authentication/login.jsx';
import Logout from './pages/Authentication/logout.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import EmployeeList from './pages/EmployeeList/EmployeeList.jsx';
import EmployeeForm from './pages/EmployeeForm/EmployeeForm.jsx';
import EmployeeProfile from './pages/EmployeeProfile/EmployeeProfile.jsx';
import Attendance from './pages/Attendance/Attendance.jsx';
import LeaveManagement from './pages/LeaveManagement/LeaveManagement.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/add-employee" element={<EmployeeForm />} />
              <Route path="/employees/:id" element={<EmployeeProfile />} />
              <Route path="/employees/:id/edit" element={<EmployeeForm />} />
              <Route path="/edit-employee/:employeeId" element={<EmployeeForm />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leaves" element={<LeaveManagement />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;