const { validateRequest } = require("./validateRequest");
const ErrorHandler = require("../../utils/errorHandler");
const {
  PROPERTY_STATUS,
  PRODUCT_DETAIL_SECTIONS,
} = require("../../constants/orderStatus");

const locationRules = {
  city: { label: "City", rules: [{ type: "minLength", value: 2 }] },
  state: { label: "State", rules: [] },
  country: { label: "Country", rules: [{ type: "minLength", value: 2 }] },
  address: { label: "Address", rules: [] },
};

const investmentRules = {
  totalShares: {
    label: "Total shares",
    rules: [{ type: "isNumber" }, { type: "min", value: 1 }],
  },
  availableShares: {
    label: "Available shares",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  investors: {
    label: "Investors",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  targetYield: {
    label: "Target yield",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  projectedRoi: {
    label: "Projected ROI",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  occupancyPercent: {
    label: "Occupancy",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }, { type: "max", value: 100 }],
  },
};

const propertyRules = {
  status: {
    label: "Status",
    rules: [{ type: "oneOf", value: PROPERTY_STATUS }],
  },
  yearBuilt: {
    label: "Year built",
    rules: [{ type: "isNumber" }, { type: "min", value: 1800 }],
  },
  squareFootage: {
    label: "Square footage",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  bedrooms: {
    label: "Bedrooms",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  bathrooms: {
    label: "Bathrooms",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  verified: { label: "Verified", rules: [] },
  isFeatured: { label: "Featured", rules: [] },
};

const financialsRules = {
  monthlyRent: {
    label: "Monthly rent",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  annualYield: {
    label: "Annual yield",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  expenses: {
    label: "Expenses",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
  netIncome: {
    label: "Net income",
    rules: [{ type: "isNumber" }, { type: "min", value: 0 }],
  },
};

const fullDetailsRules = {
  location: locationRules,
  investment: investmentRules,
  property: propertyRules,
  financials: financialsRules,
};

const flattenSectionRules = (sectionRules) =>
  Object.fromEntries(
    Object.entries(sectionRules).map(([field, config]) => [
      field,
      config,
    ]),
  );

exports.validateUpsertProductDetails = validateRequest({
  params: {
    id: { label: "Product ID", rules: ["required", { type: "objectId" }] },
  },
  body: {
    location: {
      label: "Location",
      rules: [
        (value) => {
          if (value == null) return null;
          if (typeof value !== "object") return "Location must be an object";
          return null;
        },
      ],
    },
    investment: {
      label: "Investment",
      rules: [
        (value) => {
          if (value == null) return null;
          if (typeof value !== "object") return "Investment must be an object";
          return null;
        },
      ],
    },
    property: {
      label: "Property",
      rules: [
        (value) => {
          if (value == null) return null;
          if (typeof value !== "object") return "Property must be an object";
          return null;
        },
      ],
    },
    financials: {
      label: "Financials",
      rules: [
        (value) => {
          if (value == null) return null;
          if (typeof value !== "object") return "Financials must be an object";
          return null;
        },
      ],
    },
  },
});

exports.validatePatchProductDetailsSection = (req, res, next) => {
  const section = req.params.section;

  if (!PRODUCT_DETAIL_SECTIONS.includes(section)) {
    return next(
      new ErrorHandler(
        `Invalid section. Allowed: ${PRODUCT_DETAIL_SECTIONS.join(", ")}`,
        400,
      ),
    );
  }

  const sectionMap = {
    location: locationRules,
    investment: investmentRules,
    property: propertyRules,
    financials: financialsRules,
  };

  return validateRequest({
    params: {
      id: { label: "Product ID", rules: ["required", { type: "objectId" }] },
      section: {
        label: "Section",
        rules: ["required", { type: "oneOf", value: PRODUCT_DETAIL_SECTIONS }],
      },
    },
    body: flattenSectionRules(sectionMap[section]),
  })(req, res, next);
};

exports.validateProductDetailsParam = validateRequest({
  params: {
    id: { label: "Product ID", rules: ["required", { type: "objectId" }] },
  },
});

module.exports.sectionRules = fullDetailsRules;
