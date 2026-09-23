import { BrowserRouter, Routes, Route } from "react-router-dom";
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
