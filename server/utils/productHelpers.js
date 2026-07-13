const { uploadImage, destroyImage } = require("./mediaUpload");

const parseSpecifications = (specifications = []) =>
  specifications.map((spec) =>
    typeof spec === "string" ? JSON.parse(spec) : spec,
  );

const normalizeImages = (images) => {
  if (!images) return [];
  return typeof images === "string" ? [images] : images;
};

const buildProductImages = async (images) => {
  const normalized = normalizeImages(images);
  const uploaded = [];

  for (let i = 0; i < normalized.length; i++) {
    uploaded.push(await uploadImage(normalized[i], "products"));
  }

  return uploaded;
};

const buildBrand = async (logo, brandname, fallbackName = "Billion Towers") => {
  const brandLogo = await uploadImage(
    logo || "https://via.placeholder.com/150?text=BT",
    "brands",
  );

  return {
    name: brandname || fallbackName,
    logo: brandLogo,
  };
};

const applyProductDefaults = (body) => ({
  ...body,
  cuttedPrice: body.cuttedPrice ?? body.price,
  highlights: body.highlights || [],
  specifications: body.specifications
    ? parseSpecifications(body.specifications)
    : [],
  warranty: body.warranty ?? 1,
  ratings: body.ratings ?? 0,
  numOfReviews: body.numOfReviews ?? 0,
});

const destroyProductAssets = async (product) => {
  if (!product) return;

  for (const image of product.images || []) {
    await destroyImage(image.public_id);
  }

  if (product.brand?.logo?.public_id) {
    await destroyImage(product.brand.logo.public_id);
  }
};

const recalculateRatings = (reviews = []) => {
  if (!reviews.length) {
    return { ratings: 0, numOfReviews: 0 };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    ratings: total / reviews.length,
    numOfReviews: reviews.length,
  };
};

const pickUpdatableFields = (body) => {
  const allowed = [
    "name",
    "description",
    "price",
    "cuttedPrice",
    "category",
    "stock",
    "highlights",
    "specifications",
    "warranty",
  ];

  return Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key)),
  );
};

module.exports = {
  parseSpecifications,
  normalizeImages,
  buildProductImages,
  buildBrand,
  applyProductDefaults,
  destroyProductAssets,
  recalculateRatings,
  pickUpdatableFields,
};
