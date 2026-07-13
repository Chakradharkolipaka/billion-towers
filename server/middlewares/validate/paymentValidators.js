const { validateRequest } = require("./validateRequest");
const { PAYMENT_METHODS } = require("../../constants/orderStatus");

exports.validateProcessPayment = validateRequest({
  body: {
    amount: {
      label: "Amount",
      rules: ["required", { type: "isNumber" }, { type: "min", value: 1 }],
    },
    email: { label: "Email", rules: ["required", "email"] },
    phoneNo: {
      label: "Phone number",
      rules: ["required", { type: "minLength", value: 8 }],
    },
  },
});

exports.validateCreateInvestment = validateRequest({
  body: {
    propertyId: { label: "Property ID", rules: ["required"] },
    propertyName: { label: "Property name", rules: ["required", { type: "minLength", value: 3 }] },
    shares: {
      label: "Shares",
      rules: ["required", { type: "isNumber" }, { type: "min", value: 1 }],
    },
    amount: {
      label: "Amount",
      rules: ["required", { type: "isNumber" }, { type: "min", value: 0.01 }],
    },
    method: {
      label: "Payment method",
      rules: ["required", { type: "oneOf", value: PAYMENT_METHODS }],
    },
    email: { label: "Email", rules: ["required", "email"] },
    walletAddress: {
      label: "Wallet address",
      rules: [
        (value, data) => {
          if (data.method === "wallet" && !value) {
            return "Wallet address is required for wallet payments";
          }
          return null;
        },
      ],
    },
  },
});

exports.validatePaymentStatusParam = validateRequest({
  params: {
    id: { label: "Order ID", rules: ["required"] },
  },
});

const { INVESTMENT_STATUS } = require("../../constants/orderStatus");

exports.validateUpdateInvestmentStatus = validateRequest({
  params: {
    id: { label: "Investment ID", rules: ["required", { type: "objectId" }] },
  },
  body: {
    status: {
      label: "Investment status",
      rules: ["required", { type: "oneOf", value: INVESTMENT_STATUS }],
    },
  },
});

exports.validateInvestmentIdParam = validateRequest({
  params: {
    id: { label: "Investment ID", rules: ["required", { type: "objectId" }] },
  },
});
