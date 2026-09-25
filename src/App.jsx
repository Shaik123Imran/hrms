import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import Login from "./pages/Authentication/login";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import LeaveRequests from "./pages/LeaveManagement/LeaveRequests.jsx";
import AddEmployee from "./pages/EmployeeForm/AddEmployee";
import EditEmployee from "./pages/EmployeeForm/EditEmployee";
import EmployeeList from "./pages/EmployeeList/EmployeeList";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication & Dashboard */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leave-requests" element={<LeaveRequests />} />

          {/* Employee Management */}
          <Route path="/employees/new" element={<AddEmployee />} />
          <Route path="/employees/:employeeId/edit" element={<EditEmployee />} />
          <Route path="/employee-list" element={<EmployeeList />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;