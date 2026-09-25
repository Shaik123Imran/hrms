import React, { useMemo, useState } from "react";

const Attendance = ({
  hrData,
  employees = [],
  attendance = [],
}) => {
  const [selectedDate, setSelectedDate] = useState("2026-09-11");

  // Employees working under the selected HR
  const hrEmployees = useMemo(() => {
    if (!hrData) return [];

    return employees.filter(
      (employee) => employee.managerId === hrData.id
    );
  }, [employees, hrData]);

  // Attendance records for selected date
  const dailyAttendance = useMemo(() => {
    return attendance.filter(
      (record) => record.date === selectedDate
    );
  }, [attendance, selectedDate]);

  // Calculate attendance summary
  const summary = useMemo(() => {
    const employeeIds = new Set(
      hrEmployees.map((employee) => employee.id)
    );

    const records = dailyAttendance.filter((record) =>
      employeeIds.has(record.employeeId)
    );

    const present = records.filter(
      (record) => record.status === "Present"
    ).length;

    const onLeave = records.filter(
      (record) => record.status === "On Leave"
    ).length;

    const lateComing = records.filter(
      (record) =>
        record.status === "Late" ||
        record.late === true
    ).length;

    return {
      total: hrEmployees.length,
      present,
      onLeave,
      lateComing,
    };
  }, [hrEmployees, dailyAttendance]);

  if (!hrData) {
    return (
      <div className="p-6 text-red-600">
        HR data not found.
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Attendance Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Attendance of employees under{" "}
            {hrData.firstName} {hrData.lastName}
          </p>
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="attendance-date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Select Date
          </label>

          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <AttendanceCard
          title="Total"
          value={summary.total}
          description="Employees under HR"
        />

        <AttendanceCard
          title="Present"
          value={summary.present}
          description="Present today"
        />

        <AttendanceCard
          title="On Leave"
          value={summary.onLeave}
          description="Employees on leave"
        />

        <AttendanceCard
          title="Late Coming"
          value={summary.lateComing}
          description="Late arrivals"
        />

      </div>

      // Employee Attendance 
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-6 py-4">
          <h4 className="font-semibold text-gray-900">
            Employee Attendance
          </h4>
        </div>

        {hrEmployees.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No employees are assigned to this HR.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {hrEmployees.map((employee) => {
              const record = dailyAttendance.find(
                (item) => item.employeeId === employee.id
              );

              return (
                <EmployeeAttendance
                  key={employee.id}
                  employee={employee}
                  record={record}
                />
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
};


// Attendence Card

const AttendanceCard = ({
  title,
  value,
  description,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>

    </div>
  );
};


// Employee Attendence 

const EmployeeAttendance = ({
  employee,
  record,
}) => {
  const fullName = `${employee.firstName} ${employee.lastName}`;

  const status = record?.status || "No Record";

  return (
    <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
          {employee.firstName?.charAt(0)}
          {employee.lastName?.charAt(0)}
        </div>

        <div>
          <p className="font-medium text-gray-900">
            {fullName}
          </p>

          <p className="text-sm text-gray-500">
            {employee.designation}
          </p>
        </div>

      </div>

      <span
        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
          status === "Present"
            ? "bg-green-100 text-green-700"
            : status === "On Leave"
            ? "bg-yellow-100 text-yellow-700"
            : status === "Late"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>

    </div>
  );
};

export default Attendance;
