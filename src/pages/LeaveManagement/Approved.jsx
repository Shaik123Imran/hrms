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
  const approvedLeaves = leaves.filter((leave) => leave.status === "Approved");
  return (
    <section className="space-result-4">
      <div>
        <h2 className="section-title">Approved Leave Requests</h2>
        <p className="mt-1 text-sm text-muted">Approved employee leave</p>
      </div>
      {!approvedLeaves.length && (
        <p className="empty surface-card rounded-[var(--card-radius)]">
          There are no approved requests.
        </p>
      )}
      {approvedLeaves.map((leave) => {
        const employee = employees.find(
          (person) => person.id === leave.employeeId,
        );
        const department = getDepartment(employee);
        const employeeName = getEmployeeName(employee);
        return (
          <article key={leave.id} className="surface-card space-result-2 p-5">
            <h3 className="text-base font-semibold">{employeeName}</h3>
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
              <span className="badge badge-success">Approved</span>
            </p>
          </article>
        );
      })}
    </section>
  );
}
