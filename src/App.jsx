import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { AuthProvider } from "./context/AuthContext.jsx";

import Login from "./pages/Authentication/login";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import LeaveRequests from "./pages/LeaveManagement/LeaveRequests.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/leave-requests" element={<LeaveRequests />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
=======
import AddEmployee from "./pages/EmployeeForm/AddEmployee";
import EditEmployee from "./pages/EmployeeForm/EditEmployee";
import EmployeeList from "./pages/EmployeeList/EmployeeList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/employees/new"
          element={<AddEmployee />}
        />

        <Route
          path="/employees/:employeeId/edit"
          element={<EditEmployee />}
        />
        <Route path="/employee-list" element={<EmployeeList />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> origin/feature/validation
