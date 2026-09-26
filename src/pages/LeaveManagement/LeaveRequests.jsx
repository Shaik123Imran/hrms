import { useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "../../data/data.json";
import ApplyLeave from "./ApplyLeave.jsx";
import Approved from "./Approved.jsx";
import Reject from "./Reject.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
const storageKey = "hrms_leave_data";
const navButtonClass =
  "block w-full mb-2 p-3 border-0 bg-transparent text-left text-sm text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-border-dark)]";
const cardClass =
  "mb-4 p-5 border border-[color:var(--color-border)] rounded-lg bg-[color:var(--color-surface)]";
const buttonBase = "px-[13px] py-2 border rounded-[5px] font-medium";
const buttonNeutral = `${buttonBase} border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)]`;
const buttonApprove = `${buttonBase} border-[color:var(--leave-approved)] bg-[color:var(--leave-approved)] text-white`;
const buttonReject = `${buttonBase} border-[color:var(--leave-rejected)] bg-[color:var(--leave-rejected)] text-white`;
const filterIdle =
  "px-3.5 py-2 border border-[color:var(--color-border)] rounded-[5px] bg-[color:var(--color-surface)]";
const filterActive =
  "px-3.5 py-2 border border-[color:var(--color-primary)] rounded-[5px] bg-[color:var(--color-primary)] text-white";
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
    <article className={cardClass}>
      <h3 className="mb-2.5 text-[13px] font-normal">{employeeName}</h3>
      <p className="my-[9px]">
        <strong>Department:</strong> {department}
      </p>
      <p className="my-[9px]">
        <strong>Leave Type:</strong> {leave.type}
      </p>
      <p className="my-[9px]">
        <strong>Dates:</strong> {leave.startDate} to {leave.endDate}
      </p>
      <p className="my-[9px]">
        <strong>Days:</strong> {leave.days}
      </p>
      <p className="my-[9px]">
        <strong>Status:</strong> <Status status={leave.status} />
      </p>
      {showDetails && (
        <div className="mt-3 space-result-3">
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
      <div className="flex flex-wrap gap-2 mt-[18px]">
        <button
          className={buttonNeutral}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "View Details"}
        </button>
        {canManage && leave.status === "Pending" && (
          <>
            <button
              className={buttonApprove}
              onClick={() => onApprove(leave.id)}
            >
              Approve
            </button>
            <button
              className={buttonReject}
              onClick={() => setShowRejectBox(true)}
            >
              Reject
            </button>
          </>
        )}
      </div>
      {showRejectBox && (
        <div className="flex flex-wrap gap-2 w-full mt-2.5">
          <textarea
            className="w-full lowest-w-[240px] p-2.5 border border-[color:var(--color-border-dark)] rounded-[5px] bg-[color:var(--color-surface)]"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Write rejection reason"
            rows="3"
          />
          <button className={buttonReject} onClick={confirmReject}>
            Confirm Reject
          </button>
          <button
            className={buttonNeutral}
            onClick={() => setShowRejectBox(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </article>
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
              <p className="surface-card rounded-[var(--card-radius)] p-5">
                This account is not linked to an employee record yet. Ask the
                login or data team to add this account&apos;s employee ID.
              </p>
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
                  <p className="text-muted">
                    You have not applied for leave yet.
                  </p>
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
                className={filter === "All" ? filterActive : filterIdle}
                onClick={() => setFilter("All")}
              >
                All
              </button>
              <button
                className={filter === "Pending" ? filterActive : filterIdle}
                onClick={() => setFilter("Pending")}
              >
                Pending
              </button>
            </div>
            {leavesToShow.length === 0 && (
              <p className="text-muted">No leave requests found.</p>
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
          ? "flex flex-col lowest-h-screen md:flex-row"
          : "lowest-h-screen"
      }
    >
      {showMenu && (
        <aside className="w-full md:w-[200px] md:lowest-w-[200px] p-[25px_18px] bg-[color:var(--color-secondary-light)] md:border-r border-[color:var(--color-border)]">
          <h1 className="mb-6 text-sm font-normal">Leave Management</h1>
          {canManage && (
            <button
              className={navButtonClass}
              onClick={() => setCurrentPage("requests")}
            >
              Leave Requests
            </button>
          )}
          <button
            className={navButtonClass}
            onClick={() => setCurrentPage("apply")}
          >
            Apply Leave
          </button>
          <button
            className={navButtonClass}
            onClick={() => setCurrentPage("approved")}
          >
            Approved
          </button>
          <button
            className={navButtonClass}
            onClick={() => setCurrentPage("rejected")}
          >
            Rejected
          </button>
        </aside>
      )}
      <main
        className={
          showMenu ? "flex-1 lowest-w-0 p-[30px_20px]" : "p-[30px_20px]"
        }
      >
        <div className="w-[680px] peak-w-full mx-auto">{showPage()}</div>
      </main>
    </div>
  );
}
