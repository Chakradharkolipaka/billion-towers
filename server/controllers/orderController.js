const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");

const { ORDER_STATUS } = require("../constants/orderStatus");

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, totalPrice } = req.body;

  if (!Array.isArray(orderItems) || !orderItems.length) {
    return next(new ErrorHandler("Order must include at least one item", 400));
  }

  for (const item of orderItems) {
    if (!item.product || !item.quantity || !item.price) {
      return next(new ErrorHandler("Each order item must include product, quantity, and price", 400));
    }

    const product = await Product.findById(item.product);
    if (!product) {
      return next(new ErrorHandler(`Product not found: ${item.product}`, 404));
    }

    if (product.stock < item.quantity) {
      return next(
        new ErrorHandler(`Insufficient stock for ${product.name}`, 400),
      );
    }
  }

  const orderExist = await Order.findOne({ paymentInfo });

  if (orderExist) {
    return next(new ErrorHandler("Order Already Placed", 400));
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  await sendEmail({
    email: req.user.email,
    templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
    data: {
      name: req.user.name,
      shippingInfo,
      orderItems,
      totalPrice,
      oid: order._id,
    },
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {
  await req.resource.populate("user", "name email");

  res.status(200).json({
    success: true,
    order: req.resource,
  });
});

// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find();

  if (!orders) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

// Update Order Status ---ADMIN
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  if (!ORDER_STATUS.includes(req.body.status)) {
    return next(new ErrorHandler("Invalid order status", 400));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Already Delivered", 400));
  }

  if (req.body.status === "Shipped") {
    order.shippedAt = Date.now();
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }
  }

  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete Order ---ADMIN
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});
