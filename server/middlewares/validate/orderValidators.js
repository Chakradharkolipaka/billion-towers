const { validateRequest } = require("./validateRequest");
const { ORDER_STATUS } = require("../../constants/orderStatus");

exports.validateCreateOrder = validateRequest({
  body: {
    totalPrice: {
      label: "Total price",
      rules: ["required", { type: "isNumber" }, { type: "min", value: 0 }],
    },
    "paymentInfo.id": { label: "Payment ID", rules: ["required"] },
    "paymentInfo.status": { label: "Payment status", rules: ["required"] },
    "shippingInfo.address": { label: "Address", rules: ["required"] },
    "shippingInfo.city": { label: "City", rules: ["required"] },
    "shippingInfo.state": { label: "State", rules: ["required"] },
    "shippingInfo.country": { label: "Country", rules: ["required"] },
    "shippingInfo.pincode": { label: "Pincode", rules: ["required", { type: "isNumber" }] },
    "shippingInfo.phoneNo": { label: "Phone number", rules: ["required", { type: "isNumber" }] },
    orderItems: {
      label: "Order items",
      rules: [{ type: "arrayMin", value: 1 }],
    },
  },
});

exports.validateOrderIdParam = validateRequest({
  params: {
    id: { label: "Order ID", rules: ["required", { type: "objectId" }] },
  },
});

exports.validateUpdateOrderStatus = validateRequest({
  params: {
    id: { label: "Order ID", rules: ["required", { type: "objectId" }] },
  },
  body: {
    status: {
      label: "Order status",
      rules: ["required", { type: "oneOf", value: ORDER_STATUS }],
    },
  },
});
