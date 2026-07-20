const specValue = (specifications, title) =>
  specifications?.find((item) => item.title === title)?.description;

const detailsFromProduct = (product) => {
  if (product?.details && Object.keys(product.details).length) {
    const d = product.details;
    return {
      location: d.location || {},
      investment: {
        ...d.investment,
        availableShares: d.investment?.availableShares ?? product.stock,
      },
      property: d.property || {},
      financials: d.financials || {},
    };
  }

  const specifications = product.specifications || [];
  return {
    location: {
      city: specValue(specifications, "City"),
      state: specValue(specifications, "State"),
      country: specValue(specifications, "Country"),
    },
    investment: {
      totalShares: Number(specValue(specifications, "Total Shares")) || 1000,
      availableShares: product.stock ?? Number(specValue(specifications, "Available Shares")) ?? 0,
      investors: Number(specValue(specifications, "Investors")) || 0,
      targetYield: Number(specValue(specifications, "Target Yield")) || 8,
      projectedRoi: Number(specValue(specifications, "Projected ROI")) || 10,
      occupancyPercent: Number(specValue(specifications, "Occupancy")) || null,
    },
    property: {
      status: specValue(specifications, "Status") || "active",
      yearBuilt: Number(specValue(specifications, "Year Built")) || null,
      squareFootage: Number(specValue(specifications, "Square Footage")) || null,
      bedrooms: Number(specValue(specifications, "Bedrooms")) || null,
      bathrooms: Number(specValue(specifications, "Bathrooms")) || null,
      verified: specValue(specifications, "Verified") !== "false",
      isFeatured: specValue(specifications, "Featured") === "true",
    },
    financials: {
      monthlyRent: Number(specValue(specifications, "Monthly Rent")) || null,
      annualYield: Number(specValue(specifications, "Annual Yield")) || null,
      expenses: Number(specValue(specifications, "Monthly Expenses")) || null,
      netIncome: Number(specValue(specifications, "Net Monthly Income")) || null,
    },
  };
};

export function mapProductToProperty(product) {
  const details = detailsFromProduct(product);
  const { location, investment, property: propertyInfo, financials } = details;

  return {
    id: product._id,
    createdAt: product.createdAt,
    name: product.name,
    description: product.description,
    price: product.price,
    profit: investment.targetYield ?? 8,
    returns: investment.projectedRoi ?? 10,
    images: product.images?.map((image) => image.url) || [],
    location: {
      city: location.city || "TBD",
      state: location.state || "",
      country: location.country || "USA",
      address: location.address || "",
    },
    investors: investment.investors ?? 0,
    totalShares: investment.totalShares ?? 1000,
    availableShares: investment.availableShares ?? 0,
    status: propertyInfo.status || "active",
    category: product.category,
    features: product.highlights || [],
    isFeatured: Boolean(propertyInfo.isFeatured),
    verified: propertyInfo.verified !== false,
    yearBuilt: propertyInfo.yearBuilt,
    squareFootage: propertyInfo.squareFootage,
    bedrooms: propertyInfo.bedrooms,
    bathrooms: propertyInfo.bathrooms,
    occupancyPercent: investment.occupancyPercent,
    projectedRoi: investment.projectedRoi ?? 10,
    financials: {
      monthlyRent: financials.monthlyRent,
      annualYield: financials.annualYield ?? investment.targetYield,
      expenses: financials.expenses,
      netIncome: financials.netIncome,
    },
    blockchainListing: product.blockchainListing || null,
    details,
    _source: "api",
  };
}

export function buildProductPayload(form) {
  const imageUrls = form.imageUrl
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  const details = {
    location: {
      city: form.city,
      state: form.state,
      country: form.country || "USA",
      address: form.address || "",
    },
    investment: {
      totalShares: Number(form.totalShares),
      availableShares: Number(form.availableShares),
      investors: Number(form.investors || 0),
      targetYield: Number(form.targetYield),
      projectedRoi: Number(form.projectedRoi),
      occupancyPercent: Number(form.occupancy || 0),
    },
    property: {
      status: form.status || "active",
      yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : null,
      squareFootage: form.squareFootage ? Number(form.squareFootage) : null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      verified: form.verified !== false,
      isFeatured: Boolean(form.isFeatured),
    },
    financials: {
      monthlyRent: form.monthlyRent ? Number(form.monthlyRent) : null,
      annualYield: form.annualYield ? Number(form.annualYield) : null,
      expenses: form.expenses ? Number(form.expenses) : null,
      netIncome: form.netIncome ? Number(form.netIncome) : null,
    },
  };

  // Backend buildProductImages() expects array of URL strings, not objects
  // It will convert them to {url, public_id} format after upload
  const imageArray = imageUrls.length
    ? imageUrls
    : ["https://via.placeholder.com/800x600?text=Property"];

  return {
    name: form.name,
    description: form.description,
    price: Number(form.price),
    cuttedPrice: Number(form.cuttedPrice || form.price),
    category: form.category,
    stock: Number(form.availableShares),
    highlights: form.features
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    brandname: form.brandname || "Billion Towers",
    logo: form.logoUrl || "https://via.placeholder.com/150?text=BT",
    images: imageArray,
    details,
    specifications: [
      { title: "City", description: form.city || "N/A" },
      { title: "State", description: form.state || "N/A" },
      { title: "Country", description: form.country || "USA" },
      { title: "Total Shares", description: String(form.totalShares) },
      { title: "Available Shares", description: String(form.availableShares) },
      { title: "Investors", description: String(form.investors || 0) },
      { title: "Target Yield", description: String(form.targetYield) },
      { title: "Projected ROI", description: String(form.projectedRoi) },
      { title: "Occupancy", description: String(form.occupancy || 0) },
    ].filter(spec => spec.description && spec.description !== ""),
  };
}

