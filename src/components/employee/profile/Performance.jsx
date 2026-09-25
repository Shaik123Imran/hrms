import React from "react";

const Performance = ({ hrData }) => {
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
          Performance
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Performance information for {hrData.firstName}{" "}
          {hrData.lastName}
        </p>
      </div>

      {/* Performance Overview */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Performance Overview
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-lg bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Employee Status
            </p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              {hrData.status || "Not available"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Department
            </p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              {hrData.department || "Not available"}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Designation
            </p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              {hrData.designation || "Not available"}
            </p>
          </div>

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

      {/* Performance Data Notice */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-semibold text-gray-900">
          Performance Records
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          No detailed performance records are available in
          the current HR data.
        </p>

      </div>

    </div>
  );
};

export default Performance;