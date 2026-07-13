const { validateRequest } = require("./validateRequest");
const ErrorHandler = require("../../utils/errorHandler");
const { PRODUCT_CATEGORIES } = require("../../constants/orderStatus");

const productBodyRules = {
  name: { label: "Property name", rules: ["required", { type: "minLength", value: 3 }] },
  description: {
    label: "Description",
    rules: ["required", { type: "minLength", value: 10 }],
  },
  price: {
    label: "Price",
    rules: ["required", { type: "isNumber" }, { type: "min", value: 0 }],
  },
  cuttedPrice: {
    label: "Cut price",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  category: {
    label: "Category",
    rules: ["required", { type: "oneOf", value: PRODUCT_CATEGORIES }],
  },
  stock: {
    label: "Available shares",
    rules: ["required", { type: "isNumber" }, { type: "min", value: 0 }],
  },
  highlights: {
    label: "Highlights",
    rules: [
      (value) => {
        if (value == null) return null;
        if (!Array.isArray(value)) return "Highlights must be an array";
        return null;
      },
    ],
  },
  specifications: {
    label: "Specifications",
    rules: [
      (value) => {
        if (value == null) return null;
        if (!Array.isArray(value)) return "Specifications must be an array";
        return null;
      },
    ],
  },
  images: {
    label: "Images",
    rules: [
      (value) => {
        if (value == null) return "At least one image is required";
        const images = Array.isArray(value) ? value : [value];
        if (!images.length) return "At least one image is required";
        return null;
      },
    ],
  },
  brandname: {
    label: "Brand name",
    rules: [{ type: "minLength", value: 2 }],
  },
};

const optionalFieldRules = (rules, body) =>
  Object.fromEntries(
    Object.entries(rules)
      .filter(([field]) => body[field] !== undefined)
      .map(([field, config]) => [
        field,
        {
          label: config.label,
          rules: config.rules.filter((rule) => rule !== "required"),
        },
      ]),
  );

exports.validateCreateProduct = validateRequest({
  body: productBodyRules,
});

exports.validateUpdateProduct = validateRequest({
  params: {
    id: { label: "Product ID", rules: ["required", { type: "objectId" }] },
  },
  body: productBodyRules,
});

exports.validatePatchProduct = (req, res, next) => {
  const bodyRules = optionalFieldRules(productBodyRules, req.body);

  if (!Object.keys(bodyRules).length && req.body.logo === undefined) {
    return next(new ErrorHandler("No valid fields provided to update", 400));
  }

  return validateRequest({
    params: {
      id: { label: "Product ID", rules: ["required", { type: "objectId" }] },
    },
    body: bodyRules,
  })(req, res, next);
};

exports.validateBulkDeleteProducts = validateRequest({
  body: {
    ids: {
      label: "Product IDs",
      rules: [
        { type: "arrayMin", value: 1 },
        (value) => {
          if (!Array.isArray(value)) return "Product IDs must be an array";
          const invalid = value.find((id) => !require("mongoose").Types.ObjectId.isValid(String(id)));
          if (invalid) return "Each product id must be a valid identifier";
          return null;
        },
      ],
    },
  },
});

exports.validateProductIdParam = validateRequest({
  params: {
    id: { label: "Product ID", rules: ["required", { type: "objectId" }] },
  },
});

exports.validateCreateReview = validateRequest({
  body: {
    productId: { label: "Product ID", rules: ["required", { type: "objectId" }] },
    rating: {
      label: "Rating",
      rules: ["required", { type: "isNumber" }, { type: "min", value: 1 }, { type: "max", value: 5 }],
    },
    comment: {
      label: "Comment",
      rules: ["required", { type: "minLength", value: 3 }],
    },
  },
});

exports.validateDeleteReview = validateRequest({
  query: {
    id: { label: "Review ID", rules: ["required", { type: "objectId" }] },
    productId: { label: "Product ID", rules: ["required", { type: "objectId" }] },
  },
});

exports.validateProductReviewsQuery = validateRequest({
  query: {
    id: { label: "Product ID", rules: ["required", { type: "objectId" }] },
  },
});
