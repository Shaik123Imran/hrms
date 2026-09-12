import { useParams } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import data from "../../data/data.json";

function EditEmployee() {
  const { employeeId } = useParams();

  const employee = data.employees.find(
    (employee) => employee.id === employeeId
  );

  if (!employee) {
    return <h2>Employee not found</h2>;
  }

  return (
    <EmployeeForm
      mode="edit"
      employee={employee}
    />
  );
}

export default EditEmployee;