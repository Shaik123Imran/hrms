import { useState } from "react";
import data from "../../data/data.json";
import ApplyLeave from "./ApplyLeave.jsx";
import Approved from "./Approved.jsx";
import Reject from "./Reject.jsx";
import "./leave.css";
const storageKey = "hrms_leave_data";
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
  const className = `status ${status.toLowerCase()}`;
  return <span className={className}>{status}</span>;
}
function LeaveCard({ leave, employee, onApprove, onReject }) {
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
    <article className="leave-card">
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
        <strong>Status:</strong> <Status status={leave.status} />
      </p>
      {showDetails && (
        <div className="details">
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
      <div className="buttons">
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "View Details"}
        </button>
        {leave.status === "Pending" && (
          <>
            <button
              className="approve-button"
              onClick={() => onApprove(leave.id)}
            >
              Approve
            </button>
            <button
              className="reject-button"
              onClick={() => setShowRejectBox(true)}
            >
              Reject
            </button>
          </>
        )}
      </div>
      {showRejectBox && (
        <div className="reject-box">
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Write rejection reason"
            rows="3"
          />
          <button className="reject-button" onClick={confirmReject}>
            Confirm Reject
          </button>
          <button onClick={() => setShowRejectBox(false)}>Cancel</button>
        </div>
      )}
    </article>
  );
}
export default function LeaveRequests() {
  const startingData = readLeaveData();
  const [employees] = useState(startingData.employees);
  const [leaves, setLeaves] = useState(startingData.leaves);
  const [currentPage, setCurrentPage] = useState("requests");
  const [filter, setFilter] = useState("All");
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
    const changedLeaves = leaves.map((leave) =>
      leave.id === id ? { ...leave, status, rejectionReason: reason } : leave,
    );
    saveLeaves(changedLeaves);
  }
  function addLeave(newLeave) {
    const leaveToSave = {
      ...newLeave,
      id: `lv${leaves.length + 1}`,
      status: "Pending",
      rejectionReason: "",
    };
    saveLeaves([...leaves, leaveToSave]);
    setCurrentPage("requests");
  }
  let leavesToShow = leaves;
  if (filter === "Pending") {
    leavesToShow = leaves.filter((l) => l.status === "Pending");
  }
  function showPage() {
    switch (currentPage) {
      case "apply":
        return (
          <ApplyLeave
            employees={employees}
            onApply={addLeave}
            onCancel={() => setCurrentPage("requests")}
          />
        );
      case "approved":
        return <Approved leaves={leaves} employees={employees} />;
      case "rejected":
        return <Reject leaves={leaves} employees={employees} />;
      default:
        return (
          <>
            <h2>Leave Requests</h2>
            <p>For managing employee leave requests</p>
            <p>
              Pending requests:{" "}
              {leaves.filter((l) => l.status === "Pending").length}
            </p>
            <div className="filters">
              <button
                className={filter === "All" ? "filter active" : "filter"}
                onClick={() => setFilter("All")}
              >
                All
              </button>
              <button
                className={filter === "Pending" ? "filter active" : "filter"}
                onClick={() => setFilter("Pending")}
              >
                Pending
              </button>
            </div>
            {leavesToShow.length === 0 && (
              <p className="empty">No leave requests found.</p>
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
    <div className="leave-app">
      <aside className="leave-sidebar">
        <h1>Leave Management</h1>
        <button
          className="menu-button"
          onClick={() => setCurrentPage("requests")}
        >
          Leave Requests
        </button>
        <button className="menu-button" onClick={() => setCurrentPage("apply")}>
          Apply Leave
        </button>
        <button
          className="menu-button"
          onClick={() => setCurrentPage("approved")}
        >
          Approved
        </button>
        <button
          className="menu-button"
          onClick={() => setCurrentPage("rejected")}
        >
          Rejected
        </button>
      </aside>
      <main className="leave-main">
        <div className="leave-content">{showPage()}</div>
      </main>
    </div>
  );
}
