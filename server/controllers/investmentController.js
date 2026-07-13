const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const Investment = require("../models/investmentModel");
const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const { PAYMENT_METHODS } = require("../constants/orderStatus");

exports.createInvestment = asyncErrorHandler(async (req, res, next) => {
  const {
    propertyId,
    propertyName,
    shares,
    amount,
    method,
    walletAddress,
    email,
    phone,
    paymentMeta,
  } = req.body;

  if (!PAYMENT_METHODS.includes(method)) {
    return next(new ErrorHandler("Invalid payment method", 400));
  }

  let product = null;
  if (mongoose.Types.ObjectId.isValid(propertyId)) {
    product = await Product.findById(propertyId);
  }

  if (product && Number(shares) > product.stock) {
    return next(
      new ErrorHandler(
        `Only ${product.stock} share(s) available for this property`,
        400,
      ),
    );
  }

  const investment = await Investment.create({
    user: req.user._id,
    propertyId,
    propertyName,
    shares: Number(shares),
    amount: Number(amount),
    method,
    walletAddress,
    email,
    phone,
    paymentMeta: paymentMeta || {},
    transactionRef: `inv_${uuidv4()}`,
    status: method === "bank" ? "pending" : "processing",
  });

  if (product) {
    product.stock = Math.max(0, product.stock - Number(shares));
    await product.save({ validateBeforeSave: false });
  }

  res.status(201).json({
    success: true,
    investment,
    message:
      method === "bank"
        ? "Bank transfer initiated. You will receive wiring instructions by email."
        : "Payment received and is being processed.",
  });
});

exports.getMyInvestments = asyncErrorHandler(async (req, res, next) => {
  const investments = await Investment.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    investments,
  });
});

exports.getInvestmentById = asyncErrorHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    investment: req.resource,
  });
});

exports.getAllInvestments = asyncErrorHandler(async (req, res, next) => {
  const investments = await Investment.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  const totalAmount = investments.reduce((sum, item) => sum + item.amount, 0);

  res.status(200).json({
    success: true,
    investments,
    totalAmount,
    count: investments.length,
  });
});

exports.updateInvestmentStatus = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.body;
  const investment = req.resource;

  investment.status = status;
  await investment.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    investment,
  });
});
