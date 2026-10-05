import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  fetchLeaveManagementData,
  updateLeaveStatus as saveLeaveStatus,
} from "../../services/dataService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

const statusClassNames = {
  Approved:
    "badge bg-[color:var(--color-success-light)] text-[color:var(--leave-approved)]",
  Pending:
    "badge bg-[color:var(--color-warning-light)] text-[color:var(--leave-pending)]",
  Rejected:
    "badge bg-[color:var(--color-error-light)] text-[color:var(--leave-rejected)]",
};
const rejectionBoxStyle = {
  width: "100%",
  padding: "var(--space-3)",
  border: "var(--input-border-width) solid var(--input-border)",
  borderRadius: "var(--input-radius)",
  background: "var(--input-background)",
  color: "var(--color-text-primary)",
};
export function LeaveCard({
  leave,
  employee,
  canReview = false,
  onApprove,
  onReject,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  let employeeName = "Unknown employee";
  if (employee) {
    employeeName = `${employee.firstName} ${employee.lastName}`.trim();
  }
  function rejectLeave() {
    if (!rejectionReason.trim()) {
      window.alert("Please enter a rejection reason");
      return;
    }
    onReject(leave.id, rejectionReason.trim());
    setRejectionReason("");
    setShowRejectForm(false);
  }
  let statusClassName = statusClassNames[leave.status];
  if (!statusClassName) {
    statusClassName = statusClassNames.Pending;
  }
  return (
    <Card title={employeeName} bodyClassName="space-y-2">
      <p>
        <strong>Employee ID:</strong> {employee?.id || leave.employeeId}
      </p>
      <p>
        <strong>Department:</strong> {employee?.department || "Not available"}
      </p>
      <p>
        <strong>Designation:</strong> {employee?.designation || "Not available"}
      </p>
      <p>
        <strong>Email:</strong> {employee?.email || "Not available"}
      </p>
      <p>
        <strong>Leave type:</strong> {leave.type}
      </p>
      <p>
        <strong>Dates:</strong> {leave.startDate} to {leave.endDate}
      </p>
      <p>
        <strong>Days:</strong> {leave.days}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={statusClassName}>{leave.status}</span>
      </p>
      {showDetails && (
        <div className="space-y-2">
          <p>
            <strong>Reason:</strong> {leave.reason || "No reason provided"}
          </p>
          {leave.rejectionReason && (
            <p>
              <strong>Rejection reason:</strong> {leave.rejectionReason}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "View Details"}
        </Button>
        {canReview && leave.status === "Pending" && (
          <>
            <Button size="sm" onClick={() => onApprove(leave.id)}>
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowRejectForm(true)}
            >
              Reject
            </Button>
          </>
        )}
      </div>
      {showRejectForm && (
        <div className="space-y-2">
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Write rejection reason"
            style={rejectionBoxStyle}
          />
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={rejectLeave}>
              Confirm Reject
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowRejectForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
export default function LeaveRequests() {
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
  const [filter, setFilter] = useState("All");
  const employees = leaveData.employees;
  const leaves = leaveData.leaves;
  const role = String(user?.role || "").toLowerCase();
  const isHr = role === "hr";
  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const canViewRequests = isHr || isAdmin || isManager;
  const currentEmployee = employees.find((employee) => {
    if (user?.employeeId && employee.id === user.employeeId) {
      return true;
    }
    return employee.email?.toLowerCase() === user?.email?.toLowerCase();
  });
  let visibleLeaves = leaves;
  if (!isHr && !isAdmin && !isManager) {
    visibleLeaves = leaves.filter(
      (leave) => leave.employeeId === currentEmployee?.id,
    );
  }
  function canReviewLeave(leave, employee) {
    if (!leave) {
      return false;
    }
    const isMyRequest =
      leave.employeeId === currentEmployee?.id ||
      leave.applicantUserId === user?.id;
    if (isMyRequest) {
      return false;
    }
    let applicantRole = leave.applicantRole;
    if (!applicantRole) {
      if (employee?.department === "HR") {
        applicantRole = "hr";
      } else {
        applicantRole = "employee";
      }
    }
    if (isHr) {
      return (
        applicantRole === "employee" ||
        applicantRole === "manager" ||
        applicantRole === "admin"
      );
    }
    if (isAdmin) {
      return true;
    }
    if (isManager) {
      return applicantRole === "admin";
    }
    return false;
  }
  async function updateLeaveStatus(leaveId, status, rejectionReason = "") {
    const targetLeave = leaves.find((leave) => leave.id === leaveId);
    const employee = employees.find(
      (item) => item.id === targetLeave?.employeeId,
    );
    if (
      !targetLeave ||
      targetLeave.status !== "Pending" ||
      !canReviewLeave(targetLeave, employee)
    ) {
      return;
    }
    const updatedLeave = await saveLeaveStatus(
      leaveId,
      status,
      rejectionReason,
    );
    if (!updatedLeave) {
      return;
    }
    setLeaveData((currentData) => ({
      ...currentData,
      leaves: currentData.leaves.map((leave) =>
        leave.id === updatedLeave.id ? updatedLeave : leave,
      ),
    }));
  }
  if (!canViewRequests) {
    return (
      <EmptyState title="You don't have access to the leave request queue." />
    );
  }
  if (isLoading) {
    return <EmptyState title="Loading the Leave Requests..." />;
  }
  let requests = visibleLeaves;
  if (filter === "Pending") {
    requests = visibleLeaves.filter((leave) => leave.status === "Pending");
  }
  const pendingCount = visibleLeaves.filter(
    (leave) => leave.status === "Pending",
  ).length;
  return (
    <div className="min-h-screen">
      <main className="p-[30px_20px]">
        <div className="mx-auto w-full max-w-[1240px]">
          <p className="my-2">Pending requests: {pendingCount}</p>
          <div className="my-5 flex gap-2">
            <Button
              size="sm"
              variant={filter === "All" ? "primary" : "secondary"}
              onClick={() => setFilter("All")}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filter === "Pending" ? "primary" : "secondary"}
              onClick={() => setFilter("Pending")}
            >
              Pending
            </Button>
          </div>
          {requests.length === 0 ? (
            <EmptyState title="No leave requests found" />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {requests.map((leave) => {
                const employee = employees.find(
                  (person) => person.id === leave.employeeId,
                );
                return (
                  <LeaveCard
                    key={leave.id}
                    leave={leave}
                    employee={employee}
                    canReview={canReviewLeave(leave, employee)}
                    onApprove={(id) => updateLeaveStatus(id, "Approved")}
                    onReject={(id, reason) =>
                      updateLeaveStatus(id, "Rejected", reason)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
