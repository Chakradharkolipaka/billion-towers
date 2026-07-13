const { validateRequest, rules } = require("./validateRequest");
const { ALLOWED_ROLES } = require("../../constants/roles");

const passwordRules = [
  "required",
  { type: "minLength", value: 8, label: "Password" },
  {
    type: "matches",
    pattern: /\d/,
    message: "Password must contain at least one number",
  },
];

exports.validateRegister = validateRequest({
  body: {
    name: { label: "Name", rules: ["required", { type: "minLength", value: 2 }] },
    email: { label: "Email", rules: ["required", "email"] },
    password: { label: "Password", rules: passwordRules },
    gender: { label: "Gender", rules: ["required", { type: "minLength", value: 2 }] },
  },
});

exports.validateLogin = validateRequest({
  body: {
    email: { label: "Email", rules: ["required", "email"] },
    password: { label: "Password", rules: ["required"] },
  },
});

exports.validateForgotPassword = validateRequest({
  body: {
    email: { label: "Email", rules: ["required", "email"] },
  },
});

exports.validateResetPassword = validateRequest({
  params: {
    token: { label: "Reset token", rules: ["required", { type: "minLength", value: 10 }] },
  },
  body: {
    password: { label: "Password", rules: passwordRules },
  },
});

exports.validateUpdatePassword = validateRequest({
  body: {
    oldPassword: { label: "Current password", rules: ["required"] },
    newPassword: { label: "New password", rules: passwordRules },
  },
});

exports.validateUpdateProfile = validateRequest({
  body: {
    name: { label: "Name", rules: ["required", { type: "minLength", value: 2 }] },
    email: { label: "Email", rules: ["required", "email"] },
  },
});

exports.validateUserIdParam = validateRequest({
  params: {
    id: { label: "User ID", rules: ["required", { type: "objectId" }] },
  },
});

exports.validateUpdateUserRole = validateRequest({
  params: {
    id: { label: "User ID", rules: ["required", { type: "objectId" }] },
  },
  body: {
    name: { label: "Name", rules: ["required", { type: "minLength", value: 2 }] },
    email: { label: "Email", rules: ["required", "email"] },
    gender: { label: "Gender", rules: ["required"] },
    role: {
      label: "Role",
      rules: ["required", { type: "oneOf", value: ALLOWED_ROLES }],
    },
  },
});
