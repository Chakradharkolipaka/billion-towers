const ROLES = Object.freeze({
  USER: "user",
  ADMIN: "admin",
});

const ALLOWED_ROLES = Object.values(ROLES);

module.exports = { ROLES, ALLOWED_ROLES };
