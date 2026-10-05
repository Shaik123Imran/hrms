import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { fetchLeaveManagementData } from "../../services/dataService.js";
const statusClassNames = {
  Approved:
    "badge bg-[color:var(--color-success-light)] text-[color:var(--leave-approved)]",
  Rejected:
    "badge bg-[color:var(--color-error-light)] text-[color:var(--leave-rejected)]",
};
function LeaveHistory({ leaves, employees, status }) {
  const matchingLeaves = leaves.filter((leave) => leave.status === status);
  const isApproved = status === "Approved";
  let heading = "Rejected Leave Requests";
  let detailLabel = "Rejection reason";
  let description = "Leave requests that were rejected";
  if (isApproved) {
    heading = "Approved Leave Requests";
    detailLabel = "Reason";
    description = "Approved employee leave";
  }
  return (
    <section className="space-y-4">
      <div>
        <h2 className="section-title">{heading}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      {matchingLeaves.length === 0 ? (
        <EmptyState title={`There are no ${status.toLowerCase()} requests.`} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {matchingLeaves.map((leave) => {
            const employee = employees.find(
              (person) => person.id === leave.employeeId,
            );
            let employeeName = "Unknown employee";
            if (employee) {
              employeeName =
                `${employee.firstName} ${employee.lastName}`.trim();
            }
            let detail = leave.rejectionReason || "No reason provided";
            if (isApproved) {
              detail = leave.reason || "No reason provided";
            }
            return (
              <Card
                key={leave.id}
                title={employeeName}
                bodyClassName="space-y-2"
              >
                <p>
                  <strong>Employee ID:</strong>{" "}
                  {employee?.id || leave.employeeId}
                </p>
                <p>
                  <strong>Department:</strong>{" "}
                  {employee?.department || "Not available"}
                </p>
                <p>
                  <strong>Designation:</strong>{" "}
                  {employee?.designation || "Not available"}
                </p>
                <p>
                  <strong>Email:</strong> {employee?.email || "Not available"}
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
                  <strong>{detailLabel}:</strong> {detail}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={statusClassNames[status]}>{status}</span>
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
export function LeaveHistoryPage({ status }) {
  const { user } = useAuth();
  const [leaveData, setLeaveData] = useState({ employees: [], leaves: [] });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadLeaveData() {
      const data = await fetchLeaveManagementData();
      setLeaveData(data);
      setIsLoading(false);
    }
    loadLeaveData();
  }, []);
  if (isLoading) {
    return <EmptyState title="Leave History is Loading..." />;
  }
  const role = String(user?.role || "").toLowerCase();
  const isEmployee = role === "employee";
  const canSeeAllLeaves = ["hr", "admin", "manager"].includes(role);
  const currentEmployee = leaveData.employees.find((employee) => {
    if (user?.employeeId && employee.id === user.employeeId) {
      return true;
    }
    return employee.email?.toLowerCase() === user?.email?.toLowerCase();
  });
  if (!isEmployee && !canSeeAllLeaves) {
    return <EmptyState title="You don't have access to these leave records." />;
  }
  let visibleLeaves = leaveData.leaves;
  if (!canSeeAllLeaves) {
    visibleLeaves = leaveData.leaves.filter(
      (leave) => leave.employeeId === currentEmployee?.id,
    );
  }
  return (
    <div className="min-h-screen">
      <main className="p-[30px_20px]">
        <div className="mx-auto w-full max-w-[1240px]">
          <LeaveHistory
            leaves={visibleLeaves}
            employees={leaveData.employees}
            status={status}
          />
        </div>
      </main>
    </div>
  );
}
export default function Approved() {
  return <LeaveHistoryPage status="Approved" />;
}
