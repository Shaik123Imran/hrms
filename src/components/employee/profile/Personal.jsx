import React from "react";

const Personal = ({ hrData }) => {
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
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Personal and contact details
        </p>
      </div>

      {/* Personal Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <InfoItem
            label="First Name"
            value={hrData.firstName}
          />

          <InfoItem
            label="Last Name"
            value={hrData.lastName}
          />

          <InfoItem
            label="Email"
            value={hrData.email}
          />

          <InfoItem
            label="Phone"
            value={hrData.phone}
          />

          <InfoItem
            label="Gender"
            value={hrData.gender}
          />

          <InfoItem
            label="Date of Birth"
            value={hrData.dateOfBirth}
          />

        </div>
      </div>

      {/* Address */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h3 className="mb-6 text-lg font-semibold text-gray-900">
          Address
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <InfoItem
            label="Address"
            value={hrData.address}
          />

          <InfoItem
            label="City"
            value={hrData.city}
          />

          <InfoItem
            label="State"
            value={hrData.state}
          />

          <InfoItem
            label="Country"
            value={hrData.country}
          />

          <InfoItem
            label="Postal Code"
            value={hrData.postalCode}
          />

        </div>
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

      <p className="mt-1 text-sm text-gray-900">
        {value || "Not available"}
      </p>
    </div>
  );
};

export default Personal;