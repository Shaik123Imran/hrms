import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { LeaveCard } from "./LeaveRequests.jsx";
import {
  createLeave,
  fetchLeaveManagementData,
} from "../../services/dataService.js";
const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Comp Off",
  "Work From Home",
];
const labelClassName =
  "block text-sm font-medium text-[var(--color-text-primary)]";
const fieldStyle = {
  display: "block",
  width: "100%",
  marginTop: "var(--space-2)",
  padding: "var(--space-2) var(--input-padding-horizontal)",
  border: "var(--input-border-width) solid var(--input-border)",
  borderRadius: "var(--input-radius)",
  background: "var(--input-background)",
  color: "var(--color-text-primary)",
  fontSize: "var(--font-size-md)",
};
function DateField({ label, value, onChange, minimumDate }) {
  return (
    <label className={labelClassName}>
      {label}
      <input
        type="date"
        value={value}
        min={minimumDate}
        onChange={onChange}
        required
        style={fieldStyle}
      />
    </label>
  );
}
export default function ApplyLeave() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState({
    employees: [],
    leaves: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadLeaveData() {
      const data = await fetchLeaveManagementData();
      setLeaveData(data);
      setIsLoading(false);
    }
    loadLeaveData();
  }, []);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const role = String(user?.role || "").toLowerCase();
  const allowedRoles = ["employee", "hr", "manager", "admin"];
  const canApply = allowedRoles.includes(role);
  const employees = leaveData.employees;
  const leaves = leaveData.leaves;
  const currentEmployee = employees.find((employee) => {
    if (user?.employeeId && employee.id === user.employeeId) {
      return true;
    }
    return employee.email?.toLowerCase() === user?.email?.toLowerCase();
  });
  let myLeaves = [];
  if (currentEmployee) {
    myLeaves = leaves.filter(
      (leave) => leave.employeeId === currentEmployee.id,
    );
  }
  async function submitLeave(event) {
    event.preventDefault();
    if (
      !currentEmployee ||
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason.trim()
    ) {
      window.alert("Please fill all fields");
      return;
    }
    if (endDate < startDate) {
      window.alert("End date cannot be before start date");
      return;
    }
    const firstDay = Date.parse(`${startDate}T00:00:00Z`);
    const lastDay = Date.parse(`${endDate}T00:00:00Z`);
    const days = Math.round((lastDay - firstDay) / 86400000) + 1;
    const createdLeave = await createLeave({
      employeeId: currentEmployee.id,
      applicantRole: role,
      applicantUserId: user?.id,
      type: leaveType,
      startDate,
      endDate,
      days,
      reason: reason.trim(),
    });
    setLeaveData((currentData) => ({
      ...currentData,
      leaves: [...currentData.leaves, createdLeave],
    }));
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
  }
  if (!canApply) {
    return (
      <EmptyState
        title="Leave application unavailable"
        description="You do not have permission to submit a leave application."
      />
    );
  }
  if (isLoading) {
    return <EmptyState title="Leave data is Loading..." />;
  }
  if (!currentEmployee) {
    return (
      <EmptyState
        title={`${user?.role || "User"} account not linked`}
        description="Ask the login or data team to link this account to an employee record."
      />
    );
  }
  return (
    <div className="min-h-screen">
      <main className="p-[30px_20px]">
        <div className="mx-auto w-full max-w-[1240px]">
          <Card title="Apply Leave" className="w-full">
            <form className="space-y-5" onSubmit={submitLeave}>
              <label className={labelClassName}>
                Leave Type
                <select
                  value={leaveType}
                  onChange={(event) => setLeaveType(event.target.value)}
                  required
                  style={fieldStyle}
                >
                  <option value="">Select leave type</option>
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <DateField
                  label="From Date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
                <DateField
                  label="To Date"
                  value={endDate}
                  minimumDate={startDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
              <label className={labelClassName}>
                Reason
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  required
                  style={{
                    ...fieldStyle,
                    minHeight: "7rem",
                    resize: "vertical",
                  }}
                />
              </label>
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/leave/approved")}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Card>
          <section className="mt-6 space-y-4">
            <h2 className="section-title">My Leave Requests</h2>
            {role === "admin" && (
              <p className="text-sm text-muted">
                An Admin leave request must be approved by HR or a Manager.
              </p>
            )}
            {myLeaves.length === 0 ? (
              <EmptyState title="No leave requests yet" />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {myLeaves.map((leave) => (
                  <LeaveCard
                    key={leave.id}
                    leave={leave}
                    employee={currentEmployee}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
