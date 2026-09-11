import { useParams } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import employees from "../../data/employee";

function EditEmployee() {
  const { employeeId } = useParams();

  const employee = employees.find(
    (item) => item.employeeId === employeeId
  );

  if (!employee) {
    return <h2>No employee data found</h2>;
  }

  return (
    <EmployeeForm
      mode="edit"
      employee={employee}
    />
  );
}

export default EditEmployee;