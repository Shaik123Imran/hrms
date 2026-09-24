import { BrowserRouter, Routes, Route } from "react-router-dom";
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