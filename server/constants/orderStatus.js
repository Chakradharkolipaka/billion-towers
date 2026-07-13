const ORDER_STATUS = Object.freeze([
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
]);

const INVESTMENT_STATUS = Object.freeze([
  "pending",
  "processing",
  "completed",
  "failed",
]);

const PAYMENT_METHODS = Object.freeze([
  "wallet",
  "card",
  "bank",
  "google_pay",
  "apple_pay",
]);

const PRODUCT_CATEGORIES = Object.freeze([
  "residential",
  "commercial",
  "industrial",
  "mixed-use",
]);

const PROPERTY_STATUS = Object.freeze([
  "active",
  "pending",
  "sold",
  "draft",
]);

const PRODUCT_DETAIL_SECTIONS = Object.freeze([
  "location",
  "investment",
  "property",
  "financials",
]);

module.exports = {
  ORDER_STATUS,
  INVESTMENT_STATUS,
  PAYMENT_METHODS,
  PRODUCT_CATEGORIES,
  PROPERTY_STATUS,
  PRODUCT_DETAIL_SECTIONS,
};
