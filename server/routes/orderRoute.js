const express = require("express");
const {
  newOrder,
  getSingleOrderDetails,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/user_actions/auth");
const {
  validateCreateOrder,
  validateOrderIdParam,
  validateUpdateOrderStatus,
  validator
} = require("../middlewares/validate");
const { verifyOrderAccess } = require("../middlewares/auth/ownership");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router
  .route("/order/new")
  .post(isAuthenticatedUser, validateCreateOrder, newOrder);

router
  .route("/order/:id")
  .get(
    isAuthenticatedUser,
    validateOrderIdParam,
    verifyOrderAccess,
    getSingleOrderDetails,
  );

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles(ROLES.ADMIN), getAllOrders);

router
  .route("/admin/order/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateUpdateOrderStatus,
    updateOrder,
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles(ROLES.ADMIN),
    validateOrderIdParam,
    deleteOrder,
  );

module.exports = router;
