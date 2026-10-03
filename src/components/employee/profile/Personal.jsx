
import React, { useState } from "react";

const Personal = ({ hrData }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [addressData, setAddressData] = useState({
    address: hrData?.address || "",
    city: hrData?.city || "",
    state: hrData?.state || "",
    country: hrData?.country || "",
    postalCode: hrData?.postalCode || "",
  });

  if (!hrData) {
    return (
      <div className="p-6 text-red-600">
        HR data not found.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setAddressData({
      address: hrData.address || "",
      city: hrData.city || "",
      state: hrData.state || "",
      country: hrData.country || "",
      postalCode: hrData.postalCode || "",
    });

    setIsEditing(true);
  };

  const handleCancel = () => {
    setAddressData({
      address: hrData.address || "",
      city: hrData.city || "",
      state: hrData.state || "",
      country: hrData.country || "",
      postalCode: hrData.postalCode || "",
    });

    setIsEditing(false);
  };

  const handleSave = () => {

    console.log("Updated Address:", addressData);

    setIsEditing(false);
  };

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
            value={hrData.dob}
          />

        </div>
      </div>

      {/* Address */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        {/* Address Header */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Address
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Contact address information
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Edit Address
            </button>
          )}

        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {isEditing ? (
            <>
              <InputItem
                label="Address"
                name="address"
                value={addressData.address}
                onChange={handleChange}
              />

              <InputItem
                label="City"
                name="city"
                value={addressData.city}
                onChange={handleChange}
              />

              <InputItem
                label="State"
                name="state"
                value={addressData.state}
                onChange={handleChange}
              />

              <InputItem
                label="Country"
                name="country"
                value={addressData.country}
                onChange={handleChange}
              />

              <InputItem
                label="Postal Code"
                name="postalCode"
                value={addressData.postalCode}
                onChange={handleChange}
              />

              {/* Buttons */}
              <div className="flex items-end gap-3">

                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>
            </>
          ) : (
            <>
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
            </>
          )}

        </div>
      </div>

    </div>
  );
};


/* Read-only information */
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


/* Editable input */
const InputItem = ({
  label,
  name,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-500">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
};

export default Personal;
