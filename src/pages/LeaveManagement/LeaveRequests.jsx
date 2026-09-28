import { useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "../../data/data.json";
import ApplyLeave from "./ApplyLeave.jsx";
import Approved from "./Approved.jsx";
import Reject from "./Reject.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
const storageKey = "hrms_leave_data";
const statusApproved =
  "badge bg-[color:var(--color-success-light)] text-[color:var(--leave-approved)]";
const statusPending =
  "badge bg-[color:var(--color-warning-light)] text-[color:var(--leave-pending)]";
const statusRejected =
  "badge bg-[color:var(--color-error-light)] text-[color:var(--leave-rejected)]";
function readLeaveData() {
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }
  const startingData = {
    employees: data.employees,
    leaves: data.leaves,
  };
  localStorage.setItem(storageKey, JSON.stringify(startingData));
  return startingData;
}
function Status({ status }) {
  const variants = {
    Approved: statusApproved,
    Pending: statusPending,
    Rejected: statusRejected,
  };
  const className = variants[status] || statusPending;
  return <span className={className}>{status}</span>;
}
function LeaveCard({ leave, employee, onApprove, onReject, canManage = true }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [reason, setReason] = useState("");
  let employeeName = "Unknown employee";
  let department = "Not available";
  if (employee) {
    employeeName = `${employee.firstName} ${employee.lastName}`;
    department = employee.department;
  }
  function confirmReject() {
    if (reason.trim() === "") {
      window.alert("Please enter a rejection reason");
      return;
    }
    onReject(leave.id, reason);
    setReason("");
    setShowRejectBox(false);
  }
  return (
    <Card title={employeeName} className="mb-4" bodyClassName="space-result-2">
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
        <strong>Status:</strong> <Status status={leave.status} />
      </p>
      {showDetails && (
        <div className="space-result-3">
          <p>
            <strong>Reason:</strong> {leave.reason}
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
        {canManage && leave.status === "Pending" && (
          <>
            <Button size="sm" onClick={() => onApprove(leave.id)}>
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowRejectBox(true)}
            >
              Reject
            </Button>
          </>
        )}
      </div>
      {showRejectBox && (
        <div className="flex w-full flex-wrap gap-2">
          <textarea
            className="field-input w-full smallest-w-[240px]"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Write rejection reason"
            rows="3"
          />
          <Button variant="danger" size="sm" onClick={confirmReject}>
            Confirm Reject
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowRejectBox(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </Card>
  );
}
export default function LeaveRequests({ page = "requests", showMenu = true }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const startingData = readLeaveData();
  const [employees] = useState(startingData.employees);
  const [leaves, setLeaves] = useState(startingData.leaves);
  const role = String(user?.role || "").toLowerCase();
  const isEmployee = role === "employee";
  const canManage = ["admin", "hr", "hr manager", "manager"].includes(role);
  const currentEmployee = employees.find((employee) => {
    if (user?.employeeId && employee.id === user.employeeId) {
      return true;
    }
    return employee.email?.toLowerCase() === user?.email?.toLowerCase();
  });
  const [internalPage, setCurrentPage] = useState(isEmployee ? "apply" : page);
  let currentPage = internalPage;
  if (!showMenu) {
    currentPage = isEmployee && page === "requests" ? "apply" : page;
  }
  const [filter, setFilter] = useState("All");
  let visibleLeaves = [];
  if (canManage) {
    visibleLeaves = leaves;
  } else if (currentEmployee) {
    visibleLeaves = leaves.filter(
      (leave) => leave.employeeId === currentEmployee.id,
    );
  }
  function saveLeaves(newLeaves) {
    setLeaves(newLeaves);
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        employees,
        leaves: newLeaves,
      }),
    );
  }
  function changeLeaveStatus(id, status, reason = "") {
    if (!canManage) {
      return;
    }
    const changedLeaves = leaves.map((leave) =>
      leave.id === id ? { ...leave, status, rejectionReason: reason } : leave,
    );
    saveLeaves(changedLeaves);
  }
  function addLeave(newLeave) {
    if (isEmployee && !currentEmployee) {
      return;
    }
    const leaveToSave = {
      ...newLeave,
      employeeId: currentEmployee?.id || newLeave.employeeId,
      id: `lv${leaves.length + 1}`,
      status: "Pending",
      rejectionReason: "",
    };
    saveLeaves([...leaves, leaveToSave]);
    if (!isEmployee) {
      if (showMenu) {
        setCurrentPage("requests");
      } else {
        navigate("/leave/requests");
      }
    }
  }
  let leavesToShow = visibleLeaves;
  if (filter === "Pending") {
    leavesToShow = visibleLeaves.filter((leave) => leave.status === "Pending");
  }
  function showPage() {
    switch (currentPage) {
      case "apply":
        return (
          <>
            {isEmployee && !currentEmployee ? (
              <EmptyState
                title="Employee account not linked"
                description="Ask the login or data team to connect this account to an employee ID."
              />
            ) : (
              <ApplyLeave
                employees={employees}
                onApply={addLeave}
                onCancel={() => {
                  if (showMenu) {
                    setCurrentPage(isEmployee ? "apply" : "requests");
                  } else {
                    navigate(isEmployee ? "/leave/apply" : "/leave/requests");
                  }
                }}
                isEmployee={isEmployee}
                currentEmployee={currentEmployee}
              />
            )}
            {isEmployee && currentEmployee && (
              <section className="mt-6">
                <h2 className="section-title mb-4">My Leave Requests</h2>
                {visibleLeaves.length === 0 && (
                  <EmptyState title="No leave requests yet" />
                )}
                {visibleLeaves.map((leave) => (
                  <LeaveCard
                    key={leave.id}
                    leave={leave}
                    employee={currentEmployee}
                    canManage={false}
                  />
                ))}
              </section>
            )}
          </>
        );
      case "approved":
        return <Approved leaves={visibleLeaves} employees={employees} />;
      case "rejected":
        return <Reject leaves={visibleLeaves} employees={employees} />;
      default:
        return (
          <>
            <h2 className="mb-[6px] text-[13px] font-normal">Leave Requests</h2>
            <p className="my-2">For managing employee leave requests</p>
            <p className="my-2">
              Pending requests:{" "}
              {
                visibleLeaves.filter((leave) => leave.status === "Pending")
                  .length
              }
            </p>
            <div className="flex gap-2 my-5">
              <button
                variant={filter === "All" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setFilter("All")}
              >
                All
              </button>
              <button
                variant={filter === "Pending" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setFilter("Pending")}
              >
                Pending
              </button>
            </div>
            {leavesToShow.length === 0 && (
              <EmptyState title="No leave requests found" />
            )}
            {leavesToShow.map((leave) => {
              const employee = employees.find(
                (person) => person.id === leave.employeeId,
              );
              return (
                <LeaveCard
                  key={leave.id}
                  leave={leave}
                  employee={employee}
                  onApprove={(id) => changeLeaveStatus(id, "Approved")}
                  onReject={(id, reason) =>
                    changeLeaveStatus(id, "Rejected", reason)
                  }
                />
              );
            })}
          </>
        );
    }
  }
  return (
    <div
      className={
        showMenu
          ? "flex smallest-h-screen flex-col md:flex-row"
          : "smallest-h-screen"
      }
    >
      {showMenu && (
        <aside className="w-full border-[color:var(--color-border)] bg-[color:var(--color-secondary-light)] p-[25px_18px] md:w-[200px] md:smallest-w-[200px] md:border-r">
          <h1 className="mb-6 text-sm font-normal">Leave Management</h1>
          {canManage && (
            <Button
              variant="ghost"
              className="mb-2 w-full justify-start text-left"
              onClick={() => setCurrentPage("requests")}
            >
              Leave Requests
            </Button>
          )}
          <Button
            variant="ghost"
            className="mb-2 w-full justify-start text-left"
            onClick={() => setCurrentPage("apply")}
          >
            Apply Leave
          </Button>
          <Button
            variant="ghost"
            className="mb-2 w-full justify-start text-left"
            onClick={() => setCurrentPage("approved")}
          >
            Approved
          </Button>
          <Button
            variant="ghost"
            className="mb-2 w-full justify-start text-left"
            onClick={() => setCurrentPage("rejected")}
          >
            Rejected
          </Button>
        </aside>
      )}
      <main
        className={
          showMenu ? "smallest-w-0 flex-1 p-[30px_20px]" : "p-[30px_20px]"
        }
      >
        <div className="mx-auto w-full maximum-w-[680px]">{showPage()}</div>
      </main>
    </div>
  );
}
