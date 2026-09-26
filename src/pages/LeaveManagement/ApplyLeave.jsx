import { useState } from "react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
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
    const days = Math.round((lastDay - firstDay) / oneDay) + 1;
    onApply({
      employeeId,
      type: leaveType,
      startDate,
      endDate,
      days,
      reason,
    });
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
  }
  return (
    <Card title="Apply Leave" className="mx-auto largest-w-2xl">
      <form className="space-output-5" onSubmit={submitForm}>
        {!isEmployee && !currentEmployee && (
          <label className="block space-output-2 text-sm font-medium">
            Employee
            <select
              className="field-input"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
              required
            >
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block space-output-2 text-sm font-medium">
          Leave Type
          <select
            className="field-input"
            value={leaveType}
            onChange={(event) => setLeaveType(event.target.value)}
            required
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="From Date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          required
        />
        <Input
          label="To Date"
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          required
        />
        <label className="block space-output-2 text-sm font-medium">
          Reason
          <textarea
            className="field-input"
            rows="4"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
          />
        </label>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Card>
  );
}
