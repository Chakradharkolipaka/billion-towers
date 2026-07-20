const defaultProductDetails = () => ({
  location: {
    city: "",
    state: "",
    country: "USA",
    address: "",
  },
  investment: {
    totalShares: 1000,
    availableShares: 0,
    investors: 0,
    targetYield: 8,
    projectedRoi: 10,
    occupancyPercent: 0,
  },
  property: {
    status: "active",
    yearBuilt: null,
    squareFootage: null,
    bedrooms: null,
    bathrooms: null,
    verified: true,
    isFeatured: false,
  },
  financials: {
    monthlyRent: null,
    annualYield: null,
    expenses: null,
    netIncome: null,
  },
});

const specValue = (specifications = [], title) =>
  specifications.find((item) => item.title === title)?.description;

const specificationsToDetails = (product) => {
  const specs = product.specifications || [];
  const base = defaultProductDetails();

  if (!specs.length && product.details) {
    return normalizeProductDetails(product);
  }

  return {
    location: {
      city: specValue(specs, "City") || base.location.city,
      state: specValue(specs, "State") || base.location.state,
      country: specValue(specs, "Country") || base.location.country,
      address: specValue(specs, "Address") || base.location.address,
    },
    investment: {
      totalShares: Number(specValue(specs, "Total Shares")) || base.investment.totalShares,
      availableShares:
        product.stock ??
        Number(specValue(specs, "Available Shares")) ??
        base.investment.availableShares,
      investors: Number(specValue(specs, "Investors")) || base.investment.investors,
      targetYield: Number(specValue(specs, "Target Yield")) || base.investment.targetYield,
      projectedRoi: Number(specValue(specs, "Projected ROI")) || base.investment.projectedRoi,
      occupancyPercent:
        Number(specValue(specs, "Occupancy")) || base.investment.occupancyPercent,
    },
    property: {
      status: specValue(specs, "Status") || base.property.status,
      yearBuilt: Number(specValue(specs, "Year Built")) || base.property.yearBuilt,
      squareFootage: Number(specValue(specs, "Square Footage")) || base.property.squareFootage,
      bedrooms: Number(specValue(specs, "Bedrooms")) || base.property.bedrooms,
      bathrooms: Number(specValue(specs, "Bathrooms")) || base.property.bathrooms,
      verified: specValue(specs, "Verified") !== "false",
      isFeatured: specValue(specs, "Featured") === "true",
    },
    financials: {
      monthlyRent: Number(specValue(specs, "Monthly Rent")) || base.financials.monthlyRent,
      annualYield: Number(specValue(specs, "Annual Yield")) || base.financials.annualYield,
      expenses: Number(specValue(specs, "Monthly Expenses")) || base.financials.expenses,
      netIncome: Number(specValue(specs, "Net Monthly Income")) || base.financials.netIncome,
    },
  };
};

const normalizeProductDetails = (product) => {
  if (product?.details && Object.keys(product.details).length) {
    const base = defaultProductDetails();
    return {
      location: { ...base.location, ...(product.details.location || {}) },
      investment: {
        ...base.investment,
        ...(product.details.investment || {}),
        availableShares:
          product.details.investment?.availableShares ?? product.stock ?? base.investment.availableShares,
      },
      property: { ...base.property, ...(product.details.property || {}) },
      financials: { ...base.financials, ...(product.details.financials || {}) },
    };
  }

  return specificationsToDetails(product);
};

const detailsToSpecifications = (details) => [
  { title: "City", description: String(details.location?.city || "") },
  { title: "State", description: String(details.location?.state || "") },
  { title: "Country", description: String(details.location?.country || "USA") },
  { title: "Address", description: String(details.location?.address || "") },
  { title: "Total Shares", description: String(details.investment?.totalShares ?? 1000) },
  {
    title: "Available Shares",
    description: String(details.investment?.availableShares ?? 0),
  },
  { title: "Investors", description: String(details.investment?.investors ?? 0) },
  { title: "Target Yield", description: String(details.investment?.targetYield ?? 8) },
  { title: "Projected ROI", description: String(details.investment?.projectedRoi ?? 10) },
  { title: "Occupancy", description: String(details.investment?.occupancyPercent ?? 0) },
  { title: "Status", description: String(details.property?.status || "active") },
  { title: "Year Built", description: String(details.property?.yearBuilt ?? "") },
  { title: "Square Footage", description: String(details.property?.squareFootage ?? "") },
  { title: "Bedrooms", description: String(details.property?.bedrooms ?? "") },
  { title: "Bathrooms", description: String(details.property?.bathrooms ?? "") },
  { title: "Verified", description: String(details.property?.verified !== false) },
  { title: "Featured", description: String(Boolean(details.property?.isFeatured)) },
  { title: "Monthly Rent", description: String(details.financials?.monthlyRent ?? "") },
  { title: "Annual Yield", description: String(details.financials?.annualYield ?? "") },
  { title: "Monthly Expenses", description: String(details.financials?.expenses ?? "") },
  { title: "Net Monthly Income", description: String(details.financials?.netIncome ?? "") },
].filter(spec => spec.description && spec.description.trim() !== "" && spec.description !== "null");

const mergeDetailsFromBody = (body = {}, existingProduct = null) => {
  const current = existingProduct
    ? normalizeProductDetails(existingProduct)
    : defaultProductDetails();

  return {
    location: { ...current.location, ...(body.location || {}) },
    investment: { ...current.investment, ...(body.investment || {}) },
    property: { ...current.property, ...(body.property || {}) },
    financials: { ...current.financials, ...(body.financials || {}) },
  };
};

const mergeDetailsSection = (section, payload = {}, existingProduct) => {
  const current = normalizeProductDetails(existingProduct);
  return {
    ...current,
    [section]: {
      ...current[section],
      ...payload,
    },
  };
};

const syncDetailsToProductUpdate = (details) => ({
  details,
  specifications: detailsToSpecifications(details),
  stock: details.investment?.availableShares ?? 0,
});

const buildDetailsResponse = (product) => ({
  productId: product._id,
  name: product.name,
  category: product.category,
  price: product.price,
  details: normalizeProductDetails(product),
});

module.exports = {
  defaultProductDetails,
  normalizeProductDetails,
  specificationsToDetails,
  detailsToSpecifications,
  mergeDetailsFromBody,
  mergeDetailsSection,
  syncDetailsToProductUpdate,
  buildDetailsResponse,
};
