import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import {
  createEmployee,
  updateEmployee,
  fetchDepartments,
  fetchDesignations,
} from "../../services/dataService";
import { validateEmployee } from "./employeeValidation";

function EmployeeForm({ mode = "add", employee }) {
  const navigate = useNavigate();

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
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
    skills: "",
    documents: [],
  };

  const getEmployeeData = () => {
    if (!employee) {
      return emptyForm;
    }

    return {
      ...emptyForm,
      ...employee,
      countryCode: employee.countryCode || "+91",
      phone: employee.phone || "",
      skills: Array.isArray(employee.skills)
        ? employee.skills.join(", ")
        : employee.skills || "",
      documents: Array.isArray(employee.documents)
        ? employee.documents
        : [],
    };
  };

  const [formData, setFormData] = useState(getEmployeeData());
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const departmentData = await fetchDepartments();
        const designationData = await fetchDesignations();

        setDepartments(departmentData);
        setDesignations(designationData);

        const statesResponse = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              country: "India",
            }),
          }
        );

        if (!statesResponse.ok) {
          throw new Error("Failed to fetch states");
        }

        const statesResult = await statesResponse.json();
        setStates(statesResult.data?.states || []);

        const countriesResponse = await fetch(
          "https://countriesnow.space/api/v0.1/countries/codes"
        );

        if (!countriesResponse.ok) {
          throw new Error("Failed to fetch country codes");
        }

        const countriesResult = await countriesResponse.json();
        setCountries(countriesResult.data || []);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    loadFormData();
  }, []);

  useEffect(() => {
    if (employee) {
      setFormData({
        ...emptyForm,
        ...employee,
        countryCode: employee.countryCode || "+91",
        phone: employee.phone || "",
        skills: Array.isArray(employee.skills)
          ? employee.skills.join(", ")
          : employee.skills || "",
        documents: Array.isArray(employee.documents)
          ? employee.documents
          : [],
      });
    }
  }, [employee]);

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "file" ? Array.from(files) : value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateEmployee(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    const employeeData = {
      ...formData,
      salary: Number(formData.salary) || 0,
      skills,
    };

    try {
      if (mode === "edit") {
        await updateEmployee(formData.id, employeeData);
      } else {
        await createEmployee(employeeData);
      }

      navigate("/employee-list");
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const pageTitle =
    mode === "edit" ? "Edit Employee" : "Add Employee";

  const pageSubtitle =
    mode === "edit"
      ? "Update the employee details below."
      : "Fill in the details to onboard a new employee.";

  const buttonText =
    mode === "edit"
      ? "Update Employee"
      : "Save Employee";

  return (
    <form onSubmit={handleSubmit}>
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h2 className="page-title">{pageTitle}</h2>
            <p className="text-secondary">{pageSubtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/employee-list")}
            className="form-back-button"
          >
            <ArrowLeft size={16} />
            <span>Back to employees</span>
          </button>
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h2 className="section-title">Personal Information</h2>

          <div className="form-grid">
            {/* Employee ID */}
            {mode === "edit" && (
              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  value={formData.id || ""}
                  readOnly
                  className="form-input form-readonly"
                />
              </div>
            )}

            {/* First Name */}
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="form-input"
              />

              {errors.firstName && (
                <p className="form-error">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="form-input"
              />

              {errors.lastName && (
                <p className="form-error">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                readOnly={mode === "edit"}
                className={`form-input ${
                  mode === "edit" ? "form-readonly" : ""
                }`}
              />

              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>

              <div className="phone-input-group">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="form-input phone-country-code"
                >
                  <option value="">Code</option>

                  {countries.map((country, index) => (
                    <option
                      key={`${country.name}-${index}`}
                      value={
                        country.dial_code ||
                        country.phone_code ||
                        country.code
                      }
                    >
                      {country.name}{" "}
                      {country.dial_code ||
                        country.phone_code ||
                        country.code}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="form-input phone-number"
                />
              </div>

              {errors.phone && (
                <p className="form-error">{errors.phone}</p>
              )}
            </div>

            {/* Gender */}
            <div className="form-group">
              <label className="form-label">Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={mode === "edit"}
                className="form-input"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {errors.gender && (
                <p className="form-error">{errors.gender}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="form-label">Date of Birth</label>

              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={mode === "edit"}
                className="form-input"
              />

              {errors.dob && (
                <p className="form-error">{errors.dob}</p>
              )}
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="form-section">
          <h2 className="section-title">Job Information</h2>

          <div className="form-grid">
            {/* Department */}
            <div className="form-group">
              <label className="form-label">Department</label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Department</option>

                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              {errors.department && (
                <p className="form-error">{errors.department}</p>
              )}
            </div>

            {/* Designation */}
            <div className="form-group">
              <label className="form-label">Designation</label>

              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Designation</option>

                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>

              {errors.designation && (
                <p className="form-error">{errors.designation}</p>
              )}
            </div>

            {/* Employee Type */}
            <div className="form-group">
              <label className="form-label">Employee Type</label>

              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Employee Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>

              {errors.employeeType && (
                <p className="form-error">{errors.employeeType}</p>
              )}
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Date of Joining */}
            <div className="form-group">
              <label className="form-label">Date of Joining</label>

              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className="form-input"
              />

              {errors.joinDate && (
                <p className="form-error">{errors.joinDate}</p>
              )}
            </div>

            {/* Salary */}
            <div className="form-group">
              <label className="form-label">Salary</label>

              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                className="form-input"
              />

              {errors.salary && (
                <p className="form-error">{errors.salary}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="form-section">
          <h2 className="section-title">Address Information</h2>

          <div className="form-grid">
            {/* Address */}
            <div className="form-group form-group-full">
              <label className="form-label">Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="form-textarea"
              />

              {errors.address && (
                <p className="form-error">{errors.address}</p>
              )}
            </div>

            {/* City */}
            <div className="form-group">
              <label className="form-label">City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="form-input"
              />

              {errors.city && (
                <p className="form-error">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div className="form-group">
              <label className="form-label">State</label>

              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select State</option>

                {states.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>

              {errors.state && (
                <p className="form-error">{errors.state}</p>
              )}
            </div>

            {/* ZIP Code */}
            <div className="form-group">
              <label className="form-label">ZIP Code</label>

              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="Enter ZIP code"
                className="form-input"
              />

              {errors.zip && (
                <p className="form-error">{errors.zip}</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="form-section">
          <h2 className="section-title">Skills</h2>

          <div className="form-grid">
            <div className="form-group form-group-full">
              <label className="form-label">Skills</label>

              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Enter skills separated by commas"
                className="form-textarea"
              />

              {errors.skills && (
                <p className="form-error">{errors.skills}</p>
              )}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="form-section">
          <h2 className="section-title">Documents</h2>

          <div className="form-group">
            <label className="form-label">Documents</label>
            <input
              type="file"
              name="documents"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleChange}
              className="form-input"
            />

            {errors.documents && (
              <p className="form-error">{errors.documents}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/employee-list")}
          >
            Cancel
          </Button>

          <Button type="submit">{buttonText}</Button>
        </div>
      </div>
    </form>
  );
}

export default EmployeeForm;