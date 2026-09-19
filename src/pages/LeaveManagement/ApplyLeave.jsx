import { useState } from "react";
const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Comp Off",
  "Work From Home",
];
export default function ApplyLeave({ employees, onApply, onCancel }) {
  const [employeeId, setEmployeeId] = useState("");
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
  }
  return (
    <form className="card form" onSubmit={submitForm}>
      <h2>Apply Leave</h2>
      <label>
        Employee
        <select
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
      <label>
        Leave Type
        <select
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
      <label>
        From Date
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        To Date
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <label>
        Reason
        <textarea
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>
      <div className="buttons">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="blue-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}
