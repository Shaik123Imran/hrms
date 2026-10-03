import { useNavigate } from "react-router-dom";

const EmployeeOverview = ({ hrData, attendance = [] }) => {
  const navigate = useNavigate();

  if (!hrData) {
    return (
      <p className="p-6 text-red-600">
        Employee data not found.
      </p>
    );
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

        <InfoCard
          title="Present"
          value={present}
        />

        <InfoCard
          title="Absent"
          value={absent}
        />

        <InfoCard
          title="Leave Remaining"
          value={12}
        />

        {/* Apply Leave */}
        <button
          onClick={() => navigate("/leave/apply")}
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

        {employeeAttendance.length === 0 ? (
          <p className="text-sm text-gray-500">
            No attendance records found.
          </p>
        ) : (
          <div className="space-y-3">

            {employeeAttendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >

                <div>
                  <p className="font-medium">
                    {record.date}
                  </p>

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
        )}

      </div>

    </div>
  );
};


const InfoCard = ({ title, value }) => (
  <div className="rounded-xl border bg-white p-5 shadow-sm">

    <p className="text-sm text-gray-500">
      {title}
    </p>

    <p className="mt-2 text-3xl font-bold">
      {value}
    </p>

  </div>
);

export default EmployeeOverview;
