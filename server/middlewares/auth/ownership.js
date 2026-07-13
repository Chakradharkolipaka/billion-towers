const mongoose = require("mongoose");
const Order = require("../../models/orderModel");
const Investment = require("../../models/investmentModel");
const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const ErrorHandler = require("../../utils/errorHandler");
const asyncErrorHandler = require("../helpers/asyncErrorHandler");
const { ROLES } = require("../../constants/roles");

const isAdmin = (user) => user?.role === ROLES.ADMIN;

exports.verifyOrderAccess = asyncErrorHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  if (!isAdmin(req.user) && order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to access this order", 403));
  }

  req.resource = order;
  next();
});

exports.verifyInvestmentAccess = asyncErrorHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHandler("Investment Not Found", 404));
  }

  const investment = await Investment.findById(req.params.id);

  if (!investment) {
    return next(new ErrorHandler("Investment Not Found", 404));
  }

  const isOwner =
    investment.user &&
    req.user &&
    investment.user.toString() === req.user._id.toString();

  if (!isAdmin(req.user) && !isOwner) {
    return next(new ErrorHandler("Not authorized to access this investment", 403));
  }

  req.resource = investment;
  next();
});

exports.verifyProductExists = asyncErrorHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  req.resource = product;
  next();
});

exports.verifyUserExists = asyncErrorHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHandler("User doesn't exist", 404));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404));
  }

  req.resource = user;
  next();
});

exports.preventSelfDemotion = asyncErrorHandler(async (req, res, next) => {
  if (
    req.user._id.toString() === req.params.id &&
    req.body.role &&
    req.body.role !== ROLES.ADMIN &&
    req.user.role === ROLES.ADMIN
  ) {
    return next(new ErrorHandler("You cannot remove your own admin role", 400));
  }

  next();
});

exports.preventSelfDelete = asyncErrorHandler(async (req, res, next) => {
  if (req.user._id.toString() === req.params.id) {
    return next(new ErrorHandler("You cannot delete your own account", 400));
  }

  next();
});
