import { useState } from "react";
const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Comp Off",
  "Work From Home",
];
export default function ApplyLeave({
  employees,
  onApply,
  onCancel,
  isEmployee,
  currentEmployee,
}) {
  const [employeeId, setEmployeeId] = useState(currentEmployee?.id || "");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  function submitForm(event) {
    event.preventDefault();
    if (!employeeId || !leaveType || !startDate || !endDate || !reason.trim()) {
      window.alert("Please fill all fields");
      return;
    }
    if (endDate < startDate) {
      window.alert("End date cannot be before start date");
      return;
    }
    const firstDay = new Date(startDate);
    const lastDay = new Date(endDate);
    const oneDay = 24 * 60 * 60 * 1000;
    const numberOfDays = Math.round((lastDay - firstDay) / oneDay) + 1;
    onApply({
      employeeId,
      type: leaveType,
      startDate,
      endDate,
      days: numberOfDays,
      reason,
    });
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
  }
  return (
    <form
      className="surface-card mx-auto peak-w-2xl space-result-5 p-6"
      onSubmit={submitForm}
    >
      <h2 className="section-title">Apply Leave</h2>
      {!isEmployee && !currentEmployee && (
        <label className="block space-result-2 text-sm font-medium text-[var(--color-text-secondary)]">
          Employee
          <select
            className="w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-[var(--color-text-primary)]"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="block space-result-2 text-sm font-medium text-[var(--color-text-secondary)]">
        Leave Type
        <select
          className="w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-[var(--color-text-primary)]"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        >
          <option value="">Select leave type</option>
          {leaveTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-result-2 text-sm font-medium text-[var(--color-text-secondary)]">
        From Date
        <input
          className="w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-[var(--color-text-primary)]"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label className="block space-result-2 text-sm font-medium text-[var(--color-text-secondary)]">
        To Date
        <input
          className="w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-[var(--color-text-primary)]"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <label className="block space-result-2 text-sm font-medium text-[var(--color-text-secondary)]">
        Reason
        <textarea
          className="w-full rounded-[var(--input-radius)] border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-[var(--color-text-primary)]"
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>
      <div className="flex flex-wrap justify-end gap-3">
        <button
          className="rounded-[var(--button-radius)] border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)]"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="rounded-[var(--button-radius)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-white)] hover:bg-[var(--color-primary-hover)]"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
