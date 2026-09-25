import { employeeErrors } from "./employeeError";

export function validateEmployee(formData) {

  let errors = {};

  if (formData.firstName.trim() === "") {
    errors.firstName = employeeErrors.firstNameRequired;
  } else {
    let firstNameValid = /^[A-Za-z\s]+$/.test(formData.firstName);

    if (!firstNameValid) {
      errors.firstName = employeeErrors.invalidFirstName;
    }
  }

  if (formData.lastName.trim() === "") {
    errors.lastName = employeeErrors.lastNameRequired;
  } else {
    let lastNameValid = /^[A-Za-z\s]+$/.test(formData.lastName);

    if (!lastNameValid) {
      errors.lastName = employeeErrors.invalidLastName;
    }
  }

  if (formData.email.trim() === "") {
    errors.email = employeeErrors.emailRequired;
  } else {
    let emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    if (!emailValid) {
      errors.email = employeeErrors.invalidEmail;
    }
  }

  if (formData.phone.trim() === "") {
    errors.phone = employeeErrors.phoneRequired;
  } else {
    let phoneValid = /^\+91\s?[6-9]\d{9}$|^[6-9]\d{9}$/.test(formData.phone);

    if (!phoneValid) {
      errors.phone = employeeErrors.invalidPhone;
    }
  }

  if (formData.gender === "") {
    errors.gender = employeeErrors.genderRequired;
  }

  if (formData.dob === "") {
    errors.dob = employeeErrors.dobRequired;
  }

  if (formData.department === "") {
    errors.department = employeeErrors.departmentRequired;
  }

  if (formData.designation === "") {
    errors.designation = employeeErrors.designationRequired;
  }

  if (formData.employeeType === "") {
    errors.employeeType = employeeErrors.employeeTypeRequired;
  }

  if (formData.status === "") {
    errors.status = employeeErrors.statusRequired;
  }

  if (formData.joinDate === "") {
    errors.joinDate = employeeErrors.joinDateRequired;
  }

  if (formData.salary === "") {
    errors.salary = employeeErrors.salaryRequired;
  } else {
    if (Number(formData.salary) <= 0) {
      errors.salary = employeeErrors.invalidSalary;
    }
  }

  if (formData.address.trim() === "") {
    errors.address = employeeErrors.addressRequired;
  }

  if (formData.city.trim() === "") {
    errors.city = employeeErrors.cityRequired;
  }

  if (formData.state.trim() === "") {
    errors.state = employeeErrors.stateRequired;
  }

  if (formData.zip.trim() === "") {
    errors.zip = employeeErrors.zipRequired;
  } else {
    let zipValid = /^\d{6}$/.test(formData.zip);

    if (!zipValid) {
      errors.zip = employeeErrors.invalidZip;
    }
  }

  return errors;
}