import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
function getEmployeeName(employee) {
  if (!employee) {
    return "Unknown employee";
  }
  return `${employee.firstName} ${employee.lastName}`;
}
export default function Approved({ leaves, employees }) {
  const approvedLeaves = leaves.filter((leave) => leave.status === "Approved");
  return (
    <section className="space-buffer-4">
      <div>
        <h2 className="section-title">Approved Leave Requests</h2>
        <p className="mt-1 text-sm text-muted">Approved employee leave</p>
      </div>
      {approvedLeaves.length === 0 && (
        <EmptyState title="There are no approved requests." />
      )}
      {approvedLeaves.map((leave) => {
        const employee = employees.find(
          (person) => person.id === leave.employeeId,
        );
        return (
          <Card
            key={leave.id}
            title={getEmployeeName(employee)}
            className="mb-4"
            bodyClassName="space-buffer-2"
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
              <span className="badge badge-success">Approved</span>
            </p>
          </Card>
        );
      })}
    </section>
  );
}
