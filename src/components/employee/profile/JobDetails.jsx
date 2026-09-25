import React from "react";

const Employment = ({ hrData }) => {
  if (!hrData) {
    return (
      <div className="p-6 text-red-600">
        HR data not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Employment Details
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current employment information
        </p>
      </div>

      {/* Job Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Job Information
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <InfoItem
            label="Employee ID"
            value={hrData.id}
          />

          <InfoItem
            label="Designation"
            value={hrData.designation}
          />

          <InfoItem
            label="Department"
            value={hrData.department}
          />

          <InfoItem
            label="Employment Type"
            value={hrData.employmentType}
          />

          <InfoItem
            label="Status"
            value={hrData.status}
          />

          <InfoItem
            label="Join Date"
            value={hrData.joinDate}
          />

        </div>

      </div>

      {/* Salary Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Salary Information
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <InfoItem
            label="Annual Salary"
            value={
              hrData.salary
                ? `₹${hrData.salary.toLocaleString("en-IN")}`
                : null
            }
          />

        </div>

      </div>

      {/* Skills */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Skills
        </h3>

        {hrData.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {hrData.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No skills available.
          </p>
        )}

      </div>

      {/* Reporting Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Reporting Information
        </h3>

        <InfoItem
          label="Manager ID"
          value={hrData.managerId || "No Manager"}
        />

      </div>

    </div>
  );
};


const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value || "Not available"}
      </p>
    </div>
  );
};

export default Employment;