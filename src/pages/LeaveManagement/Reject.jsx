import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
function getEmployeeName(employee) {
  if (!employee) {
    return "Unknown employee";
  }
  return `${employee.firstName} ${employee.lastName}`;
}
export default function Reject({ leaves, employees }) {
  const rejectedLeaves = leaves.filter((leave) => leave.status === "Rejected");
  return (
    <section className="space-result-4">
      <div>
        <h2 className="section-title">Rejected Leave Requests</h2>
        <p className="mt-1 text-sm text-muted">
          Leave for the following employees has been rejected
        </p>
      </div>
      {rejectedLeaves.length === 0 && (
        <EmptyState title="There are no rejected requests." />
      )}
      {rejectedLeaves.map((leave) => {
        const employee = employees.find(
          (person) => person.id === leave.employeeId,
        );
        return (
          <Card
            key={leave.id}
            title={getEmployeeName(employee)}
            className="mb-4"
            bodyClassName="space-result-2"
          >
            <p>
              <strong>Department:</strong>{" "}
              {employee?.department || "Not available"}
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
              <span className="badge badge-error">Rejected</span>
            </p>
            <p>
              <strong>Reason:</strong>{" "}
              {leave.rejectionReason || "No reason provided"}
            </p>
          </Card>
        );
      })}
    </section>
  );
}
