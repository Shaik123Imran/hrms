import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "../../data/data.json";
import "./EmployeeForm.css";
import Button from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { validateEmployee } from "./employeeValidation";

function EmployeeForm({ mode = "add", employee }) {
  const navigate = useNavigate();

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "+91 ",
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
    skills: ""
  };

  const getEmployeeData = () => {
    if (!employee) {
      return emptyForm;
    }

    return {
      ...employee,
      skills: Array.isArray(employee.skills)
        ? employee.skills.join(", ")
        : employee.skills || ""
    };
  };

  const [formData, setFormData] = useState(getEmployeeData());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        skills: Array.isArray(employee.skills)
          ? employee.skills.join(", ")
          : employee.skills || ""
      });
    }
  }, [employee]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: ""
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateEmployee(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const storedData = localStorage.getItem("employees");

    let employees;

    if (storedData) {
      employees = JSON.parse(storedData);
    } else {
      employees = data.employees;
    }

    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    if (mode === "edit") {
      const updatedEmployees = employees.map((item) => {
        if (item.id === formData.id) {
          return {
            ...formData,
            salary: Number(formData.salary) || 0,
            skills: skills
          };
        }

        return item;
      });

      localStorage.setItem(
        "employees",
        JSON.stringify(updatedEmployees)
      );
    } else {
      const newEmployee = {
        ...formData,
        id: `e${Date.now()}`,
        salary: Number(formData.salary) || 0,
        skills: skills
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

    navigate("/employee-list");
  };

  let pageTitle;
  let pageSubtitle;
  let buttonText;

  if (mode === "edit") {
    pageTitle = "Edit Employee";
    pageSubtitle = "Update the employee details below.";
    buttonText = "Update Employee";
  } else {
    pageTitle = "Add Employee";
    pageSubtitle = "Fill in the details to onboard a new employee.";
    buttonText = "Save Employee";
  }

  return (
    <form
      className="employee-form"
      onSubmit={handleSubmit}
    >
      <div>

        <div className="page-header">
          <div>
            <h2 className="page-title">
              {pageTitle}
            </h2>

            <p className="page-subtitle">
              {pageSubtitle}
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/employee-list")}
          >
            <ArrowLeft size={16} />
            <span>Back to employees</span>
          </button>
        </div>

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

              {errors.firstName && (
                <p className="error-message">
                  {errors.firstName}
                </p>
              )}
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

              {errors.lastName && (
                <p className="error-message">
                  {errors.lastName}
                </p>
              )}
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

              {errors.email && (
                <p className="error-message">
                  {errors.email}
                </p>
              )}
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

              {errors.phone && (
                <p className="error-message">
                  {errors.phone}
                </p>
              )}
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

              {errors.gender && (
                <p className="error-message">
                  {errors.gender}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Date of Birth</label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />

              {errors.dob && (
                <p className="error-message">
                  {errors.dob}
                </p>
              )}
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
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                ))}
              </select>

              {errors.department && (
                <p className="error-message">
                  {errors.department}
                </p>
              )}
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
                  <option
                    key={designation}
                    value={designation}
                  >
                    {designation}
                  </option>
                ))}
              </select>

              {errors.designation && (
                <p className="error-message">
                  {errors.designation}
                </p>
              )}
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

              {errors.employeeType && (
                <p className="error-message">
                  {errors.employeeType}
                </p>
              )}
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

              {errors.joinDate && (
                <p className="error-message">
                  {errors.joinDate}
                </p>
              )}
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

              {errors.salary && (
                <p className="error-message">
                  {errors.salary}
                </p>
              )}
            </div>

          </div>
        </div>

        <div className="form-section">
          <h2>Address</h2>

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

              {errors.address && (
                <p className="error-message">
                  {errors.address}
                </p>
              )}
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

              {errors.city && (
                <p className="error-message">
                  {errors.city}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>State</label>

              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>

              {errors.state && (
                <p className="error-message">
                  {errors.state}
                </p>
              )}
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

              {errors.zip && (
                <p className="error-message">
                  {errors.zip}
                </p>
              )}
            </div>

          </div>
        </div>

        <div className="form-section">
          <h2>Skills</h2>

          <div className="form-grid">
            <div className="form-group full-width">

              <label>Skills</label>

              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Enter skills separated by commas"
              />

            </div>
          </div>
        </div>

        <div className="form-actions">

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/employee-list")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="submit-btn"
          >
            {buttonText}
          </Button>

        </div>

      </div>
    </form>
  );
}

export default EmployeeForm;