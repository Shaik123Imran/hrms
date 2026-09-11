import { useState } from "react";
import "./EmployeeForm.css";

function EmployeeForm({ mode = "add", employee = null }) {
  const [formData, setFormData] = useState(
    employee || {
      employeeId: "",
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      department: "",
      designation: "",
      dateOfJoining: "",
      employmentType: "",
      status: "Active",
      address: "",
      city: "",
      state: "",
      pincode: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingEmployees =
      JSON.parse(localStorage.getItem("employees")) || [];

    if (mode === "edit") {
      const updatedEmployees = existingEmployees.map((existingEmployee) =>
        existingEmployee.employeeId === formData.employeeId
          ? formData
          : existingEmployee
      );

      localStorage.setItem(
        "employees",
        JSON.stringify(updatedEmployees)
      );

      console.log("Employee Updated:", formData);
    } else {
      const updatedEmployees = [
        ...existingEmployees,
        formData,
      ];

      localStorage.setItem(
        "employees",
        JSON.stringify(updatedEmployees)
      );

      console.log("Employee Saved:", formData);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h1>
        {mode === "edit" ? "Edit Employee" : "Add Employee"}
      </h1>

      {/* Employee Information */}
      <div className="form-section">
        <h2>Employee Information</h2>

        <div className="form-grid">

          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Enter employee ID"
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

        </div>
      </div>

      {/* Job Information */}
      <div className="form-section">
        <h2>Job Information</h2>

        <div className="form-grid">

          <div className="form-group">
            <label>Department</label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>

              <option value="Human Resources (HR)">
                Human Resources (HR)
              </option>

              <option value="Engineering / Development">
                Engineering / Development
              </option>

              <option value="Quality Assurance (QA)">
                Quality Assurance (QA)
              </option>

              <option value="UI/UX Design">
                UI/UX Design
              </option>

              <option value="DevOps">
                DevOps
              </option>

              <option value="Finance">
                Finance
              </option>

              <option value="Sales">
                Sales
              </option>

              <option value="Marketing">
                Marketing
              </option>

              <option value="Customer Support">
                Customer Support
              </option>

              <option value="Administration">
                Administration
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Designation</label>

            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter designation"
            />
          </div>

          <div className="form-group">
            <label>Date of Joining</label>

            <input
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Employment Type</label>

            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
            >
              <option value="">
                Select Employment Type
              </option>

              <option value="Full Time">
                Full Time
              </option>

              <option value="Part Time">
                Part Time
              </option>

              <option value="Contract">
                Contract
              </option>

              <option value="Intern">
                Intern
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* Address Information */}
      <div className="form-section">
        <h2>Address Information</h2>

        <div className="form-grid">

          <div className="form-group full-width">
            <label>Address</label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>City</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label>State</label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />
          </div>

          <div className="form-group">
            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />
          </div>

        </div>
      </div>

      {/* Buttons */}
      <div className="form-actions">

        <button
          type="button"
          className="cancel-btn"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="submit-btn"
        >
          {mode === "edit"
            ? "Update Employee"
            : "Save Employee"}
        </button>

      </div>
    </form>
  );
}

export default EmployeeForm;