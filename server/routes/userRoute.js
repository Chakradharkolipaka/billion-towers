const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword,
  validateUpdateProfile,
  validateUserIdParam,
  validateUpdateUserRole,
} = require("../middlewares/validate");
const {
  verifyUserExists,
  preventSelfDemotion,
  preventSelfDelete,
} = require("../middlewares/auth/ownership");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.route("/register").post(validateRegister, registerUser);
router.route("/login").post(validateLogin, loginUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/forgot").post(validateForgotPassword, forgotPassword);
router
  .route("/password/reset/:token")
  .put(validateResetPassword, resetPassword);

router
  .route("/password/update")
  .put(isAuthenticatedUser, validateUpdatePassword, updatePassword);

router
  .route("/me/update")
  .put(isAuthenticatedUser, validateUpdateProfile, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles(ROLES.ADMIN), getAllUsers);

router
  .route("/admin/user/:id")
  .get(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateUserIdParam,
    verifyUserExists,
    getSingleUser,
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateUpdateUserRole,
    verifyUserExists,
    preventSelfDemotion,
    updateUserRole,
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateUserIdParam,
    verifyUserExists,
    preventSelfDelete,
    deleteUser,
  );

module.exports = router;
