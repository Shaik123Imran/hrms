import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchEmployeeById } from "../../services/dataService";
import EmployeeForm from "./EmployeeForm";

function EditEmployee() {
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const employeeData = await fetchEmployeeById(employeeId);

        setEmployee(employeeData);
      } catch (error) {
        console.error("Failed to load employee:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [employeeId]);

  if (loading) {
    return <p>Loading employee...</p>;
  }

  if (!employee) {
    return <p>Employee not found.</p>;
  }

  return (
    <EmployeeForm
      mode="edit"
      employee={employee}
    />
  );
}

export default EditEmployee;