import React from "react";
import Attendance from "./Attendance.jsx";

const Overview = ({
  hrData,
  employees = [],
  attendance = [],
}) => {
  if (!hrData) {
    return (
      <div className="p-6 text-red-600">
        HR data not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================
          OVERVIEW HEADER
      ========================== */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Employees and attendance under{" "}
          {hrData.firstName} {hrData.lastName}
        </p>
      </div>

      {/* =========================
          ATTENDANCE
      ========================== */}
      <Attendance
        hrData={hrData}
        employees={employees}
        attendance={attendance}
      />

    </div>
  );
};

export default Overview;