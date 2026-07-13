const express = require("express");
const {
  processPayment,
  paytmResponse,
  getPaymentStatus,
} = require("../controllers/paymentController");
const {
  createInvestment,
  getMyInvestments,
  getInvestmentById,
  getAllInvestments,
  updateInvestmentStatus,
} = require("../controllers/investmentController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");
const {
  validateProcessPayment,
  validateCreateInvestment,
  validatePaymentStatusParam,
  validateInvestmentIdParam,
  validateUpdateInvestmentStatus,
} = require("../middlewares/validate");
const { verifyInvestmentAccess } = require("../middlewares/auth/ownership");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router
  .route("/payment/process")
  .post(isAuthenticatedUser, validateProcessPayment, processPayment);

router
  .route("/investment")
  .post(isAuthenticatedUser, validateCreateInvestment, createInvestment);

router.route("/investments/me").get(isAuthenticatedUser, getMyInvestments);

router
  .route("/investment/:id")
  .get(
    isAuthenticatedUser,
    validateInvestmentIdParam,
    verifyInvestmentAccess,
    getInvestmentById,
  );

router
  .route("/admin/investments")
  .get(isAuthenticatedUser, authorizeRoles(ROLES.ADMIN), getAllInvestments);

router
  .route("/admin/investment/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateUpdateInvestmentStatus,
    verifyInvestmentAccess,
    updateInvestmentStatus,
  );

router.route("/callback").post(paytmResponse);

router
  .route("/payment/status/:id")
  .get(isAuthenticatedUser, validatePaymentStatusParam, getPaymentStatus);

module.exports = router;
