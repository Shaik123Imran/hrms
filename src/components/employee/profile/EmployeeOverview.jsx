import { useState } from "react";

const EmployeeOverview = ({ hrData, attendance = [] }) => {
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  if (!hrData) {
    return <p className="p-6 text-red-600">Employee data not found.</p>;
  }

  const employeeAttendance = attendance.filter(
    (record) => record.employeeId === hrData.id
  );

  const present = employeeAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absent = employeeAttendance.filter(
    (record) => record.status === "Absent"
  ).length;

  return (
    <div className="space-y-6">

      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Overview
        </h2>
        <p className="text-sm text-gray-500">
          Attendance and leave details
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <InfoCard title="Present" value={present} />

        <InfoCard title="Absent" value={absent} />

        <InfoCard title="Leave Remaining" value={12} />

        <button
          onClick={() => setShowLeaveForm(true)}
          className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left hover:bg-blue-100"
        >
          <p className="text-sm font-medium text-blue-600">
            Apply for Leave
          </p>

          <p className="mt-2 text-lg font-semibold text-blue-700">
            Apply Now →
          </p>
        </button>

      </div>

      {/* Attendance */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h3 className="mb-4 text-lg font-semibold">
          Attendance Details
        </h3>

        <div className="space-y-3">

          {employeeAttendance.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{record.date}</p>

                <p className="text-sm text-gray-500">
                  Check In: {record.checkIn || "--"} | Check Out:{" "}
                  {record.checkOut || "--"}
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                {record.status}
              </span>
            </div>
          ))}

        </div>

      </div>

      {/* Leave Form */}
      {showLeaveForm && (
        <LeaveForm
          onClose={() => setShowLeaveForm(false)}
        />
      )}

    </div>
  );
};


/* Summary Card */
const InfoCard = ({ title, value }) => (
  <div className="rounded-xl border bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="mt-2 text-3xl font-bold">{value}</p>
  </div>
);


/* Leave Form */
const LeaveForm = ({ onClose }) => (
  <div className="rounded-xl border bg-white p-6 shadow-sm">

    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">
        Apply for Leave
      </h3>

      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-900"
      >
        ✕
      </button>
    </div>

    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

      <FormField label="Leave Type">
        <select className="input">
          <option>Casual Leave</option>
          <option>Sick Leave</option>
          <option>Earned Leave</option>
          <option>Comp Off</option>
        </select>
      </FormField>

      <FormField label="Start Date">
        <input type="date" className="input" />
      </FormField>

      <FormField label="End Date">
        <input type="date" className="input" />
      </FormField>

      <FormField label="Reason">
        <input
          type="text"
          placeholder="Enter reason"
          className="input"
        />
      </FormField>

    </div>

    <button className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700">
      Submit Leave Request
    </button>

  </div>
);


/* Form Field */
const FormField = ({ label, children }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">
      {label}
    </label>

    {children}
  </div>
);

export default EmployeeOverview;