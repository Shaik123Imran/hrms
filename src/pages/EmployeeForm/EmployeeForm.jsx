import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import data from "../../data/data.json";
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
    skills: "",
  };

  const getEmployeeData = () => {
    if (!employee) {
      return emptyForm;
    }

    return {
      ...employee,
      skills: Array.isArray(employee.skills)
        ? employee.skills.join(", ")
        : employee.skills || "",
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
          : employee.skills || "",
      });
    }
  }, [employee]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
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
            skills: skills,
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
        skills: skills,
      };

      const updatedEmployees = [...employees, newEmployee];

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

  /* =========================
     TOKEN BASED STYLES
  ========================= */

  const sectionStyle = {
    background: "var(--card-background)",
    border: "1px solid var(--card-border)",
    borderRadius: "var(--card-radius)",
    boxShadow: "var(--card-shadow)",
    padding: "var(--space-5)",
    marginBottom: "var(--section-gap)",
  };

  const sectionTitleStyle = {
    margin: "0 0 var(--space-5)",
    fontSize: "var(--heading-section-size)",
    fontWeight: "var(--heading-section-weight)",
    color: "var(--color-text-primary)",
    lineHeight: "var(--line-height-tight)",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "var(--form-gap)",
  };

  const groupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  };

  const fullWidthStyle = {
    gridColumn: "1 / -1",
  };

  const labelStyle = {
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--color-text-primary)",
  };

  const errorStyle = {
    margin: 0,
    fontSize: "var(--font-size-xs)",
    color: "var(--color-error)",
    lineHeight: "var(--line-height-normal)",
  };

  const inputStyle = {
    width: "100%",
    minHeight: "var(--input-height-md)",
    padding: "0 var(--input-padding-horizontal)",
    border: "var(--input-border-width) solid var(--input-border)",
    borderRadius: "var(--input-radius)",
    background: "var(--input-background)",
    color: "var(--color-text-primary)",
    fontFamily: "var(--font-family)",
    fontSize: "var(--font-size-sm)",
    outline: "none",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    padding: "var(--space-3)",
    resize: "vertical",
  };

  const readOnlyStyle = {
    ...inputStyle,
    background: "var(--disabled-background)",
    color: "var(--disabled-text)",
  };

  const backButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    background: "var(--color-surface)",
    color: "var(--color-text-secondary)",
    padding: "0 var(--space-4)",
    minHeight: "var(--button-height-md)",
    fontFamily: "var(--font-family)",
    fontSize: "var(--font-size-sm)",
    fontWeight: "var(--font-weight-medium)",
    cursor: "pointer",
  };

  const actionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "var(--space-3)",
    marginTop: "var(--space-5)",
    paddingTop: "var(--space-5)",
    borderTop: "1px solid var(--color-border)",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="page-container">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h2 className="page-title">{pageTitle}</h2>

            <p className="page-subtitle">
              {pageSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/employee-list")}
            style={backButtonStyle}
          >
            <ArrowLeft size={16} />
            <span>Back to employees</span>
          </button>
        </div>

        {/* Personal Information */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            Personal Information
          </h2>

          <div style={gridStyle}>

            {mode === "edit" && (
              <div style={groupStyle}>
                <label style={labelStyle}>
                  Employee ID
                </label>

                <input
                  type="text"
                  value={formData.id}
                  readOnly
                  style={readOnlyStyle}
                />
              </div>
            )}

            <div style={groupStyle}>
              <label style={labelStyle}>
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                style={inputStyle}
              />

              {errors.firstName && (
                <p style={errorStyle}>
                  {errors.firstName}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                style={inputStyle}
              />

              {errors.lastName && (
                <p style={errorStyle}>
                  {errors.lastName}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                style={inputStyle}
              />

              {errors.email && (
                <p style={errorStyle}>
                  {errors.email}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={inputStyle}
              />

              {errors.phone && (
                <p style={errorStyle}>
                  {errors.phone}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Gender
                </option>
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
                <option value="Other">
                  Other
                </option>
              </select>

              {errors.gender && (
                <p style={errorStyle}>
                  {errors.gender}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Date of Birth
              </label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                style={inputStyle}
              />

              {errors.dob && (
                <p style={errorStyle}>
                  {errors.dob}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            Job Information
          </h2>

          <div style={gridStyle}>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Department
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Department
                </option>

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
                <p style={errorStyle}>
                  {errors.department}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Designation
              </label>

              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Designation
                </option>

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
                <p style={errorStyle}>
                  {errors.designation}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Employee Type
              </label>

              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select Employee Type
                </option>
                <option value="Full-time">
                  Full-time
                </option>
                <option value="Part-time">
                  Part-time
                </option>
                <option value="Contract">
                  Contract
                </option>
                <option value="Intern">
                  Intern
                </option>
              </select>

              {errors.employeeType && (
                <p style={errorStyle}>
                  {errors.employeeType}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Active">
                  Active
                </option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Date of Joining
              </label>

              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                style={inputStyle}
              />

              {errors.joinDate && (
                <p style={errorStyle}>
                  {errors.joinDate}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                Salary
              </label>

              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                style={inputStyle}
              />

              {errors.salary && (
                <p style={errorStyle}>
                  {errors.salary}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            Address
          </h2>

          <div style={gridStyle}>

            <div
              style={{
                ...groupStyle,
                ...fullWidthStyle,
              }}
            >
              <label style={labelStyle}>
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows="3"
                style={textareaStyle}
              />

              {errors.address && (
                <p style={errorStyle}>
                  {errors.address}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                style={inputStyle}
              />

              {errors.city && (
                <p style={errorStyle}>
                  {errors.city}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                State
              </label>

              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select State
                </option>
                <option value="Andhra Pradesh">
                  Andhra Pradesh
                </option>
                <option value="Arunachal Pradesh">
                  Arunachal Pradesh
                </option>
                <option value="Assam">
                  Assam
                </option>
                <option value="Bihar">
                  Bihar
                </option>
                <option value="Chhattisgarh">
                  Chhattisgarh
                </option>
                <option value="Goa">
                  Goa
                </option>
                <option value="Gujarat">
                  Gujarat
                </option>
                <option value="Haryana">
                  Haryana
                </option>
                <option value="Himachal Pradesh">
                  Himachal Pradesh
                </option>
                <option value="Jharkhand">
                  Jharkhand
                </option>
                <option value="Karnataka">
                  Karnataka
                </option>
                <option value="Kerala">
                  Kerala
                </option>
                <option value="Madhya Pradesh">
                  Madhya Pradesh
                </option>
                <option value="Maharashtra">
                  Maharashtra
                </option>
                <option value="Manipur">
                  Manipur
                </option>
                <option value="Meghalaya">
                  Meghalaya
                </option>
                <option value="Mizoram">
                  Mizoram
                </option>
                <option value="Nagaland">
                  Nagaland
                </option>
                <option value="Odisha">
                  Odisha
                </option>
                <option value="Punjab">
                  Punjab
                </option>
                <option value="Rajasthan">
                  Rajasthan
                </option>
                <option value="Sikkim">
                  Sikkim
                </option>
                <option value="Tamil Nadu">
                  Tamil Nadu
                </option>
                <option value="Telangana">
                  Telangana
                </option>
                <option value="Tripura">
                  Tripura
                </option>
                <option value="Uttar Pradesh">
                  Uttar Pradesh
                </option>
                <option value="Uttarakhand">
                  Uttarakhand
                </option>
                <option value="West Bengal">
                  West Bengal
                </option>
              </select>

              {errors.state && (
                <p style={errorStyle}>
                  {errors.state}
                </p>
              )}
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>
                ZIP Code
              </label>

              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="Enter ZIP code"
                style={inputStyle}
              />

              {errors.zip && (
                <p style={errorStyle}>
                  {errors.zip}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            Skills
          </h2>

          <div style={gridStyle}>
            <div
              style={{
                ...groupStyle,
                ...fullWidthStyle,
              }}
            >
              <label style={labelStyle}>
                Skills
              </label>

              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Enter skills separated by commas"
                style={textareaStyle}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={actionsStyle}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/employee-list")}
          >
            Cancel
          </Button>

          <Button type="submit">
            {buttonText}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EmployeeForm;