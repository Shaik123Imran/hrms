import { employeeErrors } from "./employeeError";

export const validateEmployee = (formData) => {
  const errors = {};

  if (!formData.firstName.trim()) {
    errors.firstName = employeeErrors.firstNameRequired;
  } else if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
    errors.firstName = employeeErrors.invalidFirstName;
  }

  if (!formData.lastName.trim()) {
    errors.lastName = employeeErrors.lastNameRequired;
  } else if (!/^[A-Za-z\s]+$/.test(formData.lastName)) {
    errors.lastName = employeeErrors.invalidLastName;
  }

  if (!formData.email.trim()) {
    errors.email = employeeErrors.emailRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = employeeErrors.invalidEmail;
  }

  if (!formData.phone.trim()) {
    errors.phone = employeeErrors.phoneRequired;
  } else if (!/^\+91\s?[6-9]\d{9}$|^[6-9]\d{9}$/.test(formData.phone)) {
    errors.phone = employeeErrors.invalidPhone;
  }

  if (!formData.gender) {
    errors.gender = employeeErrors.genderRequired;
  }

  if (!formData.dob) {
    errors.dob = employeeErrors.dobRequired;
  }

  if (!formData.department) {
    errors.department = employeeErrors.departmentRequired;
  }

  if (!formData.designation) {
    errors.designation = employeeErrors.designationRequired;
  }

  if (!formData.employeeType) {
    errors.employeeType = employeeErrors.employeeTypeRequired;
  }

  if (!formData.status) {
    errors.status = employeeErrors.statusRequired;
  }

  if (!formData.joinDate) {
    errors.joinDate = employeeErrors.joinDateRequired;
  }

  if (!formData.salary) {
    errors.salary = employeeErrors.salaryRequired;
  } else if (Number(formData.salary) <= 0) {
    errors.salary = employeeErrors.invalidSalary;
  }

  if (!formData.address.trim()) {
    errors.address = employeeErrors.addressRequired;
  }

  if (!formData.city.trim()) {
    errors.city = employeeErrors.cityRequired;
  }

  if (!formData.state.trim()) {
    errors.state = employeeErrors.stateRequired;
  }

  if (!formData.zip.trim()) {
    errors.zip = employeeErrors.zipRequired;
  } else if (!/^\d{6}$/.test(formData.zip)) {
    errors.zip = employeeErrors.invalidZip;
  }

  return errors;
};