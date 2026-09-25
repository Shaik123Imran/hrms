function getEmployeeName(employee) {
  if (!employee) {
    return "Unknown employee";
  }
  return `${employee.firstName} ${employee.lastName}`;
}
function getDepartment(employee) {
  if (employee) {
    return employee.department;
  }
  return "Not available";
}
export default function Reject({ leaves, employees }) {
  const rejectedLeaves = leaves.filter((leave) => leave.status === "Rejected");
  return (
    <section className="space-y-4">
      <div>
        <h2 className="section-title">Rejected Leave Requests</h2>
        <p className="mt-1 text-sm text-muted">
          Leave for the following employees has been rejected
        </p>
      </div>
      {!rejectedLeaves.length && (
        <p className="empty surface-card rounded-[var(--card-radius)]">
          There are no rejected requests.
        </p>
      )}
      {rejectedLeaves.map((leave) => {
        const employee = employees.find(
          (person) => person.id === leave.employeeId,
        );
        const name = getEmployeeName(employee);
        const department = getDepartment(employee);
        const reason = leave.rejectionReason || "No reason provided";
        return (
          <article key={leave.id} className="surface-card space-y-2 p-5">
            <h3 className="text-base font-semibold">{name}</h3>
            <p className="text-sm text-secondary">
              <strong>Department:</strong> {department}
            </p>
            <p className="text-sm text-secondary">
              <strong>Leave Type:</strong> {leave.type}
            </p>
            <p className="text-sm text-secondary">
              <strong>Dates:</strong> {leave.startDate} to {leave.endDate}
            </p>
            <p className="text-sm text-secondary">
              <strong>Days:</strong> {leave.days}
            </p>
            <p className="text-sm text-secondary">
              <strong>Status:</strong>{" "}
              <span className="badge badge-error">Rejected</span>
            </p>
            <p className="text-sm text-secondary">
              <strong>Reason:</strong> {reason}
            </p>
          </article>
        );
      })}
    </section>
  );
}
