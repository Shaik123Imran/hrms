import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "../../data/data.json";
import "./EmployeeForm.css";

function EmployeeForm({ mode = "add", employee }) {
  const navigate = useNavigate();

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    department: "",
    designation: "",
    employeeType: "",
    status: "Active",
    joinDate: "",
    salary: "",
    managerId: "",
    skills: []
  };

  const [formData, setFormData] = useState(
    employee || emptyForm
  );

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const storedData = localStorage.getItem("employees");
    const employees = storedData
      ? JSON.parse(storedData)
      : data.employees;

    if (mode === "edit") {
      const updatedEmployees = employees.map((item) =>
        item.id === formData.id ? formData : item
      );

      localStorage.setItem(
        "employees",
        JSON.stringify(updatedEmployees)
      );
    } else {
      const newEmployee = {
        ...formData,
        id: `e${Date.now()}`,
        salary: Number(formData.salary) || 0,
        skills: []
      };

      const updatedEmployees = [
        ...employees,
        newEmployee
      ];

      localStorage.setItem(
        "employees",
        JSON.stringify(updatedEmployees)
      );
    }

    navigate("/add-employee");
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h1>
        {mode === "edit" ? "Edit Employee" : "Add Employee"}
      </h1>

      <div className="form-section">
        <h2>Personal Information</h2>

        <div className="form-grid">
          {mode === "edit" && (
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                value={formData.id}
                readOnly
              />
            </div>
          )}

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
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

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

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

              {data.departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            >
              <option value="">Select Designation</option>

              {data.designations.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Employee Type</label>
            <select
              name="employeeType"
              value={formData.employeeType}
              onChange={handleChange}
            >
              <option value="">Select Employee Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date of Joining</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter salary"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Address Information</h2>

        <div className="form-grid">
          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
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
            <label>ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="Enter ZIP code"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate("/add-employee")}
        >
          Cancel
        </button>

        <button type="submit" className="submit-btn">
          {mode === "edit" ? "Update Employee" : "Save Employee"}
        </button>
      </div>
    </form>
  );
}

export default EmployeeForm;