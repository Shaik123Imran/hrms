function getEmployeeName(employee) {
  return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown employee";
}
function getDepartment(employee) {
  if (employee) {
    return employee.department;
  }
  return "Not available";
}
export default function Reject({ leaves, employees }) {
  const rejectedLeaves = leaves.filter(leave => leave.status == "Rejected");
  return (
    <section>
      <h2>Rejected Leave Requests</h2>
      <p>Leave for the following employees has been rejected</p>
      {!rejectedLeaves.length && <p className="empty">There are no rejected requests.</p>}
      {rejectedLeaves.map(leave => {
        let employee = employees.find(person => person.id === leave.employeeId);
        const name = getEmployeeName(employee);
        const department = getDepartment(employee);
        let reason = leave.rejectionReason || "No reason provided";
        return (
          <article key={leave.id} className="leave-card">
            <h3>{name}</h3>
            <p><strong>Department:</strong> {department}</p>
            <p><strong>Leave Type:</strong> {leave.type}</p>
            <p><strong>Dates:</strong> {leave.startDate} to {leave.endDate}</p>
            <p><strong>Days:</strong> {leave.days}</p>
            <p><strong>Status:</strong> <span className="status rejected">Rejected</span></p>
            <p><strong>Reason:</strong> {reason}</p>
          </article>
        );
      })}
    </section>
  );
}
