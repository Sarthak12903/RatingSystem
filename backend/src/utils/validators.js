import {
  PASSWORD_REQUIREMENTS,
  NAME_REQUIREMENTS,
  ADDRESS_REQUIREMENTS,
  RATING_REQUIREMENTS,
} from "./constants.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

export const validatePassword = (password) => {
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`,
    };
  }
  if (password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH) {
    return {
      valid: false,
      error: `Password must be at most ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters`,
    };
  }
  if (!PASSWORD_REQUIREMENTS.UPPERCASE_REGEX.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }
  if (!PASSWORD_REQUIREMENTS.SPECIAL_CHAR_REGEX.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one special character",
    };
  }
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: "Name is required",
    };
  }
  return { valid: true };
};

export const validateAddress = (address) => {
  if (address.length > ADDRESS_REQUIREMENTS.MAX_LENGTH) {
    return {
      valid: false,
      error: `Address must be at most ${ADDRESS_REQUIREMENTS.MAX_LENGTH} characters`,
    };
  }
  return { valid: true };
};

export const validateRating = (rating) => {
  const ratingNum = Number(rating);
  if (
    isNaN(ratingNum) ||
    ratingNum < RATING_REQUIREMENTS.MIN_VALUE ||
    ratingNum > RATING_REQUIREMENTS.MAX_VALUE
  ) {
    return {
      valid: false,
      error: `Rating must be between ${RATING_REQUIREMENTS.MIN_VALUE} and ${RATING_REQUIREMENTS.MAX_VALUE}`,
    };
  }
  return { valid: true };
};

export const validateUserSignup = (data) => {
  const errors = [];

  const nameValidation = validateName(data.name);
  if (!nameValidation.valid) {
    errors.push(nameValidation.error);
  }

  if (!validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.push(passwordValidation.error);
  }

  if (data.address) {
    const addressValidation = validateAddress(data.address);
    if (!addressValidation.valid) {
      errors.push(addressValidation.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
  };
};

export const validateStoreData = (data) => {
  const errors = [];

  const nameValidation = validateName(data.name);
  if (!nameValidation.valid) {
    errors.push(nameValidation.error);
  }

  if (!validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!data.address) {
    errors.push("Address is required");
  } else {
    const addressValidation = validateAddress(data.address);
    if (!addressValidation.valid) {
      errors.push(addressValidation.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
  };
};
