const getEmployeeName = (employee) => {
  if (!employee) {
    return "Unknown employee";
  }
  return `${employee.firstName} ${employee.lastName}`;
};
const getDepartment = (employee) => {
  if (!employee) {
    return "Not available";
  }
  return employee.department;
};
export default function Approved({ leaves, employees }) {
  const approvedLeaves = leaves.filter((leave) => leave.status == "Approved");
  return (
    <section>
      <h2>Approved Leave Requests</h2>
      <p>Approved employee leave</p>
      {!approvedLeaves.length && (
        <p className="empty">There are no approved requests.</p>
      )}
      {approvedLeaves.map((leave) => {
        let employee = employees.find(
          (person) => person.id === leave.employeeId,
        );
        let department = getDepartment(employee);
        let employeeName = getEmployeeName(employee);
        return (
          <article key={leave.id} className="leave-card">
            <h3>{employeeName}</h3>
            <p>
              <strong>Department:</strong> {department}
            </p>
            <p>
              <strong>Leave Type:</strong> {leave.type}
            </p>
            <p>
              <strong>Dates:</strong> {leave.startDate} to {leave.endDate}
            </p>
            <p>
              <strong>Days:</strong> {leave.days}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="status approved">Approved</span>
            </p>
          </article>
        );
      })}
    </section>
  );
}
