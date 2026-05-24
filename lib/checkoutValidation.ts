export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  governorate: number;
  city: string;
  detailedAddress: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  governorate?: string;
  city?: string;
  detailedAddress?: string;
}

// Egyptian phone number regex: accepts 010, 011, 012, 015 with optional +20 country code
const PHONE_REGEX = /^(?:\+20|0)?1[0125]\d{8}$/;

export const validateCheckoutForm = (
  data: Partial<CheckoutFormData>,
): FormErrors => {
  const errors: FormErrors = {};

  // First Name validation
  if (!data.firstName || data.firstName.trim() === "") {
    errors.firstName = "First name is required";
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  } else if (data.firstName.trim().length > 50) {
    errors.firstName = "First name must not exceed 50 characters";
  }

  // Last Name validation
  if (!data.lastName || data.lastName.trim() === "") {
    errors.lastName = "Last name is required";
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  } else if (data.lastName.trim().length > 50) {
    errors.lastName = "Last name must not exceed 50 characters";
  }

  // Phone Number validation
  if (!data.phoneNumber || data.phoneNumber.trim() === "") {
    errors.phoneNumber = "Phone number is required";
  } else if (!PHONE_REGEX.test(data.phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number";
  }

  // Governorate validation
  if (!data.governorate || data.governorate === 0) {
    errors.governorate = "Please select a governorate";
  }

  // City validation
  if (!data.city || data.city.trim() === "") {
    errors.city = "Please select a city";
  }

  // Detailed Address validation
  if (!data.detailedAddress || data.detailedAddress.trim() === "") {
    errors.detailedAddress = "Detailed address is required";
  } else if (data.detailedAddress.trim().length < 10) {
    errors.detailedAddress = "Detailed address must be at least 10 characters";
  } else if (data.detailedAddress.trim().length > 200) {
    errors.detailedAddress = "Detailed address must not exceed 200 characters";
  }

  return errors;
};

export const isFormValid = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};
