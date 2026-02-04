export const USER_ROLES = {
  ADMIN: "admin",
  NORMAL_USER: "normal_user",
  STORE_OWNER: "store_owner",
};

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 16,
  UPPERCASE_REGEX: /[A-Z]/,
  SPECIAL_CHAR_REGEX: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

export const NAME_REQUIREMENTS = {
  MIN_LENGTH: 20,
  MAX_LENGTH: 60,
};

export const ADDRESS_REQUIREMENTS = {
  MAX_LENGTH: 400,
};

export const RATING_REQUIREMENTS = {
  MIN_VALUE: 1,
  MAX_VALUE: 5,
};