export function mapPropertyToForm(property) {
  const details = property.details || detailsFromProduct(property);

  return {
    name: property.name || "",
    description: property.description || "",
    price: property.price ?? "",
    cuttedPrice: property.cuttedPrice ?? property.price ?? "",
    category: property.category || "residential",
    city: details.location?.city || property.location?.city || "",
    state: details.location?.state || property.location?.state || "",
    country: details.location?.country || property.location?.country || "USA",
    address: details.location?.address || "",
    totalShares: details.investment?.totalShares ?? property.totalShares ?? 1000,
    availableShares: details.investment?.availableShares ?? property.availableShares ?? property.stock ?? 0,
    investors: details.investment?.investors ?? property.investors ?? 0,
    targetYield: details.investment?.targetYield ?? property.profit ?? 8,
    projectedRoi: details.investment?.projectedRoi ?? property.projectedRoi ?? property.returns ?? 10,
    occupancy: details.investment?.occupancyPercent ?? property.occupancyPercent ?? 0,
    yearBuilt: details.property?.yearBuilt ?? property.yearBuilt ?? "",
    squareFootage: details.property?.squareFootage ?? property.squareFootage ?? "",
    bedrooms: details.property?.bedrooms ?? property.bedrooms ?? "",
    bathrooms: details.property?.bathrooms ?? property.bathrooms ?? "",
    status: details.property?.status ?? property.status ?? "active",
    verified: details.property?.verified ?? property.verified ?? true,
    isFeatured: details.property?.isFeatured ?? property.isFeatured ?? false,
    monthlyRent: details.financials?.monthlyRent ?? property.financials?.monthlyRent ?? "",
    annualYield: details.financials?.annualYield ?? property.financials?.annualYield ?? "",
    expenses: details.financials?.expenses ?? property.financials?.expenses ?? "",
    netIncome: details.financials?.netIncome ?? property.financials?.netIncome ?? "",
    features: (property.features || property.highlights || []).join(", "),
    imageUrl: (property.images || []).join("\n"),
    logoUrl: property.brand?.logo?.url || "",
    brandname: property.brand?.name || "Billion Towers",
  };
}

export function mapProductToForm(product) {
  const property = mapProductToProperty(product);
  return {
    ...mapPropertyToForm(property),
    cuttedPrice: product.cuttedPrice ?? product.price ?? "",
    imageUrl: product.images?.map((image) => image.url).join("\n") || "",
    logoUrl: product.brand?.logo?.url || "",
    brandname: product.brand?.name || "Billion Towers",
  };
}

export function buildDetailsPayload(form) {
  return {
    location: {
      city: form.city,
      state: form.state,
      country: form.country || "USA",
      address: form.address || "",
    },
    investment: {
      totalShares: Number(form.totalShares),
      availableShares: Number(form.availableShares),
      investors: Number(form.investors || 0),
      targetYield: Number(form.targetYield),
      projectedRoi: Number(form.projectedRoi),
      occupancyPercent: Number(form.occupancy || 0),
    },
    property: {
      status: form.status || "active",
      yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : null,
      squareFootage: form.squareFootage ? Number(form.squareFootage) : null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      verified: form.verified !== false,
      isFeatured: Boolean(form.isFeatured),
    },
    financials: {
      monthlyRent: form.monthlyRent ? Number(form.monthlyRent) : null,
      annualYield: form.annualYield ? Number(form.annualYield) : null,
      expenses: form.expenses ? Number(form.expenses) : null,
      netIncome: form.netIncome ? Number(form.netIncome) : null,
    },
  };
}
