import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddEmployee from "./pages/EmployeeForm/AddEmployee";
import EditEmployee from "./pages/EmployeeForm/EditEmployee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/add-employee"
          element={<AddEmployee />}
        />

        <Route
          path="/edit-employee/:employeeId"
          element={<EditEmployee />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;